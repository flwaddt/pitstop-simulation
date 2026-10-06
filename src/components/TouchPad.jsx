import { sendKey } from '../lib/device.js';

/**
 * On-screen controls for phones in the RIDE segment. Each button holds a
 * key down while pressed (◀ ▲ ▼ ▶ = A W S D), and NEXT sends SPACE.
 */
function HoldKey({ k, label, className = '' }) {
  const down = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    sendKey(k, 'keydown');
  };
  const up = (e) => {
    e.preventDefault();
    sendKey(k, 'keyup');
  };
  return (
    <button
      type="button"
      className={`tp-btn ${className}`}
      onPointerDown={down}
      onPointerUp={up}
      onPointerCancel={up}
      onLostPointerCapture={up}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={label}
    >
      {label}
    </button>
  );
}

export default function TouchPad({ nextLabel = 'NEXT' }) {
  return (
    <div className="touchpad">
      <div className="tp-dpad">
        <HoldKey k="w" label="▲" className="tp-up" />
        <HoldKey k="a" label="◀" className="tp-left" />
        <HoldKey k="d" label="▶" className="tp-right" />
        <HoldKey k="s" label="▼" className="tp-down" />
      </div>
      <button type="button" className="tp-next" onClick={() => sendKey(' ')}>
        {nextLabel} ▸
      </button>
    </div>
  );
}
