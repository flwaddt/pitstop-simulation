import { useEffect, useState } from 'react';
import { SmartPhone } from './Pixel.jsx';

/**
 * Phones held upright: the cinematic scenes are 16:9, so ask the player to
 * turn the phone. Disappears on rotation; "PLAY UPRIGHT" dismisses it.
 */
export default function RotateHint() {
  const q = '(orientation: portrait)';
  const [portrait, setPortrait] = useState(() => window.matchMedia(q).matches);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(q);
    const h = () => setPortrait(m.matches);
    m.addEventListener?.('change', h);
    return () => m.removeEventListener?.('change', h);
  }, []);
  if (!portrait || dismissed) return null;
  return (
    <div className="rotate" role="dialog" aria-label="Rotate your phone">
      <div className="rotate-ico" aria-hidden="true">
        <SmartPhone />
      </div>
      <p className="rotate-t">ROTATE YOUR PHONE</p>
      <p className="rotate-s">PITSTOP PLAYS BEST IN LANDSCAPE</p>
      <button type="button" className="rbtn rotate-btn" onClick={() => setDismissed(true)}>
        <span className="rbtn-br">[</span>
        <span className="rbtn-label">PLAY UPRIGHT</span>
        <span className="rbtn-br">]</span>
      </button>
    </div>
  );
}
