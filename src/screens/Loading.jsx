import { CONFIG } from '../data/assets.js';

/**
 * LOADING — small Windows 98-style dialog over the frozen crash frame.
 * Not UI 2 and not a crash state. Progress fills left → right in ~1.4 s.
 */
export default function Loading({ act }) {
  return (
    <div className="w98-wrap">
      <div className="w98" role="dialog" aria-label="PITSTOP SYSTEM" style={{ '--dur': `${CONFIG.loadingSeconds}s` }}>
        <div className="w98-title">
          <span>PITSTOP SYSTEM</span>
          <button type="button" className="w98-x" aria-label="Close" onClick={() => act('CANCEL')}>×</button>
        </div>
        <div className="w98-body">
          <p className="w98-msg">Loading...</p>
          <div className="w98-bar"><i /></div>
          <p className="w98-sub">Processing crash data...</p>
          <div className="w98-btns">
            <button type="button" className="w98-btn" disabled>Done</button>
            <button type="button" className="w98-btn w98-def" onClick={() => act('CANCEL')}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
