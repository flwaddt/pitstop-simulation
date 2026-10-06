import { useContext } from 'react';
import { Folder, Spinner, Warning } from './Pixel.jsx';
import { AutoCtx } from '../lib/autoCtx.js';

/**
 * The master UI frame from UI 1: chunky grey Windows-like window, PITSTOP
 * pixel logo, coloured status band, dark pixel-grid workspace, side icons
 * and a bottom button tab.
 *
 * band:     { tone: 'green' | 'red' | 'hazard', text }
 * controls: show the _ □ X window buttons (all screens except UI 1)
 * footer:   node rendered in the bottom tab (usually a RetroButton)
 * overlay:  node rendered above the workspace (UI 3 modal)
 * deco:     { spinnerLeft, spinnerRight, cursor }
 */
export default function RetroWindow({ band, controls = true, footer, overlay, deco = {}, children, className = '' }) {
  const auto = useContext(AutoCtx);
  return (
    <div className={`win ${className} ${auto ? 'win-auto' : ''}`} style={auto ? { '--auto': `${auto}s` } : undefined}>
      <span className="screw s-tl" />
      <span className="screw s-tr" />
      <span className="screw s-bl" />
      <span className="screw s-br" />

      <div className="win-title">
        <h1 className="logo">PITSTOP</h1>
        {controls && (
          <div className="win-ctrls" aria-hidden="true">
            <span className="wc wc-min" />
            <span className="wc wc-max" />
            <span className="wc wc-x" />
          </div>
        )}
      </div>

      <div className="ws">
        {band && (
          <div className={`band band-${band.tone}`}>
            <span>{band.text}</span>
          </div>
        )}
        <div className="ws-body">{children}</div>
        {auto > 0 && (
          <div className="sigbar" aria-hidden="true">
            <span>RECEIVING SIGNAL</span>
            <i />
          </div>
        )}
      </div>

      <div className="deco deco-folder-1"><Folder /></div>
      <div className="deco deco-folder-2"><Folder light /></div>
      <div className="deco deco-warn"><Warning /></div>
      {deco.spinnerLeft && <Spinner className="deco deco-spin-l" />}
      {deco.spinnerRight && <Spinner className="deco deco-spin-r" />}
      {deco.cursor && <div className="deco deco-cursor">{deco.cursor}</div>}

      {footer && <div className="win-foot">{footer}</div>}
      {overlay}
    </div>
  );
}

/** Bevelled "[ LABEL ]" button. tone colours the label: default | green | red */
export function RetroButton({ tone = 'default', outline, children, className = '', ...rest }) {
  return (
    <button type="button" className={`rbtn rbtn-${tone} ${outline ? `rbtn-ol-${outline}` : ''} ${className}`} {...rest}>
      <span className="rbtn-br">[</span>
      <span className="rbtn-label">{children}</span>
      <span className="rbtn-br">]</span>
    </button>
  );
}
