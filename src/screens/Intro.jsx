import { useEffect, useRef } from 'react';
import { RetroButton } from '../components/RetroWindow.jsx';
import { ASSETS } from '../data/assets.js';

/**
 * INTRO — title screen before UI 1.
 * Scene 1 plays silently behind, redrawn into a tiny canvas so it reads as
 * chunky pixels. START SIMULATION (click or SPACE) goes to UI 1.
 */
const PW = 192;
const PH = 108;

export default function Intro({ act }) {
  const canvas = useRef(null);
  const video = useRef(null);

  useEffect(() => {
    const v = video.current;
    const c = canvas.current;
    const g = c?.getContext('2d');
    if (!v || !g) return;
    g.imageSmoothingEnabled = true;
    v.play().catch(() => {});
    let raf;
    let last = 0;
    const draw = (t) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 66) return; // ~15 fps is plenty for a pixel backdrop
      last = t;
      if (v.readyState >= 2) g.drawImage(v, 0, 0, PW, PH);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      v.pause();
    };
  }, []);

  return (
    <section className="intro">
      <video ref={video} className="intro-src" src={ASSETS.video.scene1} muted loop playsInline preload="auto" aria-hidden="true" />
      <canvas ref={canvas} className="intro-bg" width={PW} height={PH} aria-hidden="true" />
      <div className="intro-shade" aria-hidden="true" />
      <div className="intro-scan" aria-hidden="true" />

      <div className="intro-in">
        <p className="intro-eyebrow">INTERACTIVE PRODUCT SIMULATION</p>
        <h1 className="intro-logo">PITSTOP</h1>
        <p className="intro-q">WHAT HAPPENS WHEN A RIDER CAN’T ASK FOR HELP?</p>
        <ol className="intro-pillars" aria-label="How PITSTOP works">
          <li className="ip-detect">DETECT</li>
          <li className="ip-verify">VERIFY</li>
          <li className="ip-respond">RESPOND</li>
        </ol>
        <div className="intro-cta">
          <RetroButton data-primary onClick={() => act('START')}>
            START SIMULATION
          </RetroButton>
          <p className="intro-press">
            PRESS <kbd>SPACE</kbd>
          </p>
        </div>
        <p className="intro-meta">SOUND ON · SPACE NEXT · W A S D / ← ↑ ↓ → RIDE</p>
        <p className="intro-credit">
          CINEMATIC SCENES GENERATED WITH GOOGLE VEO · ALL IDEAS &amp; PROMPTS BY TEAM PITSTOP
        </p>
      </div>
    </section>
  );
}
