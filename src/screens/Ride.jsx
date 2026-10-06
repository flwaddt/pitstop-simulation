import { useEffect, useRef, useState } from 'react';
import { CONFIG } from '../data/assets.js';
import { playCue, unlockAudio } from '../lib/audio.js';
import { isTouch } from '../lib/device.js';
import TouchPad from '../components/TouchPad.jsx';

/**
 * RIDE — playable pixel street between Scene 1 and the crash.
 *
 * Top-down Vietnamese street, drawn on a 320×180 canvas and scaled up with
 * crisp pixels. The rider travels RIGHT → LEFT (as in Scene 2), in the upper
 * lane (right-hand traffic). Oncoming traffic uses the lower lane.
 *
 *   W A S D / arrow keys — move the scooter
 *   SPACE                — go to the crash scene
 * After CONFIG.rideEventSeconds a second rider comes the other way, drifting
 * into your lane; touching any vehicle also triggers the crash.
 */
const VW = 320;
const VH = 180;
const ROAD_T = 42; // road top
const ROAD_B = 138; // road bottom
const MID = 90; // centre line
const SCROLL = 52; // px/s the world moves past

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

export default function Ride({ act }) {
  const canvasRef = useRef(null);
  const [speed, setSpeed] = useState(30);
  const [warn, setWarn] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const cv = canvasRef.current;
    const g = cv.getContext('2d');
    g.imageSmoothingEnabled = false;
    const strip = buildStrip();
    const keys = new Set();
    const r = rng(42);

    const player = { x: 220, y: 64, w: 18 * P, h: 9 * P };
    let offset = 0;
    let t = 0;
    let spawnIn = 0.8;
    let eventAt = CONFIG.rideEventSeconds;
    let crashed = 0;
    let shownSpeed = 30;
    const traffic = [];

    const finish = (how) => {
      if (doneRef.current) return;
      doneRef.current = true;
      act('CRASH');
    };

    const spawn = () => {
      const kind = r();
      if (kind < 0.55) {
        // same direction, slower: comes from ahead (left) and we pass it
        traffic.push({ x: -30, y: ROAD_T + 14 + r() * 26, v: -(18 + r() * 18), dir: -1, type: 'moto', shirt: SHIRTS[Math.floor(r() * SHIRTS.length)], helmet: HELMETS[Math.floor(r() * HELMETS.length)] });
      } else if (kind < 0.85) {
        traffic.push({ x: -30, y: MID + 14 + r() * 26, v: 35 + r() * 20, dir: 1, type: 'moto', shirt: SHIRTS[Math.floor(r() * SHIRTS.length)], helmet: HELMETS[Math.floor(r() * HELMETS.length)] });
      } else {
        traffic.push({ x: -40, y: MID + 24, v: 30 + r() * 10, dir: 1, type: 'car', col: CARS[Math.floor(r() * CARS.length)] });
      }
    };

    const onKey = (down) => (e) => {
      const k = e.key.toLowerCase();
      const map = { arrowleft: 'l', a: 'l', arrowright: 'r', d: 'r', arrowup: 'u', w: 'u', arrowdown: 'd', s: 'd' };
      if (map[k]) {
        e.preventDefault();
        if (down) keys.add(map[k]);
        else keys.delete(map[k]);
      }
      if (down && (e.code === 'Space' || k === ' ') && !e.repeat) {
        e.preventDefault();
        unlockAudio();
        finish('space');
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

      if (!crashed) {
        // movement
        const sp = 70;
        if (keys.has('l')) player.x -= sp * dt;
        if (keys.has('r')) player.x += sp * dt;
        if (keys.has('u')) player.y -= sp * 0.8 * dt;
        if (keys.has('d')) player.y += sp * 0.8 * dt;
        player.x = Math.max(24, Math.min(VW - 24, player.x));
        player.y = Math.max(ROAD_T + 12, Math.min(ROAD_B - 12, player.y));
        const target = 30 + (keys.has('l') ? 12 : 0) - (keys.has('r') ? 10 : 0);
        shownSpeed += (target - shownSpeed) * Math.min(1, dt * 3);

        const scroll = SCROLL + (keys.has('l') ? 18 : 0) - (keys.has('r') ? 16 : 0);
        offset = (offset + scroll * dt) % strip.width;

        spawnIn -= dt;
        if (spawnIn <= 0) {
          spawn();
          spawnIn = 1.3 + r() * 1.6;
        }

        // the second rider: comes the other way and drifts into your lane
        if (t >= eventAt) {
          traffic.push({ x: -36, y: player.y, v: 48, dir: 1, type: 'moto', shirt: '#3d6fb8', helmet: '#d93a3a', second: true });
          eventAt = Infinity;
          setWarn(true);
          playCue('alarm');
        }

        for (const o of traffic) {
          o.x += (o.v + scroll) * dt;
          if (o.second) o.y += Math.sign(player.y - o.y) * Math.min(Math.abs(player.y - o.y), 26 * dt);
        }
        for (let i = traffic.length - 1; i >= 0; i--) {
          const o = traffic[i];
          if (o.x > VW + 70) {
            if (o.second) {
              // missed you — he comes back around
              eventAt = t + 2.5;
              setWarn(false);
            }
            traffic.splice(i, 1);
          }
        }
        // collisions
        for (const o of traffic) {
          const ow = (o.type === 'car' ? 28 : 18) * P;
          const oh = (o.type === 'car' ? 14 : 9) * P;
          if (Math.abs(o.x - player.x) < (ow + player.w) / 2 - 3 && Math.abs(o.y - player.y) < (oh + player.h) / 2 - 2) {
            crashed = t;
            playCue('impact');
            break;
          }
        }
      } else if (t - crashed > 0.6) {
        finish('hit');
      }

      // ── draw ──
      const ox = Math.floor(offset);
      g.drawImage(strip, ox - strip.width, 0);
      g.drawImage(strip, ox, 0);

      const all = [...traffic, { player: true, ...player }].sort((a, b) => a.y - b.y);
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
      if (crashed) {
        const k = 1 - Math.min(1, (t - crashed) / 0.6);
        g.fillStyle = `rgba(255,255,255,${0.7 * k})`;
        g.fillRect(0, 0, VW, VH);
      }

      setSpeed(Math.round(shownSpeed));
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

  return (
    <div className="ride">
      <div className="ride-frame">
        <canvas ref={canvasRef} width={VW} height={VH} className="ride-cv" aria-label="Ride the scooter" />
        <div className="ride-hud ride-tl">
          <span className="k">SPEED</span> {speed} KM/H
        </div>
        <div className="ride-hud ride-tr">
          <i className="ride-dot" /> PITSTOP ACTIVE
        </div>
        {warn && <div className="ride-warn">! RIDER AHEAD !</div>}
        {isTouch ? <TouchPad nextLabel="CONTINUE" /> : <div className="ride-keys" aria-hidden="true">
          <span className="kgrp">
            <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd>
          </span>
          /
          <span className="kgrp">
            <kbd>▲</kbd>
            <kbd>◀</kbd>
            <kbd>▼</kbd>
            <kbd>▶</kbd>
          </span>
          RIDE
          <span className="sep">·</span>
          <kbd className="wide">SPACE</kbd> CONTINUE
        </div>}
      </div>
    </div>
  );
}
