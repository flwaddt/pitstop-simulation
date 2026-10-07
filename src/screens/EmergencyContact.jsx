import RetroWindow, { RetroButton } from '../components/RetroWindow.jsx';
import PixelMap from '../components/PixelMap.jsx';
import { Person, Pin } from '../components/Pixel.jsx';

/** UI 7 — Emergency Contact receives the alert + live location. No 115 here. */
export default function EmergencyContact({ act, state }) {
  return (
    <RetroWindow
      band={{ tone: 'hazard', text: 'EMERGENCY CONTACT' }}
      className="no-foot"
      deco={{ spinnerRight: true }}
    >
      <div className="cards">
        <div className="card info">
          <div className="info-head">
            <Person />
            <span className="t-green">CONTACT NOTIFIED ✓</span>
          </div>
          <div className="info-body">
            <span className="k">RIDER</span>
            <span className="v-name">STEVE</span>
            <span className="k">STATUS</span>
            <span className="v-red">CRASH DETECTED</span>
          </div>
        </div>
        <div className="card">
          <PixelMap mode="pin" />
          <span className="card-foot">LIVE LOCATION SHARED <Pin /></span>
        </div>
      </div>
    </RetroWindow>
  );
}
