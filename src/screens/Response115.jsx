import RetroWindow from '../components/RetroWindow.jsx';
import PixelMap from '../components/PixelMap.jsx';
import { Vehicle } from '../components/Pixel.jsx';

/** UI 10 — 115 responds and dispatches a response unit. */
export default function Response115({ state }) {
  const lines = [
    ['t-green', 'INCIDENT RECEIVED ✓'],
    ['t-green', 'LOCATION CONFIRMED ✓'],
    ['t-cream', 'RIDER INFORMATION RECEIVED ✓'],
  ];
  return (
    <RetroWindow className="no-foot" band={{ tone: 'red', text: '115 RESPONSE' }}>
      <div className="cards">
        <div className="card info">
          <span className="card-top r115-top"><Vehicle /></span>
          <div className="r115">
            {lines.map(([c, t], i) => (
              <span key={t} className={`${c} reveal`} style={{ animationDelay: `${0.3 + i * 0.35}s` }}>{t}</span>
            ))}
            <span className="t-cream k reveal" style={{ animationDelay: '1.4s' }}>RESPONSE UNIT</span>
            <span className="v-red big reveal blink-slow" style={{ animationDelay: '1.65s' }}>DISPATCHED</span>
          </div>
        </div>
        <div className="card card-map-only">
          <PixelMap mode="route" travel={(state.auto || 7) - 1} />
        </div>
      </div>
    </RetroWindow>
  );
}
