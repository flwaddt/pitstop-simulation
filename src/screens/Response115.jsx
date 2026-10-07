import RetroWindow from '../components/RetroWindow.jsx';
import PixelMap from '../components/PixelMap.jsx';
import { Vehicle } from '../components/Pixel.jsx';

/** UI 10 — the emergency service responds and dispatches a response unit. */
export default function Response115({ state }) {
  const lines = [
    ['t-green', 'INCIDENT RECEIVED ✓'],
  ];
  return (
    <RetroWindow className="no-foot" band={{ tone: 'red', text: 'EMERGENCY SERVICE RESPONSE' }}>
      <div className="cards">
        <div className="card info">
          <span className="card-top r115-top"><Vehicle /></span>
          <div className="r115 r115-v2">
            {lines.map(([c, t], i) => (
              <span key={t} className={`${c} reveal`} style={{ animationDelay: `${0.4 + i * 0.5}s` }}>{t}</span>
            ))}
            <span className="t-cream k reveal" style={{ animationDelay: '1s' }}>RESPONSE UNIT</span>
            <span className="v-red big reveal blink-slow" style={{ animationDelay: '1.3s' }}>DISPATCHED</span>
          </div>
        </div>
        <div className="card card-map-only">
          <PixelMap mode="route" travel={Math.max(1.5, (state.auto || 7) - 0.8)} />
        </div>
      </div>
    </RetroWindow>
  );
}
