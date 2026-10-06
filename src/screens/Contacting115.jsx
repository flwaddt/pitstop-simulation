import { useEffect, useState } from 'react';
import RetroWindow from '../components/RetroWindow.jsx';
import { Radio } from '../components/Pixel.jsx';
import { playCue } from '../lib/audio.js';

const ITEMS = ['RIDER INFORMATION', 'CRASH STATUS', 'LIVE LOCATION', 'EMERGENCY CONTACT'];
const BLOCKS = 14;

/** UI 9 — Monitor → 115. PITSTOP does not call 115. */
export default function Contacting115({ state }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const span = ((state.auto || 5) - 0.8) * 1000;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, BLOCKS)), span / BLOCKS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const shown = Math.floor((step / BLOCKS) * (ITEMS.length + 1));
  useEffect(() => {
    if (shown > 0) playCue('click');
  }, [shown]);

  return (
    <RetroWindow className="no-foot" band={{ tone: 'red', text: 'CONTACTING 115...' }}>
      <div className="panel">
        <span className="panel-tag">MONITOR ▸ 115</span>
        <div className="pbar-row">
          <div className="pbar" role="progressbar" aria-valuemin={0} aria-valuemax={BLOCKS} aria-valuenow={step}>
            {Array.from({ length: BLOCKS }, (_, i) => <i key={i} className={i < step ? 'on' : ''} />)}
          </div>
          <span className="pbar-ico"><Radio /></span>
        </div>
        <ul className="checklist">
          {ITEMS.map((t, i) => (
            <li key={t} className={i < shown ? 'in' : ''}>
              {t} <b className="t-green">✓</b>
            </li>
          ))}
          <li className={`t-cyan conn ${shown > ITEMS.length ? 'in' : ''}`}>CONNECTION: ACTIVE</li>
        </ul>
      </div>
    </RetroWindow>
  );
}
