import PixelButton from '../components/Button.jsx';
import { BluetoothIcon, DetectorPixel, PhonePixel } from '../components/PixelArt.jsx';

/** Closing frame: who does what, and what was simulated. */
export default function EndScreen({ act }) {
  return (
    <section className="end">
      <p className="start-eyebrow">Simulation complete</p>
      <h1 className="end-mark">
        <span>Detect.</span> <span>Verify.</span> <span>Respond.</span>
      </h1>

      <div className="roles">
        <article className="role">
          <div className="role-ico">
            <DetectorPixel />
          </div>
          <h2>PITSTOP detector</h2>
          <p className="role-sub">On the helmet dock</p>
          <ul>
            <li>Detects the impact</li>
            <li>Sends the crash signal over Bluetooth</li>
            <li>No GPS or cellular hardware, so it stays small</li>
          </ul>
        </article>
        <div className="role-link" aria-hidden="true">
          <BluetoothIcon />
        </div>
        <article className="role">
          <div className="role-ico">
            <PhonePixel />
          </div>
          <h2>Rider’s phone</h2>
          <p className="role-sub">PITSTOP app</p>
          <ul>
            <li>Asks the rider “Are you OK?”</li>
            <li>Provides the GPS location</li>
            <li>Handles call and SMS to the emergency contact</li>
          </ul>
        </article>
        <article className="role role-sim">
          <div className="role-ico role-ico-sim">SIM</div>
          <h2>Simulated here</h2>
          <p className="role-sub">Intended workflow</p>
          <ul>
            <li>Emergency contact, call and SMS</li>
            <li>Response vehicle on the map</li>
            <li>No real call, SMS or dispatch took place</li>
          </ul>
        </article>
      </div>

      <div className="end-actions">
        <PixelButton tone="blue" size="lg" onClick={() => act('RESTART')} autoFocus>
          Restart simulation
        </PixelButton>
        <p className="start-meta">Try the other answer at “Are you OK?”</p>
      </div>
    </section>
  );
}
