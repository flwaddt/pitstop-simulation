import { Brand, Headline, Micro, Tag } from '../components/Brand.jsx';
import ProgressIndicator from '../components/ProgressIndicator.jsx';
import useCountdown from '../hooks/useCountdown.js';
import { playCue } from '../lib/audio.js';

/** No answer yet. The phone waits before escalating, to filter false alarms. */
export default function WaitVerify({ act, state }) {
  const total = state.duration;
  const left = useCountdown(
    total,
    () => act('TIMEOUT'),
    (n) => n > 0 && n <= 3 && playCue('tick'),
  );
  return (
    <div className="scr">
      <Brand />
      <div className="stack-tight">
        <Headline tone="red" size="md">No response detected</Headline>
        <Tag tone="blue">Verifying rider status</Tag>
      </div>
      <ProgressIndicator total={total} value={left} pad mode="fill" tone="blue" top="Wait" label={<span className="dots">Verifying</span>} />
      <Micro className="center">Escalating only if the rider still does not respond</Micro>
    </div>
  );
}
