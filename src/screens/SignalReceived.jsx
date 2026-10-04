import PixelButton, { PixelPanel } from '../components/Button.jsx';
import { Brand, Headline, Tag } from '../components/Brand.jsx';
import { BluetoothIcon, HelmetPixel, PhonePixel, WavesIcon } from '../components/PixelArt.jsx';

/** Phone receives the crash signal from PITSTOP over Bluetooth (UI reference 1). */
export default function SignalReceived({ act }) {
  return (
    <div className="scr">
      <Brand />
      <Tag>Crash signal received</Tag>
      <Headline tone="red" band>Impact detected</Headline>
      <PixelPanel tone="blue" className="bt-panel">
        <div className="bt-visual">
          <HelmetPixel />
          <WavesIcon className="bt-waves" />
          <PhonePixel />
        </div>
        <div className="bt-label">
          <BluetoothIcon className="bt-ico" />
          <span>
            Bluetooth
            <br />
            connection
          </span>
        </div>
      </PixelPanel>
      <div className="grow" />
      <PixelButton tone="ghost" onClick={() => act('CONTINUE')} autoFocus>
        Continue
      </PixelButton>
    </div>
  );
}
