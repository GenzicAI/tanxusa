/**
 * Speech playback for the UI.
 *
 * Neural audio (MP3) is generated in Python and played HERE rather than there,
 * which buys two things: MP3 playback at all (winsound can't), and a real
 * `AnalyserNode` on the actual voice — so the orb and the voice wave move to
 * what is genuinely being said instead of a canned envelope.
 *
 * Chunks are pipelined the way the Victoria build learned to do it: start
 * generating chunk N+1 *before* playing chunk N, and only ever wait on the
 * first (deliberately short) chunk. Generation is faster than speech, so after
 * the first piece the pipeline stays ahead and playback is gapless.
 *
 * If the neural path is unavailable — no network, service refused — this falls
 * back to the offline Windows voice driven from Python. Robotic, but never
 * silent.
 */
(function () {
  const api = () => window.pywebview && window.pywebview.api;

  let audioCtx = null;
  let analyser = null;
  let freq = null;
  let current = null;      // the <audio> element in flight
  let runId = 0;           // invalidates an in-flight chunk sequence
  let speaking = false;
  let onStateChange = null;
  let fallbackResolve = null;

  function setSpeaking(next) {
    if (speaking === next) return;
    speaking = next;
    if (onStateChange) onStateChange(next);
  }

  /** 0..1 loudness right now — real analysis when we have it. */
  function amplitude() {
    if (analyser && freq) {
      analyser.getByteFrequencyData(freq);
      let sum = 0;
      for (let i = 0; i < freq.length; i++) sum += freq[i];
      return Math.min(1, sum / freq.length / 80);
    }
    if (speaking) {
      // The offline Windows voice exposes no audio stream, so this path gets a
      // synthesised envelope — same compromise the original made for browser
      // speech synthesis.
      const now = Date.now();
      return Math.max(0, 0.4 + Math.sin(now / 90) * 0.22 + Math.sin(now / 37) * 0.12);
    }
    return 0;
  }

  function stop() {
    runId++;
    if (current) {
      current.pause();
      current = null;
    }
    analyser = null;
    freq = null;
    setSpeaking(false);
    if (fallbackResolve) {
      const resolve = fallbackResolve;
      fallbackResolve = null;
      resolve(false);
    }
    try {
      api().stop_speaking();
    } catch (err) {
      /* window closing */
    }
  }

  function makeAudio(b64, mime) {
    const audio = new Audio("data:" + (mime || "audio/mpeg") + ";base64," + b64);
    audio.preservesPitch = true;
    return audio;
  }

  function playClip(audio) {
    current = audio;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) {
        audioCtx = audioCtx || new Ctx();
        if (audioCtx.state === "suspended") audioCtx.resume();
        const source = audioCtx.createMediaElementSource(audio);
        const node = audioCtx.createAnalyser();
        node.fftSize = 128;
        source.connect(node);
        node.connect(audioCtx.destination);
        analyser = node;
        freq = new Uint8Array(node.frequencyBinCount);
      }
    } catch (err) {
      // Analysis is a nicety; playback still works without it.
    }
    return new Promise((resolve) => {
      const done = () => resolve();
      audio.onended = done;
      audio.onerror = done;
      const started = audio.play();
      if (started && started.catch) started.catch(done);
    });
  }

  /**
   * Speak `text`. Resolves true once it has finished being spoken, false if it
   * was cancelled or could not be spoken at all.
   */
  async function speak(text) {
    stop();
    const mine = ++runId;
    const cancelled = () => runId !== mine;

    let plan;
    try {
      plan = await api().tts_plan(text);
    } catch (err) {
      plan = null;
    }
    if (cancelled()) return false;
    if (!plan || !plan.chunks || !plan.chunks.length) return false;

    if (!plan.natural) return speakOffline(text, mine);

    const chunks = plan.chunks;
    let pending = api().tts_chunk(chunks[0]);
    setSpeaking(true);
    for (let i = 0; i < chunks.length; i++) {
      let clip;
      try {
        clip = await pending;
      } catch (err) {
        clip = null;
      }
      if (cancelled()) return false;
      if (!clip || !clip.ok) {
        // The neural voice failed. If nothing has been spoken yet, say the
        // whole thing in the offline voice; if it failed PART WAY through,
        // stop instead — switching voices mid-answer sounds like a different
        // person taking over, and the text is already on screen.
        if (i === 0) return speakOffline(text, mine);
        setSpeaking(false);
        return false;
      }
      // Kick off the next chunk BEFORE playing this one, so generation
      // overlaps playback rather than following it.
      pending = i + 1 < chunks.length ? api().tts_chunk(chunks[i + 1]) : null;
      if (pending && pending.catch) pending.catch(() => {});
      await playClip(makeAudio(clip.audio, clip.mime));
      if (cancelled()) return false;
    }
    analyser = null;
    freq = null;
    setSpeaking(false);
    return true;
  }

  /** Offline Windows voice: Python speaks it and tells us when it's done. */
  function speakOffline(text, mine) {
    return new Promise((resolve) => {
      const token = "voice-" + mine + "-" + Date.now();
      const finish = (ok) => {
        window.removeEventListener("jarvis:line-done", handler);
        if (runId === mine) setSpeaking(false);
        resolve(ok);
      };
      const handler = (e) => {
        if (!e.detail || e.detail.token !== token) return;
        finish(!!e.detail.spoke);
      };
      window.addEventListener("jarvis:line-done", handler);
      fallbackResolve = () => finish(false);
      api()
        .speak_line(text, token)
        .then((result) => {
          if (!result || !result.ok) finish(false);
          else setSpeaking(true);
        })
        .catch(() => finish(false));
    });
  }

  window.JarvisVoice = {
    speak: speak,
    stop: stop,
    amplitude: amplitude,
    get speaking() { return speaking; },
    set onState(fn) { onStateChange = fn; },
  };
})();
