import PixelButton from '../components/Button.jsx';
import { ASSETS } from '../data/assets.js';

export default function StartScreen({ act }) {
  return (
    <section className="start">
      <div className="start-bg" style={{ backgroundImage: `url(${ASSETS.image.startPoster})` }} aria-hidden="true" />
      <div className="start-shade" aria-hidden="true" />
      <div className="start-inner">
        <p className="start-eyebrow">Interactive product simulation</p>
        <h1 className="start-mark">PITSTOP</h1>
        <p className="start-q">What happens when a rider can’t ask for help?</p>
        <ol className="start-pillars" aria-label="How PITSTOP works">
          <li>Detect.</li>
          <li>Verify.</li>
          <li>Respond.</li>
        </ol>
        <p className="start-lede">Experience the safety system</p>
        <PixelButton tone="blue" size="lg" onClick={() => act('START')} autoFocus>
          Start simulation
        </PixelButton>
        <p className="start-meta">Sound on · about two minutes · you decide the rider’s outcome</p>
      </div>
    </section>
  );
}
