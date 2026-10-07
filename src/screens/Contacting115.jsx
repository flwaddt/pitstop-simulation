import { useEffect, useState } from 'react';
import RetroWindow from '../components/RetroWindow.jsx';
import { Radio } from '../components/Pixel.jsx';
import { playCue } from '../lib/audio.js';

const BLOCKS = 14;

/** UI 9 — the Monitor contacts the emergency service. PITSTOP never calls it directly. */
export default function Contacting115({ state }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const span = ((state.auto || 5) - 0.8) * 1000;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, BLOCKS)), span / BLOCKS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (step > 0 && step % 3 === 0) playCue('click');
  }, [step]);

  return (
    <RetroWindow className="no-foot" band={{ tone: 'red', text: 'CONTACTING EMERGENCY SERVICE...' }}>
      <div className="panel">
        <div className="pbar-row">
          <div className="pbar" role="progressbar" aria-valuemin={0} aria-valuemax={BLOCKS} aria-valuenow={step}>
            {Array.from({ length: BLOCKS }, (_, i) => <i key={i} className={i < step ? 'on' : ''} />)}
          </div>
          <span className="pbar-ico pbar-ico-lg"><Radio /></span>
        </div>
      </div>
    </RetroWindow>
  );
}
