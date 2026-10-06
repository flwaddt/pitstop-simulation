import RetroWindow from '../components/RetroWindow.jsx';
import { Monitor, Person, Pin } from '../components/Pixel.jsx';

/** UI 6 — the phone alerts Emergency Contact and Monitor at the same time. */
export default function AlertSent({ act }) {
  const cards = [
    { key: 'CONTACT', icon: <Person />, title: 'EMERGENCY CONTACT' },
    { key: 'MONITOR', icon: <Monitor variant="red" />, title: 'MONITOR' },
  ];
  return (
    <RetroWindow className="no-foot" band={{ tone: 'red', text: 'EMERGENCY ALERT SENT' }} deco={{ spinnerRight: true }}>
      <div className="cards">
        {cards.map((c) => (
          <button type="button" className="card card-btn" key={c.key} onClick={() => act(c.key)} title={`Open ${c.title.toLowerCase()}`}>
            <span className="card-top">{c.icon}</span>
            <span className="card-title">{c.title}</span>
            <span className="card-ok reveal">ALERT SENT ✓</span>
            <span className="card-foot">LIVE LOCATION SHARED <Pin /></span>
          </button>
        ))}
      </div>
    </RetroWindow>
  );
}
