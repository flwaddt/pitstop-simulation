import PixelButton, { PixelPanel } from '../components/Button.jsx';
import { Brand, Headline, Micro } from '../components/Brand.jsx';
import { AvatarPixel, GpsIcon, TickIcon } from '../components/PixelArt.jsx';

/** Fictional contact only. */
export default function EmergencyContact({ act }) {
  return (
    <div className="scr">
      <Brand tone="red" />
      <Headline tone="red" size="md">Emergency contact</Headline>
      <PixelPanel tone="blue" className="contact">
        <div className="contact-avatar">
          <AvatarPixel />
        </div>
        <p className="contact-name">Family contact</p>
        <p className="contact-num">+84 *** *** ***</p>
        <Micro className="center">Fictional contact for this simulation</Micro>
      </PixelPanel>
      <ul className="chips">
        <li className="chip chip-green">
          <GpsIcon className="chip-ico" />
          <span>Location ready</span>
          <TickIcon className="chip-ok" />
        </li>
        <li className="chip chip-blue">
          <span className="chip-pulse" />
          <span>Ready to notify</span>
        </li>
      </ul>
      <div className="grow" />
      <PixelButton tone="red" onClick={() => act('CALL_SMS')} autoFocus>
        Call / SMS
      </PixelButton>
    </div>
  );
}
