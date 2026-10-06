/** Touch-first device (phone / tablet): show on-screen controls, "TAP" hints. */
export const isTouch =
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

/** Send a synthetic key press so touch buttons reuse the keyboard handlers. */
export function sendKey(key, type = 'keydown') {
  const code = key === ' ' ? 'Space' : key.length === 1 ? `Key${key.toUpperCase()}` : key;
  window.dispatchEvent(new KeyboardEvent(type, { key, code, bubbles: true }));
}

/** Phones: go fullscreen and lock landscape where the browser allows it (Android). */
export function enterLandscape() {
  if (!isTouch) return;
  try {
    const el = document.documentElement;
    const p = el.requestFullscreen?.({ navigationUI: 'hide' });
    Promise.resolve(p)
      .then(() => screen.orientation?.lock?.('landscape'))
      .catch(() => {});
  } catch {}
}
