import { ASSETS, CONFIG } from '../data/assets.js';

/**
 * Optional sound layer.
 *
 * Each cue plays the file set in ASSETS.audio[cue] if there is one, otherwise
 * a short synthesized tone (Web Audio). Nothing here depends on external
 * audio, and every cue is easy to replace with a real sound file.
 *
 * Step format: [frequencyHz, seconds, waveform?, gain?]   (freq 0 = rest)
 */
const SYNTH = {
  detect: [[1180, 0.07], [0, 0.04], [1560, 0.1]],
  bluetooth: [[880, 0.06, 'sine', 0.12], [1320, 0.06, 'sine', 0.12], [1760, 0.12, 'sine', 0.1]],
  alert: [[740, 0.16, 'triangle'], [0, 0.08], [740, 0.16, 'triangle'], [0, 0.08], [988, 0.26, 'triangle']],
  tick: [[1046, 0.05, 'square', 0.05]],
  warning: [[392, 0.22, 'sawtooth', 0.07], [0, 0.05], [330, 0.32, 'sawtooth', 0.07]],
  emergency: [[220, 0.3, 'sawtooth', 0.08], [0, 0.06], [220, 0.3, 'sawtooth', 0.08], [0, 0.06], [196, 0.45, 'sawtooth', 0.08]],
  locate: [[1320, 0.06, 'sine', 0.1], [0, 0.05], [1760, 0.14, 'sine', 0.1]],
  ring: [[440, 0.35, 'sine', 0.08], [480, 0.35, 'sine', 0.06]],
  safe: [[523, 0.12, 'sine', 0.12], [659, 0.12, 'sine', 0.12], [784, 0.3, 'sine', 0.12]],
  confirm: [[660, 0.1, 'sine', 0.1], [990, 0.22, 'sine', 0.1]],
};

let ctx = null;
let muted = !CONFIG.soundOnByDefault;
const listeners = new Set();

export function isMuted() {
  return muted;
}
export function setMuted(v) {
  muted = v;
  listeners.forEach((fn) => fn(muted));
}
export function onMuteChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Call from a click handler so browsers allow sound later. */
export function unlockAudio() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    ctx = null;
  }
}

export function playCue(name) {
  if (muted || !name) return;
  const file = ASSETS.audio[name];
  if (file) {
    const a = new Audio(file);
    a.volume = 0.8;
    a.play().catch(() => {});
    return;
  }
  const steps = SYNTH[name];
  if (!steps || !ctx) return;
  let t = ctx.currentTime + 0.02;
  for (const [freq, dur, wave = 'sine', gain = 0.09] of steps) {
    if (freq > 0) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = wave;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    }
    t += dur;
  }
}
