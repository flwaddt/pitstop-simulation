import RetroWindow, { RetroButton } from '../components/RetroWindow.jsx';
import { Check, Cursor } from '../components/Pixel.jsx';

/** UI 4 — safe branch. CONTINUE returns to Scene 1 (normal riding). */
export default function StatusVerified({ act }) {
  return (
    <RetroWindow
      band={{ tone: 'green', text: 'STATUS VERIFIED' }}
      deco={{ cursor: <Cursor color="#25b3c8" /> }}
      footer={<RetroButton onClick={() => act('CONTINUE')}>CONTINUE</RetroButton>}
    >
      <div className="col">
        <span className="tile pop"><Check /></span>
        <p className="t-green t-hero">RIDER CONFIRMED SAFE</p>
        <p className="obox obox-green">EMERGENCY RESPONSE NOT REQUIRED</p>
      </div>
    </RetroWindow>
  );
}
