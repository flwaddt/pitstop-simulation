/**
 * Blocky, stepped-corner button. Tones: blue | okay | green | red | ghost | ghost-green.
 * The stepped shape and faceted fill live in styles/ui.css (.pxbtn).
 */
export default function PixelButton({ tone = 'blue', size = 'md', className = '', children, ...rest }) {
  return (
    <button type="button" className={`pxbtn pxbtn-${tone} pxbtn-${size} ${className}`} {...rest}>
      <span className="pxbtn-label">{children}</span>
    </button>
  );
}

/** Stepped-corner panel with the same visual language. */
export function PixelPanel({ tone = 'blue', className = '', children, ...rest }) {
  return (
    <div className={`pxpanel pxpanel-${tone} ${className}`} {...rest}>
      <div className="pxpanel-body">{children}</div>
    </div>
  );
}
