/** PITSTOP wordmark. tone: steel | green | red | mixed */
export function Brand({ tone = 'steel', className = '' }) {
  return (
    <div className={`brand brand-${tone} ${className}`} aria-label="PITSTOP">
      PITSTOP
    </div>
  );
}

/** Small caps label line. */
export function Tag({ tone = 'muted', children, className = '' }) {
  return <p className={`tag tag-${tone} ${className}`}>{children}</p>;
}

/** Bold condensed status headline. size: xl | lg | md */
export function Headline({ tone = 'white', size = 'lg', band = false, children, className = '' }) {
  return (
    <h2 className={`headline headline-${tone} headline-${size} ${band ? 'headline-band' : ''} ${className}`}>
      {children}
    </h2>
  );
}

/** Tiny technical label used for meta lines. */
export function Micro({ children, className = '' }) {
  return <p className={`micro ${className}`}>{children}</p>;
}
