import { useEffect, useRef, useState } from 'react';
import RetroWindow, { RetroButton } from '../components/RetroWindow.jsx';
import CountdownRing from '../components/CountdownRing.jsx';
import { Cursor, Doc, Floppy } from '../components/Pixel.jsx';
import { StatusRows } from './SystemReady.jsx';
import { CONFIG } from '../data/assets.js';
import { playCue, playTick } from '../lib/audio.js';

/**
 * UI 3 — full-screen takeover after Scene 4.
 * Real countdown 10 → 0. I'M OK stops it at once.
 * NO RESPONSE (or reaching 0): ~0.2 s silence → low hit → BEEP—BEEP → UI 5.
 * Keyboard: ← / A choose I'M OK, → / D choose NO RESPONSE, SPACE / ENTER confirm.
 */
export default function AreYouOk({ act }) {
  const total = CONFIG.countdownSeconds;
  const [left, setLeft] = useState(total);
  const [zero, setZero] = useState(false);
  const [sel, setSel] = useState('ok');
  const selRef = useRef('ok');
  selRef.current = sel;
  const done = useRef(false);
  const timers = useRef([]);

  const goZero = () => {
    if (done.current) return;
    done.current = true;
    setLeft(0);
    setZero(true);
    playCue('zeroHit');
    timers.current.push(setTimeout(() => act('NO_RESPONSE'), 1250));
  };

  const ok = () => {
    if (done.current) return;
    done.current = true;
    playCue('click');
    act('OK');
  };

  useEffect(() => {
    playCue('activate');
    const start = performance.now();
    let last = total;
    const id = setInterval(() => {
      if (done.current) return clearInterval(id);
      const rem = Math.max(0, total - Math.floor((performance.now() - start) / 1000));
      if (rem === last) return;
      last = rem;
      if (rem === 0) {
        clearInterval(id);
        goZero();
      } else {
        setLeft(rem);
        playTick(rem, total);
      }
    }, 50);
    return () => {
      clearInterval(id);
      timers.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (done.current) return;
      const k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a' || k === 'arrowup' || k === 'w') {
        e.preventDefault();
        if (selRef.current !== 'ok') playCue('click');
        setSel('ok');
      } else if (k === 'arrowright' || k === 'd' || k === 'arrowdown' || k === 's') {
        e.preventDefault();
        if (selRef.current !== 'no') playCue('click');
        setSel('no');
      } else if ((e.code === 'Space' || k === ' ' || k === 'enter') && !e.repeat) {
        e.preventDefault();
        if (selRef.current === 'ok') ok();
        else goZero();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RetroWindow
      className={zero ? 'win-zero' : ''}
      band={{ tone: 'green', text: 'STATUS: ACTIVE' }}
      deco={{ cursor: <Cursor /> }}
      overlay={
        <div className={`modal ${zero ? 'is-zero' : ''}`} role="alertdialog" aria-labelledby="ayo-h">
          <div className="modal-head">CRASH DETECTED</div>
          <h2 className="modal-h" id="ayo-h">ARE YOU OK?</h2>
          <p className="modal-sub">PLEASE CONFIRM YOUR STATUS</p>
          <CountdownRing value={left} total={total} zero={zero} />
          <div className="modal-btns">
            <RetroButton tone="green" className={sel === 'ok' ? 'is-sel' : ''} onMouseEnter={() => setSel('ok')} onClick={ok} disabled={zero}>
              I’M OK ✓
            </RetroButton>
            <RetroButton tone="red" className={sel === 'no' ? 'is-sel' : ''} onMouseEnter={() => setSel('no')} onClick={goZero} disabled={zero}>
              NO RESPONSE
            </RetroButton>
          </div>
          <p className="modal-keys" aria-hidden="true">
            <kbd>◀</kbd>
            <kbd>▶</kbd> CHOOSE · <kbd>SPACE</kbd> CONFIRM
          </p>
        </div>
      }
    >
      <StatusRows dim />
      <div className="ayo-deco" aria-hidden="true">
        <span className="ayo-floppy f1"><Floppy /></span>
        <span className="ayo-floppy f2"><Floppy /></span>
        <span className="ayo-doc d1"><Doc /></span>
        <span className="ayo-doc d2"><Doc /></span>
      </div>
    </RetroWindow>
  );
}
