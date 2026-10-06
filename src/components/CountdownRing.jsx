/**
 * Segmented pixel countdown ring (UI 3). Segments switch from blue to grey
 * as time runs out; the number is the real JS countdown.
 */
const SEGS = 20;

export default function CountdownRing({ value, total = 10, label = 'PLEASE RESPOND', zero = false }) {
  const lit = Math.round((value / total) * SEGS);
  return (
    <div className={`cring ${zero ? 'is-zero' : ''} ${value <= 3 ? 'is-low' : ''}`} role="timer" aria-label={`${value} seconds left`}>
      <svg viewBox="0 0 100 100" shapeRendering="crispEdges" aria-hidden="true">
        <circle cx="50" cy="50" r="47" fill="#111" />
        {Array.from({ length: SEGS }, (_, i) => (
          <rect
            key={i}
            x="45"
            y="5"
            width="10"
            height="11"
            transform={`rotate(${(i * 360) / SEGS} 50 50)`}
            className={i < lit ? 'seg on' : 'seg'}
          />
        ))}
        <circle cx="50" cy="50" r="33" fill="#1d2a33" stroke="#111" strokeWidth="2" />
      </svg>
      <div className="cring-c">
        <span className="cring-n">{value}</span>
        <span className="cring-l">{label}</span>
      </div>
    </div>
  );
}
