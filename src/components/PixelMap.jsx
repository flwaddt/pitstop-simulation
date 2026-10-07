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
/** Ambulance path (same streets as ROUTE, stopping just short of the pin). */
const DRIVE = [[50, 48], [50, 38], [38, 38], [38, 30], [33, 30], [33, 27]];
/** 24×12 pixel ambulance, facing right. */
const AMB_ROWS = [
  '.......kkkkkk...........',
  '.......kRkBk............',
  'kkkkkkkkkkkkkkkkkk......',
  'kWWWRWWWWWWWWWWWWkkkkk..',
  'kWWRRRWWWWWWkGGGkWWWWkk.',
  'kWWWRWWWWWWWkGGGkWWGGGWk',
  'kRRRRRRRRRRRRRRRRRRRRRRk',
  'kWWWWWWWWWWWWWWWWWWWWWWk',
  'kwwwwwwwwwwwwwwwwwwwwwYk',
  'kkkkTTTkkkkkkkkkkTTTkkkk',
  '...TTtTT.........TTtTT..',
  '....TTT...........TTT...',
];
const AMB_PAL = { k: '#111111', W: '#f4f4f4', w: '#d6d6d6', R: '#e3262a', B: '#3d6fb8', G: '#9fb8c8', T: '#2a2a2a', t: '#7a7a7a', Y: '#ffd51e' };
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
  // Drive the ambulance along the route with requestAnimationFrame (works the
  // same in every browser, unlike SMIL). It stops just below the rider's pin.
  const unit = useRef(null);
  useEffect(() => {
    if (mode !== 'route' || !unit.current) return;
    const segs = [];
    let total = 0;
    for (let i = 1; i < DRIVE.length; i++) {
      const [x0, y0] = DRIVE[i - 1];
      const [x1, y1] = DRIVE[i];
      const len = Math.hypot(x1 - x0, y1 - y0);
      segs.push({ x0, y0, x1, y1, len, from: total });
      total += len;
    }
    const start = performance.now();
    const dur = travel * 1000;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const e = 1 - Math.pow(1 - t, 2); // ease out: slows as it arrives
      const d = e * total;
      const s = segs.find((g) => d <= g.from + g.len) || segs[segs.length - 1];
      const k = s.len ? (d - s.from) / s.len : 1;
      const x = s.x0 + (s.x1 - s.x0) * k;
      const y = s.y0 + (s.y1 - s.y0) * k;
      const flip = s.x1 < s.x0 ? -1 : 1; // face the way it drives
      unit.current?.setAttribute('transform', `translate(${x} ${y}) scale(${flip} 1)`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, travel]);
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
          </g>
        )}

        {/* rider location: pulse + pin (tip at PIN) */}
        <circle cx={PIN.x} cy={PIN.y + 4.5} r="3" className="pmap-pulse" />
        <g transform={`translate(${PIN.x - 4.5} ${PIN.y - 4})`}><g className="pmap-pin">
          {PIN_ROWS.flatMap((row, y) =>
            [...row].map((ch, x) => (PIN_PAL[ch] ? <rect key={`${x}.${y}`} x={x} y={y} width="1.03" height="1.03" fill={PIN_PAL[ch]} /> : null)),
          )}
        </g></g>

        {/* ambulance drawn last so it is never hidden under the pin */}
        {mode === 'route' && (
          <g ref={unit} className="pmap-unit" transform={`translate(${DRIVE[0][0]} ${DRIVE[0][1]})`}>
            <g transform="translate(-4.8 -2.4) scale(0.4)">
              {AMB_ROWS.flatMap((row, y) =>
                [...row].map((ch, x) => (AMB_PAL[ch] ? <rect key={`a${x}.${y}`} x={x} y={y} width="1.03" height="1.03" fill={AMB_PAL[ch]} /> : null)),
              )}
              <rect x="8" y="1" width="1" height="1" className="pmap-beacon" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}

export default memo(PixelMap);
