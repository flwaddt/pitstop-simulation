import { memo, useMemo } from 'react';

/**
 * Fictional, generic Vietnamese neighbourhood rendered as a top-down voxel map.
 * No real streets or addresses. Generated from a fixed seed so it is identical
 * on every run.
 *
 * mode 'locate'  — GPS scan around the rider (acquired=true shows the fix)
 * mode 'respond' — a generic response vehicle drives toward the rider
 */
const W = 200;
const H = 150;
const ROADS_H = [51, 107]; // centre lines
const ROADS_V = [59, 139];
const ROAD_HALF = 7;
const WALK = 3.5;
const RIDER = { x: 100, y: 107 };
const ROUTE = 'M-12 51 H139 V107 H107';

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ROOFS = ['#9b5a46', '#a8a49b', '#8d9299', '#b8b2a5', '#7c8a83', '#a46a52', '#c2bdb2'];
const WALLS = ['#6e4134', '#77746d', '#62676d', '#85807a', '#56625c', '#744b3b', '#8a867f'];

function nearRoad(x, y, size) {
  const pad = ROAD_HALF + WALK;
  for (const ry of ROADS_H) if (y + size > ry - pad && y < ry + pad) return true;
  for (const rx of ROADS_V) if (x + size > rx - pad && x < rx + pad) return true;
  return false;
}

function buildTiles() {
  const r = rng(84);
  const tiles = [];
  const S = 9;
  for (let y = 1; y < H; y += S) {
    for (let x = 1; x < W; x += S) {
      if (nearRoad(x, y, S - 1)) continue;
      const v = r();
      if (v < 0.72) {
        const c = Math.floor(r() * ROOFS.length);
        tiles.push({ kind: 'house', x, y, s: S - 1.2, roof: ROOFS[c], wall: WALLS[c], tall: r() > 0.7 });
      } else if (v < 0.9) {
        tiles.push({ kind: 'tree', x, y, s: S - 1.2, shade: r() > 0.5 ? '#3f7a47' : '#356b3d' });
      }
    }
  }
  return tiles;
}

function VoxelMap({ mode = 'locate', acquired = true, travel = 11 }) {
  const tiles = useMemo(buildTiles, []);

  return (
    <svg className={`vmap vmap-${mode} ${acquired ? 'is-acquired' : ''}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={mode === 'respond' ? 'Map: response vehicle approaching the rider' : 'Map: rider location from phone GPS'}>
      <rect width={W} height={H} fill="#3b4048" />

      {/* sidewalks */}
      {ROADS_H.map((y) => (
        <rect key={`sh${y}`} x="0" y={y - ROAD_HALF - WALK} width={W} height={(ROAD_HALF + WALK) * 2} fill="#555a61" />
      ))}
      {ROADS_V.map((x) => (
        <rect key={`sv${x}`} x={x - ROAD_HALF - WALK} y="0" width={(ROAD_HALF + WALK) * 2} height={H} fill="#555a61" />
      ))}
      {/* asphalt */}
      {ROADS_H.map((y) => (
        <rect key={`rh${y}`} x="0" y={y - ROAD_HALF} width={W} height={ROAD_HALF * 2} fill="#2a2e35" />
      ))}
      {ROADS_V.map((x) => (
        <rect key={`rv${x}`} x={x - ROAD_HALF} y="0" width={ROAD_HALF * 2} height={H} fill="#2a2e35" />
      ))}
      {/* lane dashes */}
      {ROADS_H.map((y) => (
        <line key={`dh${y}`} x1="0" x2={W} y1={y} y2={y} stroke="#8b929c" strokeWidth="0.8" strokeDasharray="4 4" />
      ))}
      {ROADS_V.map((x) => (
        <line key={`dv${x}`} y1="0" y2={H} x1={x} x2={x} stroke="#8b929c" strokeWidth="0.8" strokeDasharray="4 4" />
      ))}
      {/* crosswalks at intersections */}
      {ROADS_H.flatMap((y) =>
        ROADS_V.map((x) => (
          <g key={`cw${x}-${y}`} fill="#9aa1aa" opacity=".55">
            {[-5, -2, 1, 4].map((o) => (
              <rect key={o} x={x + o} y={y - ROAD_HALF - 3} width="1.6" height="2.4" />
            ))}
          </g>
        )),
      )}

      {/* blocks */}
      {tiles.map((t, i) =>
        t.kind === 'house' ? (
          <g key={i}>
            <rect x={t.x + 0.8} y={t.y + 1.2} width={t.s} height={t.s} fill="#000" opacity=".25" />
            <rect x={t.x} y={t.y} width={t.s} height={t.s} fill={t.wall} />
            <rect x={t.x} y={t.y} width={t.s} height={t.s * (t.tall ? 0.62 : 0.72)} fill={t.roof} />
          </g>
        ) : (
          <g key={i}>
            <rect x={t.x + 1.5} y={t.y + 1.5} width={t.s - 2} height={t.s - 2} fill="#000" opacity=".22" />
            <rect x={t.x + 1} y={t.y + 1} width={t.s - 2} height={t.s - 2} fill={t.shade} />
            <rect x={t.x + 2.2} y={t.y + 2} width={(t.s - 2) / 2.2} height={(t.s - 2) / 2.2} fill="#5c9a5f" opacity=".7" />
          </g>
        ),
      )}

      {/* tint so the map sits inside the dark UI */}
      <rect width={W} height={H} fill="#0e1622" opacity=".38" />

      {mode === 'locate' && (
        <g className="vmap-scan">
          <line x1="0" x2={W} y1={RIDER.y} y2={RIDER.y} className="scan-line" />
          <line y1="0" y2={H} x1={RIDER.x} x2={RIDER.x} className="scan-line" />
          <circle cx={RIDER.x} cy={RIDER.y} r="10" className="scan-ring sr1" />
          <circle cx={RIDER.x} cy={RIDER.y} r="10" className="scan-ring sr2" />
          <circle cx={RIDER.x} cy={RIDER.y} r="10" className="scan-ring sr3" />
        </g>
      )}

      {mode === 'respond' && (
        <g>
          <path d={ROUTE} className="route-line" style={{ animationDuration: `${travel}s` }} />
          <g className="vehicle">
            <rect x="-7.5" y="-4.2" width="15" height="8.4" fill="#000" opacity=".3" transform="translate(0.8 1)" />
            <rect x="-7.5" y="-4.2" width="15" height="8.4" fill="#eef1f4" />
            <rect x="-7.5" y="-1" width="15" height="2" fill="#e0453f" />
            <rect x="2.5" y="-4.2" width="5" height="8.4" fill="#c9d3dd" />
            <rect x="-2" y="-3.6" width="2" height="2" className="beacon b-red" />
            <rect x="-2" y="1.6" width="2" height="2" className="beacon b-blue" />
            <animateMotion dur={`${travel}s`} fill="freeze" rotate="auto" path={ROUTE} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.3 0 0.4 1" />
          </g>
        </g>
      )}

      {/* rider position */}
      <g className="rider-mark" transform={`translate(${RIDER.x} ${RIDER.y})`}>
        <circle r="7" className="rider-pulse" />
        <rect x="-3" y="-3" width="6" height="6" className="rider-core" />
        <rect x="-1.2" y="-1.2" width="2.4" height="2.4" fill="#fff" />
      </g>
    </svg>
  );
}

export default memo(VoxelMap);
