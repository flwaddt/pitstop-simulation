import PixelButton, { PixelPanel } from '../components/Button.jsx';
import { Brand, Headline, Tag } from '../components/Brand.jsx';
import Checkmark from '../components/Checkmark.jsx';

/** Safe branch, step 1 (UI reference 2). */
export default function StatusVerified({ act }) {
  return (
    <div className="scr">
      <Brand tone="green" />
      <Tag tone="green">Crash signal received</Tag>
      <div className="check-wrap">
        <Checkmark />
      </div>
      <div className="stack-tight">
        <Headline tone="green">Status verified</Headline>
        <Tag tone="white">Rider confirmed safe</Tag>
      </div>
      <PixelPanel tone="blue" className="info-panel">
        Emergency response
        <br />
        not required
      </PixelPanel>
      <PixelButton tone="green" onClick={() => act('CONTINUE')} autoFocus>
        Continue
      </PixelButton>
    </div>
  );
}
