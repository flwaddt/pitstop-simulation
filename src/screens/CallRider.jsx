import { useEffect, useState } from 'react';
import RetroWindow from '../components/RetroWindow.jsx';
import { SmartPhone } from '../components/Pixel.jsx';
import { playCue } from '../lib/audio.js';

const BLOCKS = 14;
const STALL = 10; // the call never connects: the bar stops here

/**
 * Between MONITOR ALERT and CONTACTING EMERGENCY SERVICE — same layout as
 * Contacting115. The Monitor calls the rider back; it never connects
 * (we assume the rider can't answer), the bar fails with an ✕, then the
 * flow moves on to the emergency service.
 */
export default function CallRider({ state }) {
  const total = (state.auto || 4) * 1000;
  const [step, setStep] = useState(0);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const fill = total * 0.5;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STALL)), fill / STALL);
    const f = setTimeout(() => setFailed(true), total * 0.6);
    return () => {
      clearInterval(id);
      clearTimeout(f);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (step > 0 && step % 3 === 0) playCue('ring');
  }, [step]);
  useEffect(() => {
    if (failed) playCue('noAnswer');
  }, [failed]);

  return (
    <RetroWindow className="no-foot" band={{ tone: 'red', text: failed ? 'CALL FAILED — NO ANSWER' : 'CALLING RIDER...' }}>
      <div className="panel">
        <div className="pbar-row">
          <div className={`pbar ${failed ? 'pbar-fail' : ''}`} role="progressbar" aria-valuemin={0} aria-valuemax={BLOCKS} aria-valuenow={step}>
            {Array.from({ length: BLOCKS }, (_, i) => <i key={i} className={i < step ? 'on' : ''} />)}
          </div>
          <span className={`pbar-ico pbar-ico-lg call-ico ${failed ? 'is-dead' : 'is-ring'}`}>
            <SmartPhone />
            {failed && <b className="call-x">✕</b>}
          </span>
        </div>
      </div>
    </RetroWindow>
  );
}
