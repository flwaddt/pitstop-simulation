/**
 * 8-bit pixel icons drawn from character grids (crisp at any size).
 * Each grid row is a string; each character maps to a colour in the palette.
 */
export function Grid({ rows, pal, className = '', title, style }) {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const rects = [];
  rows.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (pal[ch]) rects.push(<rect key={`${x}.${y}`} x={x} y={y} width="1.03" height="1.03" fill={pal[ch]} className={`c-${ch}`} />);
    }),
  );
  return (
    <svg className={`px ${className}`} style={style} viewBox={`0 0 ${w} ${h}`} shapeRendering="crispEdges" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {rects}
    </svg>
  );
}

const K = '#111111';

/* Helmet with PITSTOP light and impact flame */
export const Helmet = ({ flame = true }) => (
  <Grid
    className="ico-helmet"
    title="Helmet with PITSTOP"
    pal={{ k: K, G: '#b9bcc0', W: '#e8eaec', D: '#7c8086', V: '#3a3f45', r: '#e3262a', R: '#ff5a4f', f: flame ? '#ff7a1a' : null, Y: flame ? '#ffd23a' : null, F: flame ? '#e8401c' : null }}
    rows={[
      '.f................',
      'fYf...............',
      'fYFf..............',
      '.fF..kkkkkkkk.....',
      '...kkGGGGGGGGkk...',
      '..kGWWGGGGGGGGGk..',
      '.kGWGGGGGGGGGGGGk.',
      '.kGGGGGGkkkkkkkkkk',
      'kGGGGGGkrrkVVVVVVk',
      'kGGGGGGkrrkVVVVVVk',
      'kGGGGGGkkkkkkkkkkk',
      'kGGGGGGGGGGGGGGGk.',
      '.kDGGGGGGGGGGGRk..',
      '..kDDDDDDDDDDDk...',
      '...kkkkkkkkkkk....',
    ]}
  />
);

/* Classic candy-bar phone (UI 1) */
export const OldPhone = () => (
  <Grid
    title="Phone"
    pal={{ k: K, W: '#d9dcdf', S: '#808a90', s: '#a4b0b5', B: '#bfc3c6' }}
    rows={[
      '.......k.',
      '.......k.',
      '.......k.',
      '.kkkkkkk.',
      'kWWWWWWWk',
      'kWkkkkkWk',
      'kWkSsSkWk',
      'kWkSSSkWk',
      'kWkkkkkWk',
      'kWWWWWWWk',
      'kWBWBWBWk',
      'kWWWWWWWk',
      'kWBWBWBWk',
      'kWWWWWWWk',
      'kWBWBWBWk',
      'kWWWWWWWk',
      '.kkkkkkk.',
    ]}
  />
);

/* Smartphone (UI 2) */
export const SmartPhone = () => (
  <Grid
    title="Smartphone"
    pal={{ k: K, D: '#3d4248', S: '#c6ccd2', s: '#e9edf0', L: '#8f979e' }}
    rows={[
      '.kkkkkkkk.',
      'kDDDDDDDDk',
      'kDsSSSSSDk',
      'kDSsSSSSDk',
      'kDSSsSSSDk',
      'kDSSSsSSDk',
      'kDSSSSsSDk',
      'kDSSSSSsDk',
      'kDSSSSSSDk',
      'kDSSSSSSDk',
      'kDSSSSSSDk',
      'kDDDDDDDDk',
      'kDDDLLDDDk',
      '.kkkkkkkk.',
    ]}
  />
);

/* PITSTOP detector unit (UI 2) */
export const Detector = () => (
  <Grid
    title="PITSTOP detector"
    pal={{ k: K, G: '#9da1a6', W: '#d2d5d8', D: '#5a5e63', r: '#e3262a', b: '#1a1a1a' }}
    rows={[
      '..kkkkkkkkkk..',
      '.kWWWWWWWWWWk.',
      'kWGGGGGGGGGGGk',
      'kGbbbbbbbbbbGk',
      'kGbrrrrrrrrbGk',
      'kGbbbbbbbbbbGk',
      'kGGGGGGGGGGGGk',
      'kGDGDGGGGDGDGk',
      'kDDDDDDDDDDDDk',
      '.kkkkkkkkkkkk.',
    ]}
  />
);

