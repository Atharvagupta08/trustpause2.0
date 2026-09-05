// Sound + haptic feedback cues (no external assets, WebAudio synthesis)

let ctx = null;
let muted = false;
let sampleNodes = null;

export function setMuted(v) {
  muted = !!v;
  if (muted) stopVoiceSample();
}
export function isMuted() {
  return muted;
}

function getCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    try {
      ctx = new AC();
    } catch (e) {
      return null;
    }
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

function tone({ freq = 440, dur = 0.12, type = "sine", gain = 0.06, delay = 0 }) {
  const c = getCtx();
  if (!c) return;
  try {
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  } catch (e) {
    /* noop */
  }
}

function vibrate(pattern) {
  try {
    if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    /* noop */
  }
}

const CUES = {
  tap: () => {
    tone({ freq: 620, dur: 0.05, type: "triangle", gain: 0.03 });
    vibrate(8);
  },
  safe: () => {
    tone({ freq: 587.33, dur: 0.1, type: "sine", gain: 0.05 });
    tone({ freq: 880, dur: 0.16, type: "sine", gain: 0.05, delay: 0.09 });
    vibrate([12, 40, 18]);
  },
  warn: () => {
    tone({ freq: 440, dur: 0.1, type: "square", gain: 0.035 });
    tone({ freq: 392, dur: 0.14, type: "square", gain: 0.035, delay: 0.1 });
    vibrate([25, 60, 25]);
  },
  danger: () => {
    tone({ freq: 240, dur: 0.16, type: "sawtooth", gain: 0.045 });
    tone({ freq: 180, dur: 0.22, type: "sawtooth", gain: 0.045, delay: 0.15 });
    vibrate([40, 70, 40, 70, 90]);
  },
  tick: () => {
    tone({ freq: 900, dur: 0.035, type: "triangle", gain: 0.022 });
  },
  hold: () => {
    tone({ freq: 320, dur: 0.06, type: "sine", gain: 0.03 });
    vibrate(10);
  },
  unlock: () => {
    tone({ freq: 200, dur: 0.2, type: "sawtooth", gain: 0.05 });
    tone({ freq: 150, dur: 0.3, type: "sawtooth", gain: 0.05, delay: 0.18 });
    vibrate([90, 50, 140]);
  },
  call: () => {
    tone({ freq: 480, dur: 0.3, type: "sine", gain: 0.04 });
    tone({ freq: 620, dur: 0.3, type: "sine", gain: 0.04, delay: 0.02 });
    vibrate([200, 120, 200]);
  },
};

export function cue(name) {
  if (muted) return;
  const fn = CUES[name];
  if (fn) fn();
}

export function primeAudio() {
  getCtx();
}

/**
 * Synthesised "cloned voice" sample: a formant-ish wobbling tone.
 * Purely synthetic (no external audio asset) — used by the deepfake card.
 */
export function playVoiceSample() {
  if (muted) return false;
  const c = getCtx();
  if (!c) return false;
  stopVoiceSample();
  try {
    const t0 = c.currentTime;
    const carrier = c.createOscillator();
    const formant = c.createOscillator();
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    const g = c.createGain();

    carrier.type = "sawtooth";
    carrier.frequency.setValueAtTime(132, t0);
    formant.type = "sine";
    formant.frequency.setValueAtTime(320, t0);

    lfo.type = "sine";
    lfo.frequency.setValueAtTime(5.5, t0);
    lfoGain.gain.setValueAtTime(14, t0);
    lfo.connect(lfoGain);
    lfoGain.connect(carrier.frequency);

    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.035, t0 + 0.15);

    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(700, t0);
    filter.Q.setValueAtTime(2.2, t0);

    carrier.connect(filter);
    formant.connect(filter);
    filter.connect(g);
    g.connect(c.destination);

    carrier.start(t0);
    formant.start(t0);
    lfo.start(t0);

    sampleNodes = { carrier, formant, lfo, g };
    return true;
  } catch (e) {
    sampleNodes = null;
    return false;
  }
}

export function stopVoiceSample() {
  if (!sampleNodes) return;
  const c = ctx;
  const { carrier, formant, lfo, g } = sampleNodes;
  sampleNodes = null;
  try {
    const t = c ? c.currentTime : 0;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value || 0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    [carrier, formant, lfo].forEach((n) => {
      try {
        n.stop(t + 0.1);
      } catch (e) {
        /* noop */
      }
    });
  } catch (e) {
    /* noop */
  }
}
