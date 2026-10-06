import { ASSETS, CONFIG } from '../data/assets.js';

/**
 * Optional sound layer. Each cue plays ASSETS.audio[cue] if a file is set,
 * otherwise a short synthesized retro tone. Videos keep their own soundtrack.
 *
 * Step: [freqHz, seconds, wave?, gain?, slideToHz?]   (freq 0 = rest)
 */
const SYNTH = {
  click: [[1400, 0.03, 'square', 0.04]],
  loading: [
    [220, 0.04, 'square', 0.03], [0, 0.06], [330, 0.04, 'square', 0.03], [0, 0.1],
    [262, 0.04, 'square', 0.03], [0, 0.05], [392, 0.04, 'square', 0.03], [0, 0.12],
    [294, 0.04, 'square', 0.03], [0, 0.05], [523, 0.08, 'square', 0.035],
  ],
  activate: [[660, 0.06, 'square', 0.04], [990, 0.1, 'square', 0.04]],
  confirm: [[880, 0.05, 'square', 0.05], [0, 0.03], [1320, 0.09, 'square', 0.05]],
  safe: [[523, 0.1, 'square', 0.05], [659, 0.1, 'square', 0.05], [784, 0.22, 'square', 0.05]],
  // restrained old-system alarm
  alarm: [
    [740, 0.18, 'square', 0.05], [554, 0.18, 'square', 0.05],
    [740, 0.18, 'square', 0.05], [554, 0.26, 'square', 0.05],
  ],
  dial: [
    [1200, 0.05, 'square', 0.03], [0, 0.04], [900, 0.05, 'square', 0.03], [0, 0.04],
    [1500, 0.05, 'square', 0.03], [0, 0.25], [440, 0.4, 'sine', 0.05], [0, 0.3], [440, 0.4, 'sine', 0.05],
  ],
  // At 0: ~0.2 s silence → deep low hit → BEEP—BEEP
  zeroHit: [
    [0, 0.2],
    [70, 0.45, 'sine', 0.35, 38],
    [0, 0.08],
    [1046, 0.14, 'square', 0.07], [0, 0.09], [1046, 0.2, 'square', 0.07],
  ],
};

let ctx = null;
let muted = !CONFIG.soundOnByDefault;
let music = null;
const listeners = new Set();

export const isMuted = () => muted;
export function setMuted(v) {
  muted = v;
  if (music) music.muted = v;
  listeners.forEach((fn) => fn(muted));
}
export function onMuteChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Call from a click so browsers allow sound later. */
export function unlockAudio() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    ctx = null;
  }
}

function synth(steps) {
  if (!ctx) return;
  let t = ctx.currentTime + 0.02;
  for (const [freq, dur, wave = 'square', gain = 0.05, slide] of steps) {
    if (freq > 0) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, t);
      if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    }
    t += dur;
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
  if (SYNTH[name]) synth(SYNTH[name]);
}

/** Countdown tick: pitch and level rise as the number falls (n = seconds left). */
export function playTick(n, total = 10) {
  if (muted) return;
  if (ASSETS.audio.tick) return playCue('tick');
  const k = 1 - n / total; // 0 → 1
  synth([[900 + k * 700, 0.04, 'square', 0.03 + k * 0.05]]);
}

/** Background music under the UI screens (only if ASSETS.audio.music is set). */
export function setMusic(on) {
  const src = ASSETS.audio.music;
  if (!src) return;
  if (!music) {
    music = new Audio(src);
    music.loop = true;
    music.volume = 0.35;
    music.muted = muted;
  }
  if (on) music.play().catch(() => {});
  else music.pause();
}
