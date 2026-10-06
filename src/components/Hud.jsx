import { PILLARS } from '../data/states.js';
import { isTouch } from '../lib/device.js';

/**
 * Thin overlay outside the window: DETECT · VERIFY · RESPOND tracker,
 * sound / fullscreen / restart, and the SPACE key hint (clickable too).
 * No captions: the player discovers the system by playing.
 */
export default function Hud({ state, muted, onToggleMute, onRestart, onSpace, onFullscreen, isFullscreen, spaceHint }) {
  const activeIdx = state.pillar ? PILLARS.indexOf(state.pillar) : -1;
  return (
    <div className={`hud ${state.type === 'video' ? 'hud-video' : 'hud-ui'}`}>
      <div className="hud-top">
        <ol className="pillars" aria-label="System stage">
          {PILLARS.map((p, i) => {
            let st = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'idle';
            if (state.outcome === 'safe' && p === 'RESPOND') st = 'skip';
            if (state.outcome === 'done') st = 'done';
            return (
              <li key={p} className={`pl pl-${st} pl-${p.toLowerCase()}`}>
                <i />
                {p}
                {st === 'skip' && <small>NOT REQUIRED</small>}
              </li>
            );
          })}
        </ol>
        <div className="hud-ctrls">
          <button type="button" className="hbtn" onClick={onToggleMute} title={muted ? 'Sound off' : 'Sound on'}>
            <svg viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
              <path d="M2 6h3l4-3v10l-4-3H2z" fill="currentColor" />
              {muted ? <path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" strokeWidth="1.6" /> : <path d="M11 5v6M13.5 3.5v9" stroke="currentColor" strokeWidth="1.6" />}
            </svg>
            <span className="sr">{muted ? 'Turn sound on' : 'Mute'}</span>
          </button>
          <button type="button" className="hbtn" onClick={onFullscreen} title="Fullscreen">
            <svg viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
              <path d={isFullscreen ? 'M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4' : 'M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4'} fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span className="sr">Fullscreen</span>
          </button>
          <button type="button" className="hbtn" onClick={onRestart} title="Restart">
            <svg viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
              <path d="M3 8a5 5 0 1 0 1.5-3.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M2 2v4h4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span className="sr">Restart</span>
          </button>
        </div>
      </div>

      {spaceHint && (
        <button type="button" className="keyhint" onClick={onSpace}>
          {!isTouch && <kbd>SPACE</kbd>}
          <span>{isTouch && spaceHint === 'SKIP' ? 'NEXT' : spaceHint} ▸</span>
        </button>
      )}
    </div>
  );
}