/* Medical monitor with heartbeat */
export const Monitor = ({ variant = 'cyan' }) => {
  const screen = variant === 'cyan' ? '#33b7c9' : '#0f0f0f';
  const line = variant === 'cyan' ? '#e8fbff' : '#e3262a';
  return (
    <Grid
      title="Monitor"
      pal={{ k: K, G: '#a9adb1', W: '#d6d9dc', s: screen, L: line, r: '#e3262a', c: '#1fa7c8', D: '#6e7378' }}
      rows={
        variant === 'cyan'
          ? [
              'kkkkkkkkkkkkkkkkkk',
              'kWWWWWWWWWWWWWWWWk',
              'kWssssssssssssssWk',
              'kWsssssLssssssrsWk',
              'kWsssssLLsssrrrrWk',
              'kWLLLLLsLsLLssrsWk',
              'kWssssssLLsssLLsWk',
              'kWssssssLssssssLWk',
              'kWssssssssssssssWk',
              'kWWWWWWWWWWWWWWWWk',
              'kGcGcGcGGGGGGrGrGk',
              'kkkkkkkkkkkkkkkkkk',
            ]
          : [
              '.kkkkkkkkkkkkkkk.',
              'kDDDDDDDDDDDDDDDDk',
              'kDsssssssssssssDk',
              'kDsssssssLsssssDk',
              'kDsssssssLLssssDk',
              'kDLLLLLLsLsLLLLDk',
              'kDssssssLLsssssDk',
              'kDsssssssLsssssDk',
              'kDsssssssssssssDk',
              'kDDDDDDDDDDDDDDDk',
              '.kkkkkkkkkkkkkkk.',
              '......kDDDk......',
              '....kkkkkkkkk....',
            ]
      }
    />
  );
};

export const Floppy = () => (
  <Grid
    pal={{ k: K, P: '#5b5fc7', p: '#7a7ee0', M: '#c9ccd0', m: '#8b8f94', W: '#f2f2f2', L: '#9aa0a6' }}
    rows={[
      'kkkkkkkkkkkk.',
      'kPPMMMMMmPPPk',
      'kPPMMMMMmPPPk',
      'kPPMMMMMmPPPk',
      'kPPPPPPPPPPPk',
      'kPWWWWWWWWWPk',
      'kPWLLLLLLLWPk',
      'kPWWWWWWWWWPk',
      'kPWLLLLLLLWPk',
      'kPWWWWWWWWWPk',
      'kkkkkkkkkkkkk',
    ]}
  />
);

export const Doc = () => (
  <Grid
    pal={{ k: K, W: '#eeeeee', L: '#9aa0a6', F: '#c9ccd0' }}
    rows={[
      'kkkkkkkk...',
      'kWWWWWWkk..',
      'kWWWWWWkFk.',
      'kWLLLLWkkkk',
      'kWWWWWWWWWk',
      'kWLLLLLLLWk',
      'kWWWWWWWWWk',
      'kWLLLLLLLWk',
      'kWWWWWWWWWk',
      'kWLLLLLLLWk',
      'kWWWWWWWWWk',
      'kkkkkkkkkkk',
    ]}
  />
);

export const Folder = ({ light = false }) => (
  <Grid
    pal={{ k: K, Y: light ? '#f4ea7c' : '#f5d834', y: light ? '#d9cc58' : '#d4b21c', H: light ? '#fbf6b8' : '#fde97a' }}
    rows={[
      '.kkkkk..........',
      'kHHHHHkkkkkkkk..',
      'kYYYYYYYYYYYYYk.',
      'kYkkkkkkkkkkkkkk',
      'kYkHHHHHHHHHHHHk',
      'kYkYYYYYYYYYYYYk',
      'kYYkYYYYYYYYYYYk',
      'kYYkYYYYYYYYYYYk',
      'kYYYkYYYYYYYYYYk',
      'kyyykyyyyyyyyyyk',
      '.kkkkkkkkkkkkkkk',
    ]}
  />
);

export const Warning = ({ variant = 'yellow' }) => {
  const edge = variant === 'red' ? '#e3262a' : K;
  return (
    <Grid
      title="Warning"
      pal={{ k: K, e: edge, Y: '#ffd51e', y: '#f0b400' }}
      rows={[
        '.......ee.......',
        '......eYYe......',
        '......eYYe......',
        '.....eYYYYe.....',
        '.....eYkkYe.....',
        '....eYYkkYYe....',
        '....eYYkkYYe....',
        '...eYYYkkYYYe...',
        '...eYYYkkYYYe...',
        '..eYYYYkkYYYYe..',
        '..eYYYYYYYYYYe..',
        '.eYYYYYkkYYYYYe.',
        '.eyyyyykkyyyyye.',
        'eeeeeeeeeeeeeeee',
      ]}
    />
  );
};

