import { PILLARS } from '../data/states.js';

/**
 * Minimal overlay: DETECT · VERIFY · RESPOND tracker, sound / fullscreen /
 * restart controls, a one-line caption naming which part of the system is
 * working, and SKIP during cinematic scenes.
 */
export default function Hud({ state, stateId, muted, onToggleMute, onRestart, onSkip, onFullscreen, isFullscreen }) {
  const activeIdx = state.pillar ? PILLARS.indexOf(state.pillar) : -1;
  const isVideo = state.type === 'video';
  const safe = state.outcome === 'safe';

  return (
    <div className={`hud ${isVideo ? 'hud-video' : 'hud-ui'}`}>
      <div className="hud-top">
        <div className="hud-mark">PITSTOP</div>

        <ol className="pillars" aria-label="System stage">
          {PILLARS.map((p, i) => {
            let status = 'idle';
            if (i < activeIdx) status = 'done';
            if (i === activeIdx) status = 'active';
            if (p === 'RESPOND' && safe && activeIdx === 2) status = 'skipped';
            if (stateId === 'END' && i <= 2) status = 'done';
            return (
              <li key={p} className={`pillar pillar-${status}`} aria-current={status === 'active' ? 'step' : undefined}>
                <span className="pillar-dot" />
                <span className="pillar-name">{p}</span>
                {status === 'skipped' && <span className="pillar-note">not required</span>}
              </li>
            );
          })}
        </ol>

        <div className="hud-ctrls">
          <button type="button" className="hud-btn" onClick={onToggleMute} aria-pressed={!muted} title={muted ? 'Sound off' : 'Sound on'}>
            {muted ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" strokeWidth="2" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" /><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            )}
            <span className="sr">{muted ? 'Turn sound on' : 'Mute'}</span>
          </button>
          <button type="button" className="hud-btn" onClick={onFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d={isFullscreen ? 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5' : 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'} fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            <span className="sr">Fullscreen</span>
          </button>
          <button type="button" className="hud-btn" onClick={onRestart} title="Restart simulation">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2-5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M4 3v5h5" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
            <span className="sr">Restart simulation</span>
          </button>
        </div>
      </div>

      {(state.actor || state.label) && (
        <div className="hud-caption" key={stateId}>
          {state.label && <span className="cap-label">{state.label}</span>}
          {state.actor && <span className="cap-actor">{state.actor}</span>}
          {state.note && <span className="cap-note">{state.note}</span>}
        </div>
      )}

      {isVideo && (
        <button type="button" className="skip" onClick={onSkip}>
          Skip scene <span aria-hidden="true">›</span>
        </button>
      )}
    </div>
  );
}
