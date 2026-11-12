import { useEffect, useRef, useState } from 'react';
import { playCue, unlockAudio } from '../lib/audio.js';
import { isTouch } from '../lib/device.js';
import TouchPad from '../components/TouchPad.jsx';
import { getBest, recordScore, pad5 } from '../lib/score.js';

/**
 * RIDE — playable pixel street between Scene 1 and the crash.
 *
 * Top-down Vietnamese street, drawn on a 320×180 canvas and scaled up with
 * crisp pixels. The rider travels RIGHT → LEFT (as in Scene 2), in the upper
 * lane (right-hand traffic). Oncoming traffic uses the lower lane.
 *
 * Endless runner in the spirit of the Chrome Dino game, in 3 levels:
 *   LV 1 EASY       — slow, sparse single vehicles and obstacles
 *   LV 2 MEDIUM     — faster, denser, "walls" with one gap, a reckless rider
 *   LV 3 HARD       — very fast; walls close the WHOLE road: you can't get through
 * The ride opens on a level select (◀ ▶ to choose, SPACE/ENTER to go). The
 * score counts up with distance; clearing LEVELS[i].len points moves up a level. Touching ANY vehicle or obstacle is GAME OVER → the crash scene.
 *
 *   W S / ▲ ▼  — dodge up / down      A / ◀ — throttle (+points)   D / ▶ — brake
 *   SPACE      — skip to the crash scene
 */
const VW = 320;
const VH = 180;
const ROAD_T = 42; // road top
const ROAD_B = 138; // road bottom
const MID = 90; // centre line
const SCROLL = 52; // px/s the world moves past at cruise speed
const CRUISE_KMH = 30; // SCROLL is calibrated at this speed
/** Rows (y centres) vehicles and obstacles use: two per lane. */
const ROWS = [56, 76, 104, 124];
/**
 * The three levels — the player picks where to start; the ride then keeps
 * escalating (EASY → MEDIUM → HARD). len = points to clear the level; kmh = [start, end]
 * speed across the level; spawn = seconds between spawns [min, max];
 * wall = chance a spawn is a wall across the road; gaps = free rows in a wall
 * (0 = no way through); rider = seconds until the reckless rider (null = none).
 */
const LEVELS = [
  { name: 'EASY', tag: 'CHILL RIDE', len: 150, kmh: [35, 55], spawn: [1.5, 2.4], wall: 0, gaps: 2, rider: null },
  { name: 'MEDIUM', tag: 'RUSH HOUR', len: 230, kmh: [65, 95], spawn: [0.8, 1.3], wall: 0.3, gaps: 1, rider: 4 },
  { name: 'HARD', tag: 'IMPOSSIBLE?', len: Infinity, kmh: [115, 150], spawn: [0.45, 0.7], wall: 0.55, gaps: 0, rider: 1.5 },
];

