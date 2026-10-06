import RetroWindow, { RetroButton } from '../components/RetroWindow.jsx';
import { Check, Detector, Helmet, SmartPhone } from '../components/Pixel.jsx';

/** UI 2 — crash detection + Bluetooth hand-off (off by default, see CONFIG.includeUI2). */
export default function CrashSignal({ act }) {
  return (
    <RetroWindow
      band={{ tone: 'red', text: 'CRASH SIGNAL RECEIVED' }}
      footer={<RetroButton onClick={() => act('CONTINUE')}>CONTINUE</RetroButton>}
    >
      <ul className="rows rows-signal">
        <li className="row row-2">
          <span className="row-ico"><Helmet /></span>
          <span className="t-red t-xl">IMPACT DETECTED <b className="blink">!</b><Check className="inline-check red" /></span>
        </li>
        <li className="row row-2">
          <span className="row-ico"><Detector /></span>
          <span className="t-red t-xl">CRASH SIGNAL RECEIVED</span>
        </li>
        <li className="row row-2">
          <span className="row-ico"><SmartPhone /></span>
          <span className="bt-line">
            <span className="bt-dots" aria-hidden="true">
              {Array.from({ length: 7 }, (_, i) => <i key={i} style={{ '--i': i }} />)}
            </span>
            <span className="bt-text">
              <span className="t-cyan t-lg">BLUETOOTH CONNECTION</span>
              <span className="t-green t-lg">CONNECTED <Check className="inline-check" /></span>
            </span>
          </span>
        </li>
      </ul>
    </RetroWindow>
  );
}
