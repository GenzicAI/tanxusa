/**
 * Green-to-yellow neon voice wave, ported from the Victoria app's `VoiceWave`.
 * Sits between the conversation and the composer and vibrates while the
 * assistant is speaking.
 *
 * Two details carried over from the original, both of which were real bugs
 * there: the backing store is re-synced from the laid-out width at the top of
 * every frame (a ResizeObserver did not reliably fire), and the displacement
 * gain is clamped to 1 so a loud peak can never shear flat against the strip's
 * limited headroom.
 */
(function () {
  const GREEN = "56, 224, 138";
  const YELLOW = "230, 214, 64";

  const LAYERS = [
    { freq: 1.6, speed: 0.02, alpha: 0.95, weight: 2.0, scale: 1.0, phase: 0 },
    { freq: 2.4, speed: -0.026, alpha: 0.55, weight: 1.4, scale: 0.72, phase: 1.1 },
    { freq: 3.3, speed: 0.033, alpha: 0.38, weight: 1.1, scale: 0.5, phase: 2.3 },
    { freq: 4.7, speed: -0.041, alpha: 0.24, weight: 1.0, scale: 0.34, phase: 3.7 },
  ];

  function mountWave(canvas, opts) {
    const options = opts || {};
    const ctx = canvas.getContext("2d");
    if (!ctx) return { setState: function () {} };

    const height = options.height || 40;
    const reduced = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
    const getAmplitude = options.getAmplitude || function () { return 0; };
    let state = options.state || "idle";

    let width = 0;
    let grad = null;

    function syncSize() {
      const w = canvas.clientWidth;
      if (!w) return false;
      if (w === width) return true;
      width = w;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, "rgba(" + GREEN + ", 1)");
      grad.addColorStop(0.35, "rgba(" + YELLOW + ", 1)");
      grad.addColorStop(0.62, "rgba(" + GREEN + ", 1)");
      grad.addColorStop(1, "rgba(" + YELLOW + ", 1)");
      return true;
    }

    const cy = height / 2;
    const maxAmp = height / 2 - 3;
    let t = 0;
    let level = 0;
    let raf = 0;

    function draw() {
      raf = requestAnimationFrame(draw);
      if (!syncSize() || !grad) return;

      const raw = getAmplitude() || 0;
      const target =
        state === "speaking"
          ? Math.max(raw, 0.12)
          : state === "listening"
          ? 0.16 + Math.sin(t / 7) * 0.05
          : state === "thinking"
          ? 0.13
          : 0.06 + Math.sin(t / 26) * 0.02;
      level += (target - level) * 0.16;
      const amp = Math.min(1, level * 1.7);

      t += reduced ? 0.3 : state === "speaking" ? 1.6 : state === "thinking" ? 1.25 : 1;

      ctx.clearRect(0, 0, width, height);
      const step = Math.max(2, Math.round(width / 220));

      for (const L of LAYERS) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += step) {
          const u = x / width;
          // Taper both ends to zero so the ribbon is anchored rather than
          // chopped off at the edges of the strip.
          const envelope = Math.pow(Math.sin(Math.PI * u), 0.8);
          const wave =
            Math.sin(u * Math.PI * 2 * L.freq + t * L.speed * 6 + L.phase) * 0.7 +
            Math.sin(u * Math.PI * 2 * (L.freq * 1.7) - t * L.speed * 4 + L.phase) * 0.3;
          const y = cy + wave * envelope * maxAmp * amp * L.scale;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = grad;
        ctx.globalAlpha = L.alpha * (0.45 + level * 0.85);
        ctx.lineWidth = L.weight;
        ctx.lineCap = "round";
        ctx.shadowColor = "rgba(" + GREEN + ", " + (0.5 + level * 0.5) + ")";
        ctx.shadowBlur = 6 + level * 10;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    draw();

    return {
      setState: function (next) { state = next; },
      destroy: function () { cancelAnimationFrame(raf); },
    };
  }

  window.mountWave = mountWave;
})();
