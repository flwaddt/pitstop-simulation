/**
 * Voxel / pixel-art glyphs drawn from character grids, so they stay crisp at
 * any size and match the blocky world of the cinematic scenes.
 */

function Grid({ rows, palette, className = '', title }) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const rects = [];
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const fill = palette[ch];
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={fill} className={`px-${ch}`} />);
    });
  });
  return (
    <svg className={`pixart ${className}`} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {rects}
    </svg>
  );
}

/** Side view of the matte helmet with the PITSTOP detector on its dock. */
const HELMET = [
  '......hhhhhh......',
  '....hhHHHHHHhh....',
  '...hHHXXXXXXXXh...',
  '..hHXXXXXXXXXXXx..',
  '.hHXXXXXXXXXXXXXx.',
  '.HXXXXXXXXXXXXXXXx',
  'xXXXXXXXXXXvvvvvvx',
  'xXXXXXXXXXvVVVVVVx',
  'xXXXXXXXXXvVVVVVVx',
  'xXXXXXXXXXXvvvvvvx',
  'xXXXXkddddXXXXXXx.',
  'xXXXXkddrdXXXXXx..',
  '.xXXXkddddXXXXx...',
  '..xxxxxxxxxxxx....',
];
export function HelmetPixel({ led = true }) {
  return (
    <Grid
      className={`helmet ${led ? 'helmet-led' : ''}`}
      title="Helmet with PITSTOP detector"
      rows={HELMET}
      palette={{
        h: '#cfd4da',
        H: '#b3b9c1',
        X: '#9097a1',
        x: '#5f6670',
        v: '#2b3038',
        V: '#3d454f',
        k: '#0d0f12',
        d: '#1b1f25',
        r: '#ff4d4a',
      }}
    />
  );
}

const PHONE = [
  'xxxxxxxx',
  'xssssssx',
  'xsSSSSsx',
  'xsSSSSsx',
  'xsSSSSsx',
  'xsSSSSsx',
  'xsSSSSsx',
  'xsSSSSsx',
  'xsSSSSsx',
  'xssssssx',
  'xsssbssx',
  'xxxxxxxx',
];
export function PhonePixel() {
  return (
    <Grid
      className="phone-px"
      title="Rider's phone"
      rows={PHONE}
      palette={{ x: '#7d858f', s: '#3a4049', S: '#4a525d', b: '#9aa1aa' }}
    />
  );
}

const WARNING = [
  '.......rr.......',
  '......rRRr......',
  '......rRRr......',
  '.....rRRRRr.....',
  '.....rRkkRr.....',
  '....rRRkkRRr....',
  '....rRRkkRRr....',
  '...rRRRkkRRRr...',
  '...rRRRkkRRRr...',
  '..rRRRRRRRRRRr..',
  '..rRRRRkkRRRRr..',
  '.rRRRRRkkRRRRRr.',
  'rrrrrrrrrrrrrrrr',
];
export function WarningPixel() {
  return <Grid className="warn-px" title="Emergency" rows={WARNING} palette={{ r: '#b5262a', R: '#ff4d4a', k: '#1a0b0c' }} />;
}

const AVATAR = [
  '...gggggg...',
  '..gGGGGGGg..',
  '..gGGGGGGg..',
  '..gGGGGGGg..',
  '..gGGGGGGg..',
  '...gggggg...',
  '............',
  '.bbbbbbbbbb.',
  'bBBBBBBBBBBb',
  'bBBBBBBBBBBb',
  'bBBBBBBBBBBb',
];
export function AvatarPixel() {
  return <Grid className="avatar-px" rows={AVATAR} palette={{ g: '#6f7a88', G: '#a7b1bd', b: '#3a4a5e', B: '#58708c' }} />;
}

const PIN = [
  '..rrrr..',
  '.rRRRRr.',
  'rRRwwRRr',
  'rRRwwRRr',
  '.rRRRRr.',
  '..rRRr..',
  '...rr...',
];
export function PinPixel({ tone = 'red' }) {
  const pal =
    tone === 'blue'
      ? { r: '#2a6fb8', R: '#58aefc', w: '#e8edf3' }
      : { r: '#b5262a', R: '#ff4d4a', w: '#ffe3e2' };
  return <Grid className="pin-px" rows={PIN} palette={pal} />;
}

const CHIP = [
  '.kkkkkk.',
  'kddddddk',
  'kddddddk',
  'kdddrddk',
  'kddddddk',
  '.kkkkkk.',
];
/** The detector itself: a small matte block with a status LED. */
export function DetectorPixel() {
  return <Grid className="det-px" rows={CHIP} palette={{ k: '#6a727c', d: '#20252c', r: '#ff4d4a' }} />;
}

/* ── Line icons (stroke-based, for chips and labels) ─────────────── */

export function BluetoothIcon({ className = '' }) {
  return (
    <svg className={`ico ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7l10 10-5 4V3l5 4L7 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
    </svg>
  );
}

export function WavesIcon({ className = '' }) {
  return (
    <svg className={`ico waves ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="2" y="17" width="6" height="6" className="wave-dot" />
      <path className="wave w1" d="M14 10 Q22 20 14 30" />
      <path className="wave w2" d="M21 5 Q33 20 21 35" />
    </svg>
  );
}

export function PhoneIcon({ className = '' }) {
  return (
    <svg className={`ico ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.6 3h3l1.5 4.2-2 1.4a12 12 0 0 0 6.3 6.3l1.4-2 4.2 1.5v3A2.6 2.6 0 0 1 18.4 20 15.4 15.4 0 0 1 4 5.6 2.6 2.6 0 0 1 6.6 3z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SmsIcon({ className = '' }) {
  return (
    <svg className={`ico ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4h18v12H9l-5 4v-4H3z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M7 8h10M7 12h6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function TickIcon({ className = '' }) {
  return (
    <svg className={`ico ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
    </svg>
  );
}

export function GpsIcon({ className = '' }) {
  return (
    <svg className={`ico ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
