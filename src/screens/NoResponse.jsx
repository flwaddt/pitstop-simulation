import RetroWindow from '../components/RetroWindow.jsx';
import { Warning } from '../components/Pixel.jsx';

/** UI 5 — short transition right after 0 + BEEP—BEEP. No 115/GPS yet. */
export default function NoResponse() {
  return (
    <RetroWindow className="no-foot" band={{ tone: 'red', text: 'NO RESPONSE' }} deco={{ spinnerRight: true }}>
      <div className="col">
        <span className="warn-big">
          <Warning variant="red" />
          {Array.from({ length: 10 }, (_, i) => <i key={i} className="spark" style={{ '--a': `${i * 36}deg`, '--d': `${(i % 3) * 0.15}s` }} />)}
        </span>
        <p className="obox obox-red">EMERGENCY PROTOCOL ACTIVATED</p>
      </div>
    </RetroWindow>
  );
}
