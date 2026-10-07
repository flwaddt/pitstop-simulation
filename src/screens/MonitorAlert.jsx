import { Pin } from '../components/Pixel.jsx';
import RetroWindow, { RetroButton } from '../components/RetroWindow.jsx';
import PixelMap from '../components/PixelMap.jsx';

/** UI 8 — the Monitor gets contact info + live location and calls the emergency service. */
export default function MonitorAlert({ act, state }) {
  return (
    <RetroWindow
      band={{ tone: 'yellow', text: 'MONITOR ALERT' }}
      deco={{ spinnerRight: true }}
      footer={
        <RetroButton tone="danger" className="autopress" style={{ '--at': `${(state.auto || 5) - 0.5}s` }} onClick={() => act('CONTACT_115')}>
          EMERGENCY SERVICE
        </RetroButton>
      }
    >
      <div className="cards">
        <div className="card info info-mon-card">
          <span className="card-top" />
          <div className="info-body info-mon">
            <span className="k-lg">EMERGENCY CONTACT</span>
            <span className="v-cyan">INFORMATION AVAILABLE</span>
            <span className="k">LIVE LOCATION</span>
            <span className="v-green">AVAILABLE ✓</span>
          </div>
        </div>
        <div className="card">
          <PixelMap mode="monitor" />
          <span className="card-foot">LIVE LOCATION SHARED <Pin /></span>
        </div>
      </div>
    </RetroWindow>
  );
}
