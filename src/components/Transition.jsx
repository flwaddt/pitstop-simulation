/**
 * Keyed entry transition for screen swaps inside the phone.
 * Each new key mounts with a short fade / de-blur (see .swap in ui.css).
 */
export default function Transition({ id, children, className = '' }) {
  return (
    <div key={id} className={`swap ${className}`}>
      {children}
    </div>
  );
}
