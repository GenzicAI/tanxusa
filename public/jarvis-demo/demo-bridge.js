/**
 * Browser-only stand-in for the pywebview bridge, used to show the Jarvis
 * Desktop Assistant UI as a self-contained demo on tanxusa.com.
 *
 * Nothing here talks to a real filesystem or a real AI. It is entirely
 * offline: fake activity/state data plus the browser's own SpeechSynthesis
 * for the spoken walkthrough (Windows/Mac local voices, no network call).
 * The goal is purely to let a visitor see the UI and hear the guided tour.
 */
(function () {
  const BRANDING = {
    product_name: "Jarvis Desktop Assistant",
    short_name: "Jarvis",
    subtitle: "Genzic Agentic AI Assistant — Live Demo",
    assistant_name: "Jarvis",
    accent: "#38e08a",
    accent_dim: "#1f7a4c",
    // Order matters: app.js tiles the first four in the hero grid and puts the
    // remainder behind the bolt menu in the chat header.
    suggestions: [
      "What did you file today?",
      "Find every invoice from last month.",
      "Search my files for pricing.",
      "Organize my watch folder now.",
      "Summarise the newest document in my folder.",
      "Which contracts mention auto-renewal?",
      "What's in the latest spreadsheet?",
      "Which files are the largest?",
      "Show me everything you filed as Reports.",
    ],
  };

  const now = () => Date.now() / 1000;

  const FAKE_DOCS = [
    { name: "Q3-Invoice-Acme.pdf", category: "Invoices", note: "Acme Corp — $4,250.00, due Oct 14." },
    { name: "MSA-Northwind-2026.docx", category: "Contracts", note: "Auto-renewal clause, 30-day notice." },
    { name: "Board-Deck-August.pptx", category: "Presentations", note: "12 slides — Q3 growth & runway." },
    { name: "Expense-Report-July.xlsx", category: "Spreadsheets", note: "$18,430 total across 6 categories." },
    { name: "Receipt-OfficeSupplies.pdf", category: "Receipts", note: "Staples — $86.12." },
    { name: "Resume-J-Alvarez.pdf", category: "Resumes", note: "Senior backend engineer, 8 yrs." },
    { name: "Team-Offsite-Photos.zip", category: "Archives", note: "42 images, 118 MB." },
    { name: "Vendor-MSA-Draft.docx", category: "Contracts", note: "Redlines pending legal review." },
  ];

  let state = {
    branding: BRANDING,
    config: {
      watch_folder: "C:\\Users\\Demo\\Downloads",
      auto_organize: true,
      recursive: true,
      index_existing: true,
      speak_replies: true,
      min_confidence: 0.55,
      guide_seen: false,
    },
    watch: { running: true },
    ai: { provider: "gemini" },
    stats: { files: 128, filed: 41, bytes: 612 * 1024 * 1024 },
    categories: [
      "Invoices", "Contracts", "Reports", "Presentations", "Spreadsheets",
      "Receipts", "Resumes", "Images", "Media", "Installers", "Archives",
      "Personal", "Misc",
    ],
    voice: {
      voices: [{ id: "default", label: "System voice" }],
      current: "default",
      natural_enabled: false,
      natural_available: false,
      offline_voice: "this browser's voice",
    },
    has_key: true,
    version: "1.0-demo",
    tts: true,
    data_dir: "Demo mode — no files are read or moved.",
  };

  let activity = FAKE_DOCS.map((doc, i) => ({
    id: "evt-" + i,
    kind: i % 5 === 0 ? "indexed" : "moved",
    path: state.config.watch_folder + "\\" + doc.category + "\\" + doc.name,
    dest: doc.name,
    category: doc.category,
    note: doc.note,
    ts: now() - i * 900,
    undone: false,
  }));

  function delay(ms) { return new Promise((r) => setTimeout(r, ms)); }

  // ---------------------------------------------------------------- speech
  // Local SpeechSynthesis only — this is the offline path the real app uses
  // when no neural voice is reachable, so no network call happens here.

  let pickedVoice = null;
  function pickVoice() {
    if (pickedVoice) return pickedVoice;
    const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
    pickedVoice =
      voices.find((v) => /en[-_]GB/i.test(v.lang) && /male/i.test(v.name)) ||
      voices.find((v) => /en[-_]GB/i.test(v.lang)) ||
      voices.find((v) => /en/i.test(v.lang)) ||
      voices[0] || null;
    return pickedVoice;
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = () => { pickedVoice = null; pickVoice(); };
  }

  function speak_line(text, token) {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      if (!synth) { resolve({ ok: false }); return; }
      const utter = new SpeechSynthesisUtterance(text);
      const v = pickVoice();
      if (v) utter.voice = v;
      utter.rate = 1.0;
      utter.pitch = 1.0;
      const finish = (spoke) => {
        window.dispatchEvent(new CustomEvent("jarvis:line-done", { detail: { token, spoke } }));
      };
      utter.onend = () => finish(true);
      utter.onerror = () => finish(false);
      try {
        synth.speak(utter);
        resolve({ ok: true });
      } catch (err) {
        resolve({ ok: false });
      }
    });
  }

  function stop_speaking() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    return Promise.resolve({ ok: true });
  }

  // ---------------------------------------------------------------- api

  const api = {
    boot() { return Promise.resolve(state); },
    state() { return Promise.resolve(state); },

    activity() { return Promise.resolve(activity); },

    ask(question) {
      const q = (question || "").toLowerCase();
      const hit = FAKE_DOCS.find((d) => q.includes(d.category.toLowerCase())) || FAKE_DOCS[0];
      let answer;
      if (q.includes("organize")) {
        answer = "This is a demo running in your browser, so I can't touch real files here — " +
          "but on your desktop, Organize now would sort everything in your watch folder into " +
          "the categories on the left, right away.";
      } else if (q.includes("filed") || q.includes("today")) {
        answer = "In this demo I've filed " + state.stats.filed + " documents, most recently " +
          FAKE_DOCS[0].name + " into " + FAKE_DOCS[0].category + ".";
      } else {
        answer = "Here's what I found: " + hit.name + " (" + hit.category + "). " + hit.note;
      }
      return delay(500).then(() => ({
        answer,
        sources: [{ name: hit.name, path: hit.name }],
        refresh: false,
      }));
    },

    save_settings(patch) {
      Object.assign(state.config, patch);
      if ("voice" in patch) state.voice.current = patch.voice;
      if ("natural_voice" in patch) state.voice.natural_enabled = patch.natural_voice;
      return Promise.resolve({ state });
    },

    pick_folder() {
      return Promise.resolve({ message: "Demo mode — folder picking is disabled.", state });
    },

    start_watch() { state.watch.running = true; return Promise.resolve({ message: "Watching (demo).", state }); },
    stop_watch() { state.watch.running = false; return Promise.resolve({ message: "Paused (demo).", state }); },
    organize_now() { return Promise.resolve({ message: "Demo mode — no files were moved." }); },
    reindex() { return Promise.resolve({ message: "Demo mode — nothing to re-index." }); },

    set_api_key() {
      state.has_key = true;
      return Promise.resolve({ ok: true, message: "Demo mode — keys aren't actually stored.", state });
    },
    clear_api_key() { return Promise.resolve({ state }); },

    open_log() {},
    open_path() {},
    reveal_path() {},

    undo(eventId) {
      const ev = activity.find((e) => e.id === eventId);
      if (ev) ev.undone = true;
      return Promise.resolve({ message: "Demo mode — nothing was actually moved.", state });
    },

    search(query, limit) {
      const q = (query || "").toLowerCase();
      const hits = FAKE_DOCS.filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.note.toLowerCase().includes(q)
      ).slice(0, limit || 25);
      return Promise.resolve(hits.map((d) => ({
        name: d.name, path: d.name, category: d.category, snippet: d.note, mtime: now(),
      })));
    },

    tts_plan() { return Promise.resolve({ natural: false, chunks: [0] }); },
    tts_chunk() { return Promise.resolve({ ok: false }); },
    speak_line,
    stop_speaking,

    finish_guide() { state.config.guide_seen = true; return Promise.resolve({ ok: true }); },
  };

  window.pywebview = { api };
  window.dispatchEvent(new Event("pywebviewready"));
})();