/* ── seeded random so the street looks the same every time ── */
function rng(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const ROOFS = ['#a8553f', '#c06a4c', '#9aa0a6', '#d8d2c4', '#7f8a86', '#b8b2a5', '#8c5a44'];
const AWN = ['#2f8f9c', '#d94f3a', '#e0b23a', '#3f7fbf', '#6aa84f'];
const SHIRTS = ['#3d6fb8', '#d9a03a', '#b84a4a', '#7a7f87', '#e6e2d8', '#6b4fa8', '#2f8f6a'];
const HELMETS = ['#d93a3a', '#f2f2f2', '#2f6fd6', '#f0c330', '#333333'];
const CARS = ['#e6e6e6', '#b8202a', '#2f5fa8', '#3a3a3a', '#d8d0bf'];

/* Pre-render one strip of street scenery (wider than the screen, wraps). */
function buildStrip() {
  const W = 960;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = VH;
  const g = c.getContext('2d');
  const r = rng(7);
  const R = (x, y, w, h, col) => {
    g.fillStyle = col;
    g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  };
  // ground
  R(0, 0, W, VH, '#3b3f45');
  // houses: top row (roofs seen from above) and bottom row
  for (const [y0, h0, flip] of [
    [0, 30, false],
    [150, 30, true],
  ]) {
    let x = 0;
    while (x < W) {
      const w = 26 + Math.floor(r() * 28);
      const roof = ROOFS[Math.floor(r() * ROOFS.length)];
      R(x, y0, w - 1, h0, roof);
      // ridge / tiles
      for (let ty = y0 + 3; ty < y0 + h0 - 2; ty += 4) R(x + 1, ty, w - 3, 1, 'rgba(0,0,0,.12)');
      R(x + Math.floor(w / 2) - 1, y0, 2, h0, 'rgba(255,255,255,.12)');
      // shop awning toward the street
      if (r() > 0.45) {
        const aw = AWN[Math.floor(r() * AWN.length)];
        const ay = flip ? y0 - 4 : y0 + h0;
        for (let i = 0; i < w - 3; i += 4) R(x + 1 + i, ay, 2, 4, aw), R(x + 3 + i, ay, 2, 4, '#f2efe6');
      }
      R(x + w - 1, y0, 1, h0, '#1d1f23');
      x += w;
    }
  }
  // sidewalks
  R(0, 30, W, ROAD_T - 30, '#a9a59b');
  R(0, ROAD_B, W, 150 - ROAD_B, '#a9a59b');
  for (let x = 0; x < W; x += 8) {
    R(x, 30, 1, ROAD_T - 30, 'rgba(0,0,0,.12)');
    R(x, ROAD_B, 1, 150 - ROAD_B, 'rgba(0,0,0,.12)');
  }
  R(0, ROAD_T - 2, W, 2, '#d9d5cc');
  R(0, ROAD_B, W, 2, '#d9d5cc');
  // asphalt with speckle
  R(0, ROAD_T, W, ROAD_B - ROAD_T, '#3a3d42');
  for (let i = 0; i < 900; i++) R(r() * W, ROAD_T + r() * (ROAD_B - ROAD_T), 1, 1, r() > 0.5 ? '#43474d' : '#33363b');
  // lane markings
  for (let x = 0; x < W; x += 24) R(x, MID - 1, 12, 2, '#e9e6dc');
  R(0, ROAD_T + 3, W, 1, 'rgba(233,230,220,.5)');
  R(0, ROAD_B - 4, W, 1, 'rgba(233,230,220,.5)');
  // crosswalk
  for (let y = ROAD_T + 4; y < ROAD_B - 4; y += 6) R(600, y, 14, 3, '#e9e6dc');
  // trees + utility poles on the sidewalks
  for (let x = 20; x < W; x += 70 + Math.floor(r() * 50)) {
    const top = r() > 0.5;
    const y = top ? 26 : 140;
    R(x - 7, y - 7, 15, 15, '#2f6b3a');
    R(x - 5, y - 9, 11, 4, '#3f8a4a');
    R(x - 4, y - 4, 6, 5, '#4f9e57');
    R(x - 2, y + 7, 5, 2, 'rgba(0,0,0,.25)');
  }
  for (let x = 50; x < W; x += 120) {
    R(x, 33, 3, 3, '#5a5f66');
    R(x + 40, 141, 3, 3, '#5a5f66');
  }
  return c;
}

/* ── sprites (top-down). dir -1 = facing left, +1 = facing right.
   Each sprite "pixel" is P×P screen pixels so riders read clearly. ── */
const P = 2;
function drawScooter(g, x, y, dir, shirt, helmet, opts = {}) {
  const R = (dx, dy, w, h, col) => {
    g.fillStyle = col;
    const px = dir < 0 ? x + dx * P : x - (dx + w) * P;
    g.fillRect(Math.round(px), Math.round(y + dy * P), w * P, h * P);
  };
  R(-9, 2, 19, 3, 'rgba(0,0,0,.28)'); // shadow
  R(-10, -2, 3, 4, '#0c0c0c'); // front wheel
  R(7, -2, 3, 4, '#0c0c0c'); // rear wheel
  R(-8, -3, 17, 6, '#1c1d20'); // body
  R(-3, -2, 7, 4, '#2c2e33'); // floorboard
  R(-7, -5, 2, 10, '#6b7078'); // handlebar
  R(-8, -5, 1, 1, '#ffd34a'); // mirrors
  R(-8, 4, 1, 1, '#ffd34a');
  R(7, -1, 2, 2, '#e3262a'); // tail light
  R(-1, -4, 6, 8, shirt); // shoulders / torso
  R(-4, -1, 3, 1, opts.skin || '#e0b48a'); // arm
  R(-4, 1, 3, 1, opts.skin || '#e0b48a');
  R(-2, -2, 5, 5, helmet); // helmet
  R(-2, -2, 2, 1, 'rgba(255,255,255,.35)');
  if (opts.pitstop) R(3, 0, 1, 1, opts.blink ? '#ff3b30' : '#7a1a16'); // PITSTOP on the helmet
}

function drawCar(g, x, y, dir, col) {
  const R = (dx, dy, w, h, c) => {
    g.fillStyle = c;
    const px = dir < 0 ? x + dx * P : x - (dx + w) * P;
    g.fillRect(Math.round(px), Math.round(y + dy * P), w * P, h * P);
  };
  R(-13, 4, 27, 3, 'rgba(0,0,0,.28)');
  R(-14, -7, 28, 14, '#111');
  R(-13, -6, 26, 12, col);
  R(-8, -5, 4, 10, '#26313d'); // windscreen
  R(6, -5, 3, 10, '#26313d');
  R(-3, -5, 8, 10, 'rgba(255,255,255,.12)'); // roof
  R(-14, -6, 1, 3, '#fff4c2');
  R(-14, 3, 1, 3, '#fff4c2');
}

/* Road obstacles (static, scroll with the street). */
function drawObstacle(g, o) {
  const x = Math.round(o.x);
  const y = Math.round(o.y);
  const R = (dx, dy, w, h, c) => {
    g.fillStyle = c;
    g.fillRect(x + dx * P, y + dy * P, w * P, h * P);
  };
  if (o.type === 'cone') {
    R(-3, -2, 7, 5, 'rgba(0,0,0,.25)');
    R(-3, -3, 6, 6, '#111');
    R(-2, -2, 4, 4, '#ff7a1a');
    R(-1, -1, 2, 2, '#f4f4f4');
  } else if (o.type === 'hole') {
    R(-6, -3, 12, 6, '#1d1f23');
    R(-5, -2, 10, 4, '#26292e');
    R(-4, -1, 3, 1, '#4a4e55');
    R(-6, 2, 12, 1, '#55595f');
  } else {
    // barrier: red/white striped block
    R(-2, -7, 5, 15, 'rgba(0,0,0,.25)');
    R(-2, -7, 4, 14, '#111');
    for (let i = 0; i < 6; i++) R(-1, -6 + i * 2, 2, 2, i % 2 ? '#f4f4f4' : '#e3262a');
  }
}
const OB = { cone: [6, 6], hole: [12, 6], barrier: [4, 14] };

export default function Ride({ act }) {
  const canvasRef = useRef(null);
  const [hud, setHud] = useState({ speed: LEVELS[0].kmh[0], score: 0, blink: false, lv: 0 });
  const [warn, setWarn] = useState(false);
  const [banner, setBanner] = useState(0); // level number being announced (1-based), 0 = none
  const [over, setOver] = useState(null);
  const [select, setSelect] = useState(0); // highlighted level on the select screen; null once riding
  const beginRef = useRef(null);
  const doneRef = useRef(false);
  const best = useRef(getBest());

  useEffect(() => {
    const cv = canvasRef.current;
    const g = cv.getContext('2d');
    g.imageSmoothingEnabled = false;
    const strip = buildStrip();
    const keys = new Set();
    // A new random street every run, so each try plays differently.
    const r = rng((Date.now() % 100000) + 1);
    const pick = (arr) => arr[Math.floor(r() * arr.length)];

    const player = { x: 220, y: 66, w: 18 * P, h: 9 * P };
    let offset = 0;
    let t = 0;
    let lv = 0;
    let started = false;
    let sel = 0;
    let lvScore = 0; // score when the current level began
    let spawnIn = 1.2;
    let riderAt = Infinity;
    let crashed = 0;
    let kmh = LEVELS[0].kmh[0];
    let score = 0;
    let nextMilestone = 100;
    let blinkUntil = 0;
    let lastHud = 0;
    const traffic = [];

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      act('CRASH');
    };

    const announce = (n) => {
      setBanner(n);
      setTimeout(() => setBanner((b) => (b === n ? 0 : b)), 1800);
    };
    const startLevel = (n) => {
      lv = n;
      lvScore = score;
      const L = LEVELS[n];
      riderAt = L.rider == null ? Infinity : t + L.rider;
      spawnIn = n === 2 ? 0.9 : 1.1; // a short breather while the banner shows
      announce(n + 1);
      playCue('level');
    };

    const begin = (n) => {
      if (started) return;
      started = true;
      keys.clear();
      kmh = LEVELS[n].kmh[0];
      setSelect(null);
      startLevel(n);
    };
    beginRef.current = (n) => {
      unlockAudio();
      begin(n);
    };

    // Is the spawn point free around row y?
    const clear = (y, gap = 46) => !traffic.some((o) => o.x < -30 + gap && Math.abs(o.y - y) < 16);

    const moto = (y, v, dir) => ({ x: -30, y, v, dir, type: 'moto', w: 18 * P, h: 9 * P, shirt: pick(SHIRTS), helmet: pick(HELMETS) });
    const obstacle = (y, type) => ({ x: -20, y, v: 0, type, w: OB[type][0] * P, h: OB[type][1] * P, ob: true });

    const spawn = () => {
      const L = LEVELS[lv];
      if (r() < L.wall) {
        // A wall across the road. Its parts all move at road speed, so it
        // stays a straight line. gaps = how many rows are left open.
        const open = new Set();
        while (open.size < L.gaps) open.add(Math.floor(r() * ROWS.length));
        ROWS.forEach((y, i) => {
          if (open.has(i)) return;
          // the last level fills the space between rows too: nothing gets through
          const type = L.gaps === 0 ? 'barrier' : pick(['cone', 'hole']);
          traffic.push(obstacle(y, type));
          if (L.gaps === 0) traffic.push(obstacle(y + 10, 'barrier'), obstacle(y - 10, 'barrier'));
        });
        return L.gaps === 0 ? 0.3 : 0.7;
      }
      const k = r();
      if (k < 0.35) {
        const y = pick(ROWS.slice(0, 2)) + (r() - 0.5) * 8;
        if (clear(y)) traffic.push(moto(y, -(16 + r() * 20), -1)); // slower rider in your lane
      } else if (k < 0.6) {
        const y = pick(ROWS.slice(2)) + (r() - 0.5) * 8;
        if (clear(y)) traffic.push(moto(y, 35 + r() * 25, 1)); // oncoming rider
      } else if (k < 0.75) {
        if (clear(114, 70)) traffic.push({ x: -40, y: 114, v: 30 + r() * 15, dir: 1, type: 'car', w: 28 * P, h: 14 * P, col: pick(CARS) });
      } else {
        const y = pick(ROWS);
        if (clear(y)) traffic.push(obstacle(y, pick(['cone', 'cone', 'hole', 'barrier'])));
      }
      return 0;
    };

    const onKey = (down) => (e) => {
      const k = e.key.toLowerCase();
      if (!started) {
        // level select: ◀ ▶ (or ▲ ▼) move, SPACE / ENTER start
        if (!down) return;
        const move = { arrowleft: -1, a: -1, arrowup: -1, w: -1, arrowright: 1, d: 1, arrowdown: 1, s: 1 }[k];
        if (move) {
          e.preventDefault();
          sel = (sel + move + LEVELS.length) % LEVELS.length;
          setSelect(sel);
          playCue('click');
        } else if ((e.code === 'Space' || k === ' ' || k === 'enter') && !e.repeat) {
          e.preventDefault();
          unlockAudio();
          begin(sel);
        }
        return;
      }
      const map = { arrowleft: 'l', a: 'l', arrowright: 'r', d: 'r', arrowup: 'u', w: 'u', arrowdown: 'd', s: 'd' };
      if (map[k]) {
        e.preventDefault();
        if (down) keys.add(map[k]);
        else keys.delete(map[k]);
      }
      if (down && (e.code === 'Space' || k === ' ') && !e.repeat) {
        e.preventDefault();
        unlockAudio();
        finish();
      }
    };
    const kd = onKey(true);
    const ku = onKey(false);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);

    let last = performance.now();
    let raf;
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;

      if (!started) {
        offset = (offset + SCROLL * 0.6 * dt) % strip.width; // idle street behind the menu
      } else if (!crashed) {
        const L = LEVELS[lv];
        // ── level progress ──
        if (score - lvScore >= L.len && lv < LEVELS.length - 1) startLevel(lv + 1);

        // ── speed: ramps across the level; throttle/brake on top ──
        const span = Number.isFinite(L.len) ? L.len : 300;
        const p = Math.min(1, (score - lvScore) / span);
        const base = L.kmh[0] + (L.kmh[1] - L.kmh[0]) * p;
        const target = keys.has('l') ? base + 20 : keys.has('r') ? Math.max(20, base - 20) : base;
        kmh += (target - kmh) * Math.min(1, dt * 2.5);
        const scroll = SCROLL * (kmh / CRUISE_KMH);
        offset = (offset + scroll * dt) % strip.width;

        // ── movement (sideways gets quicker as the road gets faster) ──
        const side = 70 + Math.max(0, kmh - 35) * 0.3;
        if (keys.has('u')) player.y -= side * dt;
        if (keys.has('d')) player.y += side * dt;
        if (keys.has('l')) player.x -= 40 * dt;
        else if (keys.has('r')) player.x += 40 * dt;
        else player.x += (220 - player.x) * Math.min(1, dt * 0.8);
        player.x = Math.max(150, Math.min(VW - 24, player.x));
        player.y = Math.max(ROAD_T + 12, Math.min(ROAD_B - 12, player.y));

        // ── score: distance, Dino-style blip every 100 ──
        score += kmh * dt * 0.25;
        if (score >= nextMilestone) {
          nextMilestone += 100;
          blinkUntil = t + 0.9;
          playCue('point');
        }

        // ── spawning ──
        spawnIn -= dt;
        if (spawnIn <= 0) {
          const extra = spawn();
          spawnIn = L.spawn[0] + r() * (L.spawn[1] - L.spawn[0]) + extra;
        }

        // ── the reckless rider (medium + last level) ──
        if (t >= riderAt) {
          traffic.push({ ...moto(player.y, 26, 1), shirt: '#3d6fb8', helmet: '#d93a3a', second: true, lock: lv === 2 });
          riderAt = Infinity;
          setWarn('ahead');
          playCue('alarm');
        }

        for (const o of traffic) {
          if (!o.second) {
            o.x += (o.v + scroll) * dt;
            continue;
          }
          o.x += (o.v + scroll * 0.55) * dt;
          const dx = player.x - o.x;
          // medium: commits early, a quick swerve dodges him.
          // last level: locks on right up to impact.
          if (o.lock ? dx > 4 : dx > 60) o.y += Math.sign(player.y - o.y) * Math.min(Math.abs(player.y - o.y), (o.lock ? 140 : 45) * dt);
        }
        for (let i = traffic.length - 1; i >= 0; i--) {
          const o = traffic[i];
          if (o.x > VW + 70) {
            if (o.second) {
              score += 50;
              riderAt = t + 5 + r() * 3;
              setWarn('miss');
              playCue('safe');
              setTimeout(() => setWarn((w) => (w === 'miss' ? false : w)), 1400);
            }
            traffic.splice(i, 1);
          }
        }

        // ── collisions: anything = GAME OVER ──
        for (const o of traffic) {
          if (Math.abs(o.x - player.x) < (o.w + player.w) / 2 - 3 && Math.abs(o.y - player.y) < (o.h + player.h) / 2 - 2) {
            crashed = t;
            playCue('impact');
            const final = Math.floor(score);
            const isBest = recordScore(final);
            setWarn(false);
            setBanner(0);
            setOver({ score: final, best: Math.max(final, best.current), isBest, lv });
            break;
          }
        }
      } else if (t - crashed > 1.3) {
        finish();
      }

      // ── draw ──
      const ox = Math.floor(offset);
      g.drawImage(strip, ox - strip.width, 0);
      g.drawImage(strip, ox, 0);

      for (const o of traffic) if (o.ob) drawObstacle(g, o); // obstacles lie on the road
      const all = [...traffic.filter((o) => !o.ob), { player: true, ...player }].sort((a, b) => a.y - b.y);
      for (const o of all) {
        if (o.player) drawScooter(g, o.x, o.y, -1, '#2f7a45', '#121212', { pitstop: true, blink: Math.floor(t * 3) % 2 === 0 });
        else if (o.type === 'car') drawCar(g, o.x, o.y, o.dir, o.col);
        else drawScooter(g, o.x, o.y, o.dir, o.shirt, o.helmet);
        if (o.second && !crashed && Math.floor(t * 4) % 2 === 0) {
          g.fillStyle = '#ffd51e';
          g.fillRect(Math.round(o.x) - 2, Math.round(o.y) - 30, 4, 10);
          g.fillRect(Math.round(o.x) - 2, Math.round(o.y) - 18, 4, 4);
        }
      }
      // speed lines at high speed
      if (!crashed && kmh > 80) {
        g.fillStyle = `rgba(255,255,255,${Math.min(0.35, (kmh - 80) / 150)})`;
        for (let i = 0; i < 6; i++) {
          const ly = ROAD_T + ((i * 37 + Math.floor(t * 50) * 13) % (ROAD_B - ROAD_T));
          const lx = (i * 71 + offset * 3) % VW;
          g.fillRect(Math.round(lx), ly, 18, 1);
        }
      }
      // red danger tint on the last level
      if (!crashed && lv === 2) {
        g.fillStyle = `rgba(227,38,42,${0.06 + 0.05 * Math.sin(t * 8)})`;
        g.fillRect(0, 0, VW, VH);
      }
      if (crashed) {
        const k = 1 - Math.min(1, (t - crashed) / 0.25);
        g.fillStyle = `rgba(255,255,255,${0.7 * k})`;
        g.fillRect(0, 0, VW, VH);
      }

      if (now - lastHud > 80 || crashed) {
        lastHud = now;
        setHud({ speed: Math.round(kmh), score: Math.floor(score), blink: t < blinkUntil && Math.floor(t * 8) % 2 === 0, lv });
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hi = Math.max(best.current, over?.best ?? 0);
  return (
    <div className="ride">
      <div className="ride-frame" data-level={hud.lv + 1}>
        <canvas ref={canvasRef} width={VW} height={VH} className="ride-cv" aria-label="Ride the scooter" />
        <div className="ride-hud ride-tl" style={select != null ? { visibility: 'hidden' } : undefined}>
          <span className={`ride-lv ride-lv-${hud.lv + 1}`}>LV {hud.lv + 1}</span> {hud.speed} KM/H
        </div>
        <div className={`ride-hud ride-tr ride-score ${hud.blink ? 'is-blink' : ''}`}>
          <span className="k">HI {pad5(hi)}</span> {pad5(hud.score)}
        </div>
        {select != null && (
          <div className="ride-select" role="dialog" aria-label="Choose a level">
            <p className="ride-select-t">CHOOSE YOUR LEVEL</p>
            <div className="ride-select-row">
              {LEVELS.map((L, i) => (
                <button
                  key={L.name}
                  type="button"
                  className={`ride-pick ride-pick-${i + 1} ${select === i ? 'is-on' : ''}`}
                  onClick={() => beginRef.current?.(i)}
                >
                  <span className="ride-pick-n">LV {i + 1}</span>
                  <span className="ride-pick-name">{L.name}</span>
                  <span className="ride-pick-tag">{L.tag}</span>
                  <span className="ride-pick-kmh">{L.kmh[0]}–{L.kmh[1]} KM/H</span>
                </button>
              ))}
            </div>
            <p className="ride-select-k">
              <kbd>◀</kbd> <kbd>▶</kbd> CHOOSE · <kbd className="wide">SPACE</kbd> START
            </p>
          </div>
        )}
        {banner > 0 && !over && (
          <div className={`ride-level ride-level-${banner}`} role="status">
            <p className="ride-level-n">LEVEL {banner}</p>
            <p className="ride-level-name">{LEVELS[banner - 1].name}</p>
          </div>
        )}
        {warn === 'ahead' && !banner && <div className="ride-warn">! RIDER AHEAD — DODGE !</div>}
        {warn === 'miss' && !banner && <div className="ride-warn ride-miss">DODGED! +50</div>}
        {over && (
          <div className="ride-over" role="status">
            <p className="ride-over-t">GAME OVER</p>
            <p className="ride-over-s">
              LV {over.lv + 1} · SCORE {pad5(over.score)} <span className="k">HI {pad5(over.best)}</span>
            </p>
            {over.isBest && over.score > 0 && <p className="ride-over-new">NEW HIGH SCORE!</p>}
          </div>
        )}
        {isTouch ? <TouchPad nextLabel={select != null ? 'START' : 'SKIP'} /> : select == null && <div className="ride-keys" aria-hidden="true">
          <span className="kgrp">
            <kbd>W</kbd>
            <kbd>S</kbd>
          </span>
          /
          <span className="kgrp">
            <kbd>▲</kbd>
            <kbd>▼</kbd>
          </span>
          DODGE
          <span className="sep">·</span>
          <span className="kgrp">
            <kbd>A</kbd>
            <kbd>D</kbd>
          </span>
          SPEED
          <span className="sep">·</span>
          <kbd className="wide">SPACE</kbd> SKIP
        </div>}
      </div>
    </div>
  );
}
