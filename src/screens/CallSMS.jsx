import { useEffect, useState } from 'react';
import PixelButton, { PixelPanel } from '../components/Button.jsx';
import { Brand, Headline, Micro } from '../components/Brand.jsx';
import { PhoneIcon, PinPixel, SmsIcon } from '../components/PixelArt.jsx';

/** Simulated communication. Nothing is actually called or sent. */
export default function CallSMS({ act }) {
  const [sec, setSec] = useState(0);
  const [smsShown, setSmsShown] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setSec((s) => s + 1), 1000);
    const t = setTimeout(() => setSmsShown(true), 1400);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, []);
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');

  return (
    <div className="scr">
      <Brand tone="red" />
      <Headline tone="red" size="md">Emergency contact</Headline>

      <PixelPanel tone="red" className="call">
        <div className="call-head">
          <span className="call-ico">
            <PhoneIcon />
          </span>
          <span className="call-title">Call</span>
          <span className="call-time">{mm}:{ss}</span>
        </div>
        <p className="call-status dots">Calling emergency contact</p>
      </PixelPanel>

      <PixelPanel tone="blue" className="sms">
        <div className="call-head">
          <span className="call-ico call-ico-blue">
            <SmsIcon />
          </span>
          <span className="call-title">SMS</span>
          <span className="call-time">{smsShown ? 'Sent' : '…'}</span>
        </div>
        <div className={`bubble ${smsShown ? 'in' : ''}`}>
          <p className="bubble-head">PITSTOP emergency alert</p>
          <p>Crash detected</p>
          <p>Rider may need assistance</p>
          <p className="bubble-loc">
            <PinPixel /> Location shared
          </p>
        </div>
      </PixelPanel>

      <Micro className="center">Simulated workflow · no real call or SMS is sent</Micro>
      <PixelButton tone="blue" onClick={() => act('CONTINUE')} autoFocus>
        Response simulation
      </PixelButton>
    </div>
  );
}
