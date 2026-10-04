import { memo, useEffect, useRef, useState } from 'react';

/**
 * Two stacked <video> layers.
 *  - The active layer plays the current scene.
 *  - The idle layer preloads the next scene, so the cut is instant and the two
 *    can crossfade. Only one upcoming clip is ever preloaded.
 *
 * mode: 'hidden'   — start screen, nothing visible
 *       'play'     — cinematic scene fills the viewport
 *       'backdrop' — last frame frozen, blurred and dimmed behind the phone UI
 */
function CinematicPlayer({ stateId, state, mode, preloadSrc, muted, onEnded, onMissing }) {
  const a = useRef(null);
  const b = useRef(null);
  const layers = [a, b];
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const stateRef = useRef({ stateId, state });
  stateRef.current = { stateId, state };

  // Start the clip for a video state.
  useEffect(() => {
    if (state.type !== 'video') return;
    const src = state.asset;
    const cur = activeRef.current;
    const other = 1 - cur;
    const curEl = layers[cur].current;
    const otherEl = layers[other].current;

    let idx;
    if (otherEl.dataset.src === src) idx = other;
    else if (!curEl.dataset.src) idx = cur;
    else idx = other;

    const el = layers[idx].current;
    if (el.dataset.src !== src) {
      el.dataset.src = src;
      el.src = src;
      el.load();
    }
    try {
      el.currentTime = 0;
    } catch {}
    el.muted = muted;
    // Retrigger the entry animation for this layer.
    el.dataset.fx = state.transition || 'fade';
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = '';

    // A clip that already failed while preloading won't fire 'error' again.
    if (el.error) onMissing(stateId, src);
    const p = el.play();
    if (p?.catch) {
      p.catch(() => {
        // Autoplay with sound refused — fall back to muted playback.
        el.muted = true;
        el.play().catch(() => {});
      });
    }
    // Stop the outgoing layer once it has faded.
    const prev = layers[1 - idx].current;
    const t = setTimeout(() => prev && prev.pause(), 900);

    activeRef.current = idx;
    setActive(idx);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId]);

  // Preload the next clip into the idle layer, after the crossfade settles.
  useEffect(() => {
    if (!preloadSrc) return;
    const t = setTimeout(
      () => {
        const el = layers[1 - activeRef.current].current;
        if (!el || el.dataset.src === preloadSrc) return;
        el.pause();
        el.dataset.src = preloadSrc;
        el.preload = 'auto';
        el.src = preloadSrc;
        el.load();
      },
      state.type === 'video' ? 1000 : 50,
    );
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId, preloadSrc]);

  // Freeze when leaving video playback.
  useEffect(() => {
    if (mode === 'play') return;
    layers.forEach((r) => r.current && r.current.pause());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    layers.forEach((r) => {
      if (r.current) r.current.muted = muted;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  const handleEnded = (idx) => () => {
    const { stateId: id, state: s } = stateRef.current;
    if (idx === activeRef.current && s.type === 'video') onEnded(id);
  };

  const handleError = (idx) => () => {
    const el = layers[idx].current;
    const { stateId: id, state: s } = stateRef.current;
    if (s.type === 'video' && el?.dataset.src === s.asset) onMissing(id, s.asset);
  };

  return (
    <div className={`cine cine-${mode}`} aria-hidden="true">
      {[0, 1].map((i) => (
        <video
          key={i}
          ref={layers[i]}
          className={`cine-layer ${active === i ? 'is-active' : ''}`}
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          onEnded={handleEnded(i)}
          onError={handleError(i)}
        />
      ))}
      <div className="cine-grade" />
    </div>
  );
}

export default memo(CinematicPlayer);
