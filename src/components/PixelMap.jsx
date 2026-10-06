import { memo, useEffect, useRef } from 'react';

/**
 * Fictional pixel street map (no real address).
 * mode 'pin'     — live location marker (UI 7)
 * mode 'monitor' — marker + dotted data lines (UI 8)
 * mode 'route'   — response vehicle following a dashed route to the rider (UI 10)
 */
const W = 64;
const H = 44;
const PIN = { x: 33, y: 17 };
const ROUTE = 'M50 46 V38 H38 V30 H33 V22';
const PIN_ROWS = ['..kkkkk..', '.kCHCCCk.', 'kCHCkCCCk', 'kCCkkkCCk', 'kCCCkCCck', '.kCCCCck.', '..kCCck..', '...kck...', '....k....'];
const PIN_PAL = { k: '#111111', C: '#25b3c8', c: '#1a8597', H: '#7fe3f0' };

const BLOCKS = [
  // [x, y, w, h, colour]
  [0, 0, 9, 4, '#e8d8ab'], [12, 0, 12, 4, '#e8d8ab'], [14, 1, 7, 2, '#9a9a9a'],
  [27, 0, 15, 4, '#e8d8ab'], [29, 1, 4, 2, '#9a9a9a'], [35, 1, 5, 2, '#9a9a9a'],
  [45, 0, 19, 4, '#6fbf59'],
  [0, 7, 9, 13, '#6fbf59'],
  [12, 7, 12, 13, '#e8d8ab'], [14, 9, 8, 6, '#9a9a9a'], [15, 17, 4, 2, '#6fbf59'],
  [27, 7, 15, 13, '#e8d8ab'], [28, 8, 5, 6, '#9a9a9a'], [36, 8, 5, 10, '#9a9a9a'], [29, 15, 3, 3, '#6fbf59'],
  [45, 7, 8, 13, '#e8d8ab'], [46, 8, 5, 5, '#9a9a9a'],
  [56, 7, 8, 13, '#6fbf59'],
  [0, 23, 9, 9, '#e8d8ab'], [2, 25, 5, 5, '#9a9a9a'],
  [12, 23, 12, 9, '#6fbf59'],
  [27, 23, 15, 9, '#e8d8ab'], [29, 24, 8, 6, '#9a9a9a'],
  [45, 23, 19, 9, '#e8d8ab'], [47, 24, 6, 6, '#9a9a9a'], [56, 24, 6, 7, '#9a9a9a'],
  [0, 35, 9, 9, '#9a9a9a'], [12, 35, 12, 9, '#e8d8ab'], [14, 37, 8, 5, '#9a9a9a'],
  [27, 35, 15, 9, '#6fbf59'], [45, 35, 19, 9, '#e8d8ab'], [53, 36, 9, 6, '#9a9a9a'],
];

function PixelMap({ mode = 'pin', travel = 6 }) {
  // SMIL clocks start at page load, so start the drive when the map mounts.
  const motion = useRef(null);
  useEffect(() => {
    try {
      motion.current?.beginElement();
    } catch {}
  }, []);
  return (
    <div className={`pmap pmap-${mode}`}>
      <svg viewBox={`0 0 ${W} ${H}`} shapeRendering="crispEdges" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Fictional map with the rider's live location">
        <rect width={W} height={H} fill="#f3f1ea" />
        {/* main roads */}
        <rect x="0" y="4" width={W} height="3" fill="#f2b45c" />
        <rect x="42" y="0" width="3" height={H} fill="#f2b45c" />
        {/* side streets */}
        <rect x="0" y="20" width={W} height="3" fill="#ffffff" />
        <rect x="0" y="32" width={W} height="3" fill="#ffffff" />
        <rect x="9" y="0" width="3" height={H} fill="#ffffff" />
        <rect x="24" y="0" width="3" height={H} fill="#ffffff" />
        <rect x="53" y="0" width="3" height={H} fill="#ffffff" />
        {BLOCKS.map(([x, y, w, h, c], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill={c} />
        ))}

        {mode === 'monitor' && (
          <g className="pmap-data" fill="none" stroke="#1d7f9a" strokeWidth="0.6" strokeDasharray="1 1">
            <path d={`M${PIN.x} 0 V${PIN.y}`} />
            <path d={`M${PIN.x} ${PIN.y + 4} H${W}`} />
            <path d={`M0 21.5 H${PIN.x - 4}`} />
            <path d={`M${PIN.x + 3} 33.5 H${W}`} />
            <path d={`M48 ${PIN.y + 4} V${H}`} />
          </g>
        )}

        {mode === 'route' && (
          <g>
            <path d={ROUTE} fill="none" stroke="#e3262a" strokeWidth="1.2" strokeDasharray="2 1.2" className="pmap-route" />
            <g className="pmap-unit">
              <rect x="-2" y="-1.4" width="4" height="2.8" fill="#111" />
              <rect x="-1.6" y="-1" width="3.2" height="2" fill="#f4f4f4" />
              <rect x="-1.6" y="-0.25" width="3.2" height="0.5" fill="#e3262a" />
              <rect x="-0.4" y="-1.6" width="0.8" height="0.6" className="pmap-beacon" />
              <animateMotion ref={motion} begin="indefinite" dur={`${travel}s`} fill="freeze" rotate="auto" path={ROUTE} />
            </g>
          </g>
        )}

        {/* rider location: pulse + pin (tip at PIN) */}
        <circle cx={PIN.x} cy={PIN.y + 4.5} r="3" className="pmap-pulse" />
        <g transform={`translate(${PIN.x - 4.5} ${PIN.y - 4})`}><g className="pmap-pin">
          {PIN_ROWS.flatMap((row, y) =>
            [...row].map((ch, x) => (PIN_PAL[ch] ? <rect key={`${x}.${y}`} x={x} y={y} width="1.03" height="1.03" fill={PIN_PAL[ch]} /> : null)),
          )}
        </g></g>
      </svg>
    </div>
  );
}

export default memo(PixelMap);
