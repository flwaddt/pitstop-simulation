import RetroWindow, { RetroButton } from '../components/RetroWindow.jsx';
import PixelMap from '../components/PixelMap.jsx';

/** UI 8 — the Monitor sees everything and is the party that calls 115. */
export default function MonitorAlert({ act, state }) {
  return (
    <RetroWindow
      band={{ tone: 'red', text: 'MONITOR ALERT' }}
      deco={{ spinnerRight: true }}
      footer={
        <RetroButton outline="red" className="autopress" style={{ '--at': `${(state.auto || 5) - 0.5}s` }} onClick={() => act('CONTACT_115')}>
          CONTACT 115
        </RetroButton>
      }
    >
      <div className="cards">
        <div className="card info info-dense">
          <div className="info-body">
            <span className="k">RIDER</span>
            <span className="v-name">STEVE</span>
            <span className="k">STATUS</span>
            <span className="v-red">CRASH DETECTED</span>
            <span className="k">EMERGENCY CONTACT</span>
            <span className="v-cyan">INFORMATION AVAILABLE</span>
            <span className="k">LIVE LOCATION</span>
            <span className="v-green">AVAILABLE ✓</span>
          </div>
        </div>
        <div className="card card-map-only">
          <PixelMap mode="monitor" />
        </div>
      </div>
    </RetroWindow>
  );
}
