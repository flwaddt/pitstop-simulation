import PixelButton from './Button.jsx';

/**
 * Shown when a scene's video file can't be loaded. Names the file that is
 * expected so it can be dropped in, and lets the simulation continue.
 */
export default function AssetPlaceholder({ stateId, src, onContinue }) {
  const file = (src || '').split('/').pop();
  return (
    <div className="placeholder" role="alert">
      <p className="micro">Missing asset · {stateId}</p>
      <p className="placeholder-file">{file}</p>
      <p className="placeholder-hint">
        Put the clip at <code>public/{(src || '').replace(/^\.?\//, '')}</code> or change its path in <code>src/data/assets.js</code>.
      </p>
      <PixelButton tone="ghost" onClick={onContinue}>
        Continue without it
      </PixelButton>
    </div>
  );
}
