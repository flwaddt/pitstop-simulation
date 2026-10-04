/**
 * Circular countdown / verification ring.
 *
 * mode 'drain' — arc empties over `total` seconds (Are you OK?)
 * mode 'fill'  — arc fills over `total` seconds (Verifying)
 * The arc animates in CSS for a smooth sweep; the number is driven by JS.
 */
export default function ProgressIndicator({ total, value, mode = 'drain', tone = 'red', top, label, pad = false }) {
  const num = pad ? String(value).padStart(2, '0') : String(value);
  return (
    <div className={`ring ring-${tone} ring-${mode}`} style={{ '--dur': `${total}s` }} role="timer" aria-live="off">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="ring-ticks" cx="60" cy="60" r="56" />
        <circle className="ring-ticks-2" cx="60" cy="60" r="51" />
        <circle className="ring-track" cx="60" cy="60" r="45" />
        <circle className="ring-arc" cx="60" cy="60" r="45" pathLength="100" />
        <circle className="ring-inner" cx="60" cy="60" r="37" />
      </svg>
      <div className="ring-center">
        {top && <span className="ring-top">{top}</span>}
        <span className="ring-num" aria-label={`${value} seconds`}>{num}</span>
        {label && <span className="ring-label">{label}</span>}
      </div>
    </div>
  );
}