/* Person waving an alert flag (Emergency contact) */
export const Person = () => (
  <Grid
    title="Emergency contact"
    pal={{ k: K, H: '#6b3f22', S: '#f0c49b', s: '#d9a676', B: '#4a7aa8', b: '#365e86', R: '#e3262a', W: '#ffffff' }}
    rows={[
      '..........kkkk',
      '...kkkk...kRRk',
      '..kHHHHk..kRWk',
      '.kHHHHHHk.kRWk',
      '.kHSSSSHk.kRRk',
      '.kSkSSkSk..kk.',
      '.kSSSSSSk..Sk.',
      '..kSSssk..kSk.',
      '.kkBBBBkkkBk..',
      'kBBBBBBBBBk...',
      'kBBBBBBBk.....',
      'kBbBBBBbBk....',
      'kkkkkkkkkk....',
    ]}
  />
);

/* Generic pixel response vehicle (no real-service markings) */
export const Vehicle = () => (
  <Grid
    title="Response vehicle"
    pal={{ k: K, W: '#f4f4f4', w: '#d6d6d6', R: '#e3262a', r: '#b81c20', B: '#3d6fb8', G: '#9fb8c8', T: '#2a2a2a', t: '#7a7a7a', Y: '#ffd51e' }}
    rows={[
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
    ]}
  />
);

export const Pin = () => (
  <Grid
    title="Live location"
    pal={{ k: K, C: '#25b3c8', c: '#1a8597', H: '#7fe3f0' }}
    rows={[
      '..kkkkk..',
      '.kCHCCCk.',
      'kCHCkCCCk',
      'kCCkkkCCk',
      'kCCCkCCck',
      '.kCCCCck.',
      '..kCCck..',
      '...kck...',
      '....k....',
    ]}
  />
);

/* Hospital (radar screen) */
export const Hospital = () => (
  <Grid
    title="Hospital"
    pal={{ k: K, W: '#f2f2f2', R: '#e3262a', B: '#6fa8c8', D: '#7a8a96' }}
    rows={[
      '....kkkkk....',
      '....kWRWk....',
      '....kRRRk....',
      '....kWRWk....',
      'kkkkkkkkkkkkk',
      'kWWWWWWWWWWWk',
      'kWBBWBBWBBWWk',
      'kWWWWWWWWWWWk',
      'kWBBWWDDWBBWk',
      'kWWWWWDDWWWWk',
      'kkkkkkkkkkkkk',
    ]}
  />
);

/* Pixel check mark */
export const Check = ({ className = '' }) => (
  <Grid
    className={`ico-check ${className}`}
    title="OK"
    pal={{ k: K, G: '#4fd04f', g: '#2f9e35' }}
    rows={[
      '..........kk',
      '.........kGk',
      '........kGgk',
      'kk.....kGgk.',
      'kGk...kGgk..',
      'kGGk.kGgk...',
      '.kGGkGgk....',
      '..kGGgk.....',
      '...kGk......',
      '....k.......',
    ]}
  />
);

/* Pointer cursor decoration */
export const Cursor = ({ color = '#4fd04f' }) => (
  <Grid
    pal={{ k: K, C: color }}
    rows={[
      'k.......',
      'kk......',
      'kCk.....',
      'kCCk....',
      'kCCCk...',
      'kCCCCk..',
      'kCCCCCk.',
      'kCCCkkkk',
      'kCkCk...',
      'kk.kCk..',
      '....kk..',
    ]}
  />
);

/* Handheld radio (UI 9) */
export const Radio = () => (
  <Grid
    pal={{ k: K, B: '#5a7fa8', b: '#3d5f85', S: '#9fc3e0', D: '#2e3a48' }}
    rows={[
      '......k..',
      '......k..',
      '......k..',
      '.kkkkkkk.',
      'kBBBBBBBk',
      'kBkkkkkBk',
      'kBkSSSkBk',
      'kBkkkkkBk',
      'kBBBBBBBk',
      'kBDBDBDBk',
      'kBBBBBBBk',
      'kBDBDBDBk',
      'kbbbbbbbk',
      '.kkkkkkk.',
    ]}
  />
);

/* Rotating 8-dot loader */
export const Spinner = ({ className = '' }) => (
  <span className={`spinner ${className}`} aria-hidden="true">
    {Array.from({ length: 8 }, (_, i) => (
      <i key={i} style={{ '--i': i }} />
    ))}
  </span>
);
