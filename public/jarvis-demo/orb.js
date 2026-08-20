/**
 * Jarvis orb — a straight port of the Toast/Victoria `JarvisOrb` React
 * component to vanilla canvas: rotating tick rail, counter-rotating arcs, a
 * waveform ring, a pulsing core and orbiting motes.
 *
 * The one structural decision carried over verbatim: geometry is re-derived
 * from the canvas's MEASURED box at the top of every frame rather than from a
 * size argument. Resize events and ResizeObserver both proved unreliable in the
 * original; re-reading the laid-out box each frame is self-healing and cannot
 * miss a change.
 */
(function () {
  const ACCENT = "56, 224, 138";
  const CORE_RED = [255, 92, 74];
  const CORE_GREEN = [56, 224, 138];

  function mountOrb(canvas, opts) {
    const options = opts || {};
    const ctx = canvas.getContext("2d");
    if (!ctx) return { setState: function () {} };

    const reduced = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

    let state = options.state || "idle";
    const getAmplitude = options.getAmplitude || function () { return 0; };

    let cx = 0, cy = 0, R = 0, boxW = 0, boxH = 0;

    function syncSize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return false;
      if (w !== boxW || h !== boxH) {
        boxW = w;
        boxH = h;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        // setTransform, not scale, so repeated syncs don't compound.
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cx = w / 2;
        cy = h / 2;
        R = Math.min(w, h) / 2;
      }
      return true;
    }

    function ring(radius, width, alpha, from, to) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, from === undefined ? 0 : from, to === undefined ? Math.PI * 2 : to);
      ctx.strokeStyle = "rgba(" + ACCENT + ", " + alpha + ")";
      ctx.lineWidth = width;
      ctx.stroke();
    }

    let t = 0;
    let level = 0;
    let coreMix = 0;
    let thinkMix = 0;
    let raf = 0;

    function draw() {
      raf = requestAnimationFrame(draw);
      if (!syncSize()) return;

      const raw = getAmplitude() || 0;
      const target =
        state === "speaking"
          ? Math.max(raw, 0.08)
          : state === "listening"
          ? 0.35 + Math.sin(t / 6) * 0.12
          : state === "thinking"
          ? 0.22
          : 0.12 + Math.sin(t / 22) * 0.05;
      level += (target - level) * 0.18;

      const speed = state === "thinking" ? 2.2 : state === "speaking" ? 1.5 : 1;
      t += reduced ? 0.35 : speed;

      ctx.clearRect(0, 0, boxW, boxH);

      // Outer glow that swells with the voice.
      const glow = ctx.createRadialGradient(cx, cy, R * 0.1, cx, cy, R);
      glow.addColorStop(0, "rgba(" + ACCENT + ", " + (0.16 + level * 0.3) + ")");
      glow.addColorStop(0.6, "rgba(" + ACCENT + ", " + (0.05 + level * 0.08) + ")");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, boxW, boxH);

      // Static outer rail + rotating tick marks.
      ring(R * 0.94, 1, 0.18);
      const ticks = 48;
      for (let i = 0; i < ticks; i++) {
        const a = (i / ticks) * Math.PI * 2 + t / 240;
        const long = i % 6 === 0;
        const r1 = R * (long ? 0.82 : 0.87);
        const r2 = R * 0.92;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
        ctx.strokeStyle = "rgba(" + ACCENT + ", " + (long ? 0.45 : 0.18) + ")";
        ctx.lineWidth = long ? 1.6 : 1;
        ctx.stroke();
      }

      // Two counter-rotating arc segments.
      const a1 = t / 90;
      ring(R * 0.75, 2, 0.55, a1, a1 + Math.PI * 0.5);
      ring(R * 0.75, 2, 0.25, a1 + Math.PI, a1 + Math.PI * 1.3);
      const a2 = -t / 130;
      ring(R * 0.63, 1.4, 0.4, a2, a2 + Math.PI * 0.8);

      // Waveform ring — this is what makes speech look alive.
      const points = 96;
      ctx.beginPath();
      for (let i = 0; i <= points; i++) {
        const a = (i / points) * Math.PI * 2;
        const wobble =
          Math.sin(a * 3 + t / 9) * 0.5 +
          Math.sin(a * 5 - t / 14) * 0.3 +
          Math.sin(a * 8 + t / 20) * 0.2;
        const r = R * (0.44 + level * 0.2 + wobble * level * 0.14);
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(" + ACCENT + ", " + (0.5 + level * 0.45) + ")";
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.fillStyle = "rgba(" + ACCENT + ", " + (0.05 + level * 0.12) + ")";
      ctx.fill();

      // Core: red at rest, easing to green only while actually speaking. Every
      // ring above stays brand green regardless of state.
      const coreTarget = state === "speaking" ? 1 : 0;
      coreMix += (coreTarget - coreMix) * 0.12;
      const coreRgb = [0, 1, 2]
        .map(function (i) {
          return Math.round(CORE_RED[i] + (CORE_GREEN[i] - CORE_RED[i]) * coreMix);
        })
        .join(", ");

      const coreR = R * (0.16 + level * 0.12);
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.2);
      core.addColorStop(0, "rgba(255, 255, 255, " + (0.7 + level * 0.25) + ")");
      core.addColorStop(0.35, "rgba(" + coreRgb + ", " + (0.55 + level * 0.35) + ")");
      core.addColorStop(1, "rgba(0,0,0,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = core;
      ctx.fill();

      // Thinking indicator: a single bright glowing arc sweeping around the
      // outer rail, hero orb only — the signal that Jarvis heard the
      // question and is off retrieving the answer, distinct from the dim
      // static ticks and the always-on counter-rotating arcs above.
      if (options.showThinkingRing) {
        const thinkTarget = state === "thinking" ? 1 : 0;
        thinkMix += (thinkTarget - thinkMix) * 0.15;
        if (thinkMix > 0.01) {
          const sweep = Math.PI * 0.5;
          const a = t / 55;
          ctx.save();
          ctx.shadowColor = "rgba(" + ACCENT + ", " + thinkMix + ")";
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(cx, cy, R * 0.94, a, a + sweep);
          ctx.strokeStyle = "rgba(" + ACCENT + ", " + (0.85 * thinkMix) + ")";
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.stroke();
          ctx.restore();
        }
      }

      // Orbiting motes.
      for (let i = 0; i < 3; i++) {
        const a = t / 70 + (i * Math.PI * 2) / 3;
        const r = R * 0.75;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + ACCENT + ", 0.85)";
        ctx.fill();
      }
    }

    draw();

    return {
      setState: function (next) { state = next; },
      destroy: function () { cancelAnimationFrame(raf); },
    };
  }

  window.mountOrb = mountOrb;
})();
