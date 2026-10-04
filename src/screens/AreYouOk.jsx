import PixelButton from '../components/Button.jsx';
import { Brand, Headline, Tag } from '../components/Brand.jsx';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import useCountdown from '../hooks/useCountdown.js';
import { playCue } from '../lib/audio.js';

/** The decision point. The viewer answers for the rider, or lets the timer run out. */
export default function AreYouOk({ act, state }) {
  const total = state.duration;
  const left = useCountdown(
    total,
    () => act('TIMEOUT'),
    (n) => n > 0 && n <= 3 && playCue('tick'),
  );
  return (
    <div className="scr">
      <Brand tone="mixed" />
      <div className="stack-tight">
        <Headline tone="red" size="xl">Are you OK?</Headline>
        <Headline tone="red" size="md">Crash detected</Headline>
        <Tag>Please confirm your status</Tag>
      </div>
      <ProgressIndicator total={total} value={left} mode="drain" tone="red" label="Please respond" />
      <div className="btn-row">
        <PixelButton tone="okay" onClick={() => act('OK')} autoFocus>
          I’m OK
        </PixelButton>
        <PixelButton tone="red" onClick={() => act('NO_RESPONSE')}>
          No
          <br />
          response
        </PixelButton>
      </div>
    </div>
  );
}
