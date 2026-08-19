/**
 * Spoken first-run walkthrough — the desktop counterpart of the Genzic Voice
 * Translator's onboarding guide.
 *
 * Same shape as that guide, for the same reasons:
 *   * one step per control, each narrated aloud;
 *   * a pulsing glow ring drawn around the control being described, so the
 *     user is looking at the thing they're hearing about;
 *   * a caption card with progress dots and a **Skip** link, always available;
 *   * it advances when narration ENDS rather than on a fixed timer, so the
 *     highlight never runs ahead of the voice;
 *   * narration failing must not strand the guide — it advances anyway.
 *
 * Two things differ because this is a desktop app, not a phone:
 *   * steps declare which rail tab they belong to and the guide switches tabs
 *     itself (the translator does the same for its chat/learning screens);
 *   * narration goes through `JarvisVoice.speak`, which resolves when the line
 *     has finished being spoken — by the neural voice or, offline, by the
 *     Windows one. If nothing could be spoken at all, the step falls back to a
 *     reading-time estimate so the tour still works end to end, silently.
 */
(function () {
  const $ = (id) => document.getElementById(id);
  const api = () => window.pywebview && window.pywebview.api;

  // target: CSS selector of the control to highlight (null = no highlight)
  // panel:  which rail tab must be showing for that control to exist
  // shape:  'circle' hugs a round control; anything else uses a rounded box
  const STEPS = [
    {
      target: null, panel: null,
      text: "Hello — I'm Jarvis, your desktop assistant. Let me show you around. " +
            "It takes about a minute, and you can skip it at any time.",
    },
    {
      target: ".rail-tabs", panel: "activity", shape: "rounded",
      text: "See that green glowing ring? As I explain each part, it will appear " +
            "around the thing I'm talking about — so keep an eye on the screen and follow along. " +
            "These three tabs are Activity, Files and Settings.",
    },
    {
      target: "#pickFolder", panel: "activity",
      text: "Start here. Choose the folder you want me to look after — your Downloads " +
            "folder is the usual one. I'll read everything that lands in it.",
    },
    {
      target: "#toggleWatch", panel: "activity",
      text: "This starts and pauses me. While I'm watching, the badge at the top left " +
            "glows, and I pick up every new file within a couple of seconds of it finishing.",
    },
    {
      target: "#stats", panel: "activity", shape: "rounded",
      text: "These three counters are how much I've read, how many files I've filed away " +
            "for you, and the total size of everything I know about.",
    },
    {
      target: "#organizeNow", panel: "activity",
      text: "Organize now goes through the whole folder and files everything into " +
            "subfolders — Invoices, Contracts, Reports, and so on. Nothing is moved " +
            "until you press it the first time.",
    },
    {
      target: "#reindex", panel: "activity",
      text: "Re-index just re-reads the folder without moving anything. Use it if you've " +
            "changed files outside of me.",
    },
    {
      target: "#feed", panel: "activity", shape: "rounded",
      text: "Everything I do appears here. Each entry says what the file was and where it " +
            "went. Click one to reveal it in Explorer, press Open to open it, or press " +
            "Undo if you disagree with where I put it — that always puts it straight back.",
    },
    {
      target: "#fileSearch", panel: "files",
      text: "This is the Files tab. Search here and I look inside your documents, not just " +
            "at their names — a phrase from page four of a contract, or an amount on an invoice.",
    },
    {
      target: "#apiKey", panel: "settings",
      text: "Now Settings. Paste an AI key here — Gemini or OpenAI — and I'll read and " +
            "sort your documents far more intelligently. I check the key before saving it, " +
            "and it's encrypted so only you on this computer can use it. " +
            "Without a key I still work, just with simpler rules.",
    },
    {
      target: "#categories", panel: "settings",
      text: "These are the folders I file into. Change them to whatever suits your work — " +
            "they become real subfolders inside the folder I'm watching.",
    },
    {
      target: "#confidence", panel: "settings",
      text: "This slider is how sure I have to be before I move something. " +
            "Anything below it, I read and remember but leave exactly where it is.",
    },
    {
      target: ".panel[data-panel='settings'] .check", panel: "settings", shape: "rounded",
      text: "And these switches control the automation itself — whether I move files on my " +
            "own, whether I watch subfolders, and whether I read my answers out loud.",
    },
    {
      // The canvas itself, not its `.hero-orb` wrapper: the wrapper is a
      // full-width flex row, so a "circle" ring around it draws a wide stadium
      // instead of hugging the orb.
      target: "#heroOrb", panel: "activity", shape: "circle",
      text: "Now the important part. This is me. Ask me anything about your files and I'll " +
            "answer from what's actually inside them, and name the documents I used.",
    },
    {
      target: "#suggestions", panel: "activity", shape: "rounded",
      text: "If you're not sure what to ask, start with one of these. They're real questions " +
            "you can click.",
    },
    {
      target: "#input", panel: "activity",
      text: "Or type here. You can also paste a web link into a question and I'll go and read " +
            "that page before answering. Say organize my folder now, and I'll just do it.",
    },
    {
      target: "#muteBtn", panel: "activity",
      text: "This mutes my voice if you'd rather read than listen.",
    },
    {
      target: "#guideBtn", panel: "activity",
      text: "And this replays this tour whenever you want it again.",
    },
    {
      target: null, panel: "activity",
      text: "That's everything. Choose a folder when you're ready, and I'll take it from there.",
    },
  ];

  // Reading-time fallback when there is no voice on this machine, so a silent
  // tour still paces like a spoken one instead of flying past.
  const WORDS_PER_MINUTE = 150;
  const MIN_STEP_MS = 2600;

  let index = 0;
  let running = false;
  // Bumped per step so a narration promise that settles late (because its step
  // was skipped past) can't advance the tour a second time.
  let narrationId = 0;
  let timer = 0;
  let pulseRaf = 0;
  let onDone = null;

  function els() {
    return {
      layer: $("guideLayer"),
      ring: $("guideRing"),
      caption: $("guideCaption"),
      text: $("guideText"),
      dots: $("guideDots"),
    };
  }

  function showPanel(panel) {
    if (!panel) return false;
    const tab = document.querySelector('.tab[data-panel="' + panel + '"]');
    if (!tab || tab.classList.contains("is-active")) return false;
    tab.click();
    return true;
  }

  /**
   * Draw the ring around `target`.
   *
   * `scroll` MUST stay false when re-placing from a scroll handler: scrolling
   * an element into view fires another scroll event, which would call this
   * again — a feedback loop that pins the renderer at 100% and freezes the
   * whole window. Only a new step scrolls.
   */
  function placeRing(target, shape, scroll) {
    const { ring } = els();
    if (!target) {
      ring.hidden = true;
      return null;
    }
    const node = document.querySelector(target);
    if (!node) {
      ring.hidden = true;
      return null;
    }
    // A control inside a scrolling panel may be out of view; bring it into the
    // middle before measuring, or the ring lands on empty space.
    if (scroll) node.scrollIntoView({ block: "center", inline: "nearest" });
    const r = node.getBoundingClientRect();
    if (!r.width || !r.height) {
      ring.hidden = true;
      return null;
    }
    const pad = 6;
    ring.style.left = r.left - pad + "px";
    ring.style.top = r.top - pad + "px";
    ring.style.width = r.width + pad * 2 + "px";
    ring.style.height = r.height + pad * 2 + "px";
    ring.style.borderRadius =
      shape === "circle" ? Math.min(r.width, r.height) / 2 + pad + "px" : "14px";
    ring.hidden = false;
    return r;
  }

  function renderDots() {
    const { dots } = els();
    dots.innerHTML = "";
    STEPS.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "guide-dot" + (i === index ? " is-active" : "");
      dots.appendChild(dot);
    });
  }

  function estimateMs(text) {
    const words = text.split(/\s+/).length;
    return Math.max(MIN_STEP_MS, (words / WORDS_PER_MINUTE) * 60000);
  }

  async function runStep(i) {
    if (!running) return;
    index = i;
    const step = STEPS[i];

    // Switching tabs re-lays out the rail; measure only after that has landed,
    // otherwise the ring is drawn against the panel we just left.
    if (showPanel(step.panel)) await new Promise((r) => setTimeout(r, 90));
    if (!running) return;

    const { text } = els();
    text.textContent = step.text;
    renderDots();
    placeRing(step.target, step.shape, true);
    // The scroll started above is smooth/asynchronous in some cases, so
    // re-measure once it has settled rather than trusting the first rect.
    setTimeout(() => {
      if (running && index === i) placeRing(step.target, step.shape, false);
    }, 260);

    clearTimeout(timer);
    const mine = ++narrationId;

    // Belt and braces: if the voice engine dies mid-line the promise may never
    // settle, so a generous timer takes over rather than stranding the tour.
    timer = setTimeout(() => advance(), estimateMs(step.text) * 3 + 8000);

    let spoken = false;
    try {
      spoken = await window.JarvisVoice.speak(step.text);
    } catch (err) {
      spoken = false;
    }
    if (!running || narrationId !== mine) return;
    clearTimeout(timer);

    if (spoken) {
      // Narration finished — a beat before the next step so it doesn't feel
      // like one long unbroken sentence.
      timer = setTimeout(() => advance(), 450);
    } else {
      // Nothing was spoken (no voice on this machine, or it was cancelled by a
      // new utterance): pace the step by reading time so a silent tour still
      // works end to end.
      timer = setTimeout(() => advance(), estimateMs(step.text));
    }
  }

  function advance() {
    if (!running) return;
    clearTimeout(timer);
    if (index < STEPS.length - 1) runStep(index + 1);
    else stop(true);
  }

  function stop(completed) {
    if (!running) return;
    running = false;
    narrationId++;
    clearTimeout(timer);
    cancelAnimationFrame(pulseRaf);
    const { layer, ring } = els();
    layer.hidden = true;
    ring.hidden = true;
    document.body.classList.remove("guide-active");
    window.JarvisVoice.stop();
    try {
      api().finish_guide();
    } catch (err) {
      /* window closing */
    }
    if (onDone) onDone(completed);
  }

  function start(options) {
    if (running) return;
    onDone = (options || {}).onDone || null;
    running = true;
    index = 0;
    const { layer } = els();
    layer.hidden = false;
    document.body.classList.add("guide-active");
    // Re-place the ring on scroll and resize: the window is freely resizable
    // and the panels scroll, and a ring measured once ends up pointing at
    // nothing the moment either happens.
    runStep(0);
  }

  function reposition() {
    if (!running) return;
    const step = STEPS[index];
    placeRing(step.target, step.shape, false);
  }
  window.addEventListener("resize", reposition);
  document.addEventListener("scroll", reposition, true);

  window.JarvisGuide = {
    start: start,
    skip: () => stop(false),
    get running() { return running; },
    steps: STEPS.length,
  };
})();
