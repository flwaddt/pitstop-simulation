import RetroWindow, { RetroButton } from '../components/RetroWindow.jsx';
import { Check } from '../components/Pixel.jsx';

/** UI 11 — serious ending, no celebration. REPLAY returns to UI 1. */
export default function ResponseComplete({ act }) {
  return (
    <RetroWindow
      band={{ tone: 'green', text: 'SIMULATION COMPLETE' }}
      deco={{ spinnerRight: true }}
      footer={<RetroButton onClick={() => act('REPLAY')}>REPLAY</RetroButton>}
    >
      <div className="col">
        <span className="tile tile-glow pop"><Check /></span>
        <p className="t-cream t-hero">ASSISTANCE PROVIDED</p>
      </div>
    </RetroWindow>
  );
}
