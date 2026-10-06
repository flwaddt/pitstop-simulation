import { useEffect, useRef, useState } from 'react';
import RetroWindow, { RetroButton } from '../components/RetroWindow.jsx';
import { Check, Cursor, Helmet, Monitor, OldPhone } from '../components/Pixel.jsx';
import { playCue } from '../lib/audio.js';

/** UI 1 — opening state. Does not mean 115 or an ambulance is on standby. */
const ROWS = [
  { icon: <Helmet />, text: 'CRASH DETECTION ACTIVE' },
  { icon: <OldPhone />, text: 'PHONE CONNECTION READY' },
  { icon: <Monitor />, text: 'EMERGENCY MONITOR READY' },
];

/** `checked` = how many rows show their tick (UI 3 shows all, dimmed). */
export function StatusRows({ dim = false, checked = ROWS.length }) {
  return (
    <ul className={`rows ${dim ? 'rows-dim' : ''}`}>
      {ROWS.map((r, i) => (
        <li className="row" key={r.text} style={{ '--d': `${0.1 + i * 0.12}s` }}>
          <span className="row-ico">{r.icon}</span>
          <span className={`chk-box ${i < checked ? '' : 'is-wait'}`}>{i < checked ? <Check className="pop" /> : <i className="chk-wait" />}</span>
          <span className="row-label">{r.text}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * After the title screen, UI 1 runs a short system check — each row ticks
 * in — then waits. The player decides when to press START SIMULATION
 * (click, SPACE or tap); nothing starts by itself.
 */
const STEP = 250;

export default function SystemReady({ act }) {
  const [checked, setChecked] = useState(0);
    const timers = useRef([]);

  useEffect(() => {
    const t = timers.current;
    ROWS.forEach((_, i) =>
      t.push(
        setTimeout(() => {
          setChecked(i + 1);
          playCue('click');
        }, 200 + i * STEP),
      ),
    );
    const ready = 200 + ROWS.length * STEP;
    t.push(setTimeout(() => playCue('safe'), ready));
    return () => t.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ready = checked >= ROWS.length;
  return (
    <RetroWindow
      controls={false}
      band={ready ? { tone: 'green', text: 'SYSTEM READY' } : { tone: 'yellow', text: 'SYSTEM CHECK...' }}
      deco={{ spinnerLeft: true, spinnerRight: true, cursor: <Cursor /> }}
      footer={
        <RetroButton data-primary className={ready ? 'is-waiting' : ''} onClick={() => act('START')}>
          START SIMULATION
        </RetroButton>
      }
    >
      <StatusRows checked={checked} />
    </RetroWindow>
  );
}
