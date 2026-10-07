import { useEffect, useState } from 'react';
import RetroWindow from '../components/RetroWindow.jsx';
import { Hospital } from '../components/Pixel.jsx';
import { playCue } from '../lib/audio.js';

/**
 * Radar sweep finds hospitals around the rider, locks onto the nearest one
 * and connects. Positions are percentages inside the radar circle.
 */
const SPOTS = [
  { x: 42, y: 13 },
  { x: 18, y: 33 },
  { x: 85, y: 47, nearest: true },
  { x: 20, y: 70 },
  { x: 43, y: 83 },
];

export default function FindingHospital({ state }) {
  const [phase, setPhase] = useState('scan'); // scan → lock → connected
  useEffect(() => {
    const total = (state.auto || 5) * 1000;
    const a = setTimeout(() => {
      setPhase('lock');
      playCue('activate');
    }, total * 0.45);
    const b = setTimeout(() => {
      setPhase('connected');
      playCue('confirm');
    }, total * 0.75);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RetroWindow className="no-foot" band={{ tone: 'red', text: 'FINDING NEAREST HOSPITAL' }}>
      <div className="radar-wrap">
        <div className={`radar phase-${phase}`}>
          <div className="radar-scope">
            <span className="radar-sweep" />
            <span className="radar-rider" />
            {SPOTS.map((s, i) => (
              <span
                key={i}
                className={`radar-h ${s.nearest ? 'is-nearest' : ''}`}
                style={{ left: `${s.x}%`, top: `${s.y}%`, '--d': `${0.15 + i * 0.25}s` }}
              >
                <Hospital />
                {s.nearest && <i className="radar-lock" />}
              </span>
            ))}
          </div>
          <p className="radar-cap">{phase === 'connected' ? 'CONNECTED ✓' : 'TRY TO CONNECT'}</p>
        </div>
      </div>
    </RetroWindow>
  );
}
