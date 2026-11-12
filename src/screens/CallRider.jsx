import { useEffect, useState } from 'react';
import RetroWindow, { RetroButton } from '../components/RetroWindow.jsx';
import { SmartPhone } from '../components/Pixel.jsx';
import { playCue } from '../lib/audio.js';

const RINGS = 3;

/**
 * Between MONITOR ALERT and CONTACTING EMERGENCY SERVICE: the Monitor first
 * calls the rider back. The phone rings, nobody answers → emergency service.
 */
export default function CallRider({ act, state }) {
  const total = state.auto || 4.5;
  const [ring, setRing] = useState(0); // 1..RINGS while ringing, RINGS+1 = no answer
  useEffect(() => {
    const step = ((total - 1.4) * 1000) / (RINGS + 1);
    const ids = [];
    for (let i = 1; i <= RINGS + 1; i++) ids.push(setTimeout(() => setRing(i), step * (i - 1) + 250));
    return () => ids.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const noAnswer = ring > RINGS;
  useEffect(() => {
    if (ring >= 1 && ring <= RINGS) playCue('ring');
    if (noAnswer) playCue('noAnswer');
  }, [ring, noAnswer]);

  return (
    <RetroWindow
      band={{ tone: noAnswer ? 'red' : 'yellow', text: noAnswer ? 'RIDER NOT ANSWERING' : 'CALLING RIDER...' }}
      footer={
        <RetroButton tone="danger" className={noAnswer ? 'is-armed' : 'is-idle'} onClick={() => act('CONTACT_115')}>
          EMERGENCY SERVICE
        </RetroButton>
      }
    >
      <div className="col call">
        <span className={`tile call-phone ${noAnswer ? 'is-dead' : ring ? 'is-ring' : ''}`}>
          <SmartPhone />
          {!noAnswer && (
            <>
              <i className="call-wave w1" />
              <i className="call-wave w2" />
            </>
          )}
          {noAnswer && <b className="call-x">✕</b>}
        </span>
        <p className="call-who">CALL BACK TO RIDER</p>
        {noAnswer ? (
          <p className="obox obox-red">NO ANSWER</p>
        ) : (
          <p className="call-status">
            RINGING
            {Array.from({ length: RINGS }, (_, i) => (
              <i key={i} className={`call-dot ${i < ring ? 'on' : ''}`} />
            ))}
          </p>
        )}
      </div>
    </RetroWindow>
  );
}
