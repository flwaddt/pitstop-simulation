/**
 * Smartphone shell: bezel, notch, halo in the current state tone, and the
 * thin technical frame from the UI references. Screens render inside.
 */
export default function PhoneUI({ tone = 'blue', children }) {
  return (
    <div className={`phone-wrap tone-${tone}`}>
      <div className="phone">
        <div className="phone-btn phone-btn-l1" />
        <div className="phone-btn phone-btn-l2" />
        <div className="phone-btn phone-btn-r" />
        <div className="phone-screen">
          <div className="notch" aria-hidden="true">
            <span className="notch-speaker" />
            <span className="notch-cam" />
          </div>
          <div className="hud-frame" aria-hidden="true">
            <span className="hf-tl" />
            <span className="hf-tr" />
            <span className="hf-bl" />
            <span className="hf-br" />
            <span className="hf-top-l">PITSTOP LINK · BT</span>
            <span className="hf-top-r">
              <i />
            </span>
            <span className="hf-side hf-side-l" />
            <span className="hf-side hf-side-r" />
          </div>
          <div className="phone-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
