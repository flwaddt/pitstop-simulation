import PixelButton from '../components/Button.jsx';
import { Brand, Headline, Micro } from '../components/Brand.jsx';
import Checkmark from '../components/Checkmark.jsx';
import { TickIcon } from '../components/PixelArt.jsx';

/** Safe branch, final state. Calm, relief. */
export default function SafeOutcome({ act }) {
  const rows = ['Rider status verified', 'Emergency response not required', 'System complete'];
  return (
    <div className="scr">
      <Brand tone="green" />
      <div className="calm">
        <span className="calm-ring r1" />
        <span className="calm-ring r2" />
        <Checkmark className="check-sm" />
      </div>
      <Headline tone="green" size="xl">Safe outcome</Headline>
      <ul className="status-list">
        {rows.map((r, i) => (
          <li key={r} style={{ animationDelay: `${0.25 + i * 0.25}s` }}>
            <TickIcon className="sl-ico" />
            <span>{r}</span>
          </li>
        ))}
      </ul>
      <div className="grow" />
      <Micro>Detect ✓ · Verify ✓ · Respond — not required</Micro>
      <PixelButton tone="ghost-green" onClick={() => act('RESTART')} autoFocus>
        Restart simulation
      </PixelButton>
    </div>
  );
}
