import RetroWindow, { RetroButton } from '../components/RetroWindow.jsx';
import { Check, Cursor, Helmet, Monitor, OldPhone } from '../components/Pixel.jsx';

/** UI 1 — opening state. Does not mean 115 or an ambulance is on standby. */
export function StatusRows({ dim = false }) {
  const rows = [
    { icon: <Helmet />, text: 'CRASH DETECTION ACTIVE' },
    { icon: <OldPhone />, text: 'PHONE CONNECTION READY' },
    { icon: <Monitor />, text: 'EMERGENCY MONITOR READY' },
  ];
  return (
    <ul className={`rows ${dim ? 'rows-dim' : ''}`}>
      {rows.map((r, i) => (
        <li className="row" key={r.text} style={{ '--d': `${0.15 + i * 0.22}s` }}>
          <span className="row-ico">{r.icon}</span>
          <span className="chk-box"><Check /></span>
          <span className="row-label">{r.text}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SystemReady({ act }) {
  return (
    <RetroWindow
      controls={false}
      band={{ tone: 'green', text: 'SYSTEM READY' }}
      deco={{ spinnerLeft: true, spinnerRight: true, cursor: <Cursor /> }}
      footer={
        <RetroButton onClick={() => act('START')} autoFocus>
          START SIMULATION
        </RetroButton>
      }
    >
      <StatusRows />
    </RetroWindow>
  );
}
