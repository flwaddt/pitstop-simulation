/**
 * Ride high score (kept in this browser only) and the last run's score.
 * Storage can be blocked (private mode, artifacts), so every access is guarded.
 */
const KEY = 'pitstop.ride.best';
let memBest = 0;
let last = 0;

export function getBest() {
  try {
    return Math.max(memBest, Number(localStorage.getItem(KEY)) || 0);
  } catch {
    return memBest;
  }
}

/** Records a finished run. Returns true when it is a new best. */
export function recordScore(score) {
  last = score;
  const best = getBest();
  if (score <= best) return false;
  memBest = score;
  try {
    localStorage.setItem(KEY, String(score));
  } catch {
    /* storage unavailable — keep it in memory */
  }
  return true;
}

export const lastScore = () => last;
export const pad5 = (n) => String(Math.floor(n)).padStart(5, '0');
