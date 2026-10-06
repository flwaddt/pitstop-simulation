/** Which build this is: 'desktop' (keyboard), 'mobile' (touch) or undefined (auto-detect). */
export const DEVICE_BUILD = import.meta.env.VITE_DEVICE;

/** Does this device look like a phone / tablet? */
export const looksTouch =
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0);

/** Show on-screen controls and "TAP" hints. Fixed by the build, else detected. */
export const isTouch = DEVICE_BUILD === 'mobile' ? true : DEVICE_BUILD === 'desktop' ? false : looksTouch;

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
