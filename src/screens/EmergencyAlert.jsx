import PixelButton, { PixelPanel } from '../components/Button.jsx';
import { Brand, Headline, Micro, Tag } from '../components/Brand.jsx';
import { WarningPixel } from '../components/PixelArt.jsx';

export default function EmergencyAlert({ act }) {
  return (
    <div className="scr">
      <Brand tone="red" />
      <div className="warn-wrap">
        <WarningPixel />
      </div>
      <div className="stack-tight">
        <Headline tone="red" size="xl">Emergency alert</Headline>
        <Tag tone="white">No response confirmed</Tag>
      </div>
      <PixelPanel tone="red" className="info-panel">
        Emergency response
        <br />
        activated
      </PixelPanel>
      <Micro className="center">Next steps run on the rider’s phone</Micro>
      <PixelButton tone="red" onClick={() => act('CONTINUE')} autoFocus>
        Continue
      </PixelButton>
    </div>
  );
}
