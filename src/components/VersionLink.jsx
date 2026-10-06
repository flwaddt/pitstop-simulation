import { useState } from 'react';
import { DEVICE_BUILD, looksTouch } from '../lib/device.js';

/**
 * Points people to the right build: the computer version opened on a phone
 * suggests /mobile/, and the phone version opened on a computer suggests the
 * computer version.
 */
export default function VersionLink() {
  const [hide, setHide] = useState(false);
  let href = null;
  let text = '';
  if (DEVICE_BUILD === 'desktop' && looksTouch) {
    href = './mobile/';
    text = 'ON A PHONE? OPEN THE MOBILE VERSION ▸';
  } else if (DEVICE_BUILD === 'mobile' && !looksTouch) {
    href = '../';
    text = 'ON A COMPUTER? OPEN THE KEYBOARD VERSION ▸';
  }
  if (!href || hide) return null;
  return (
    <div className="verlink">
      <a href={href}>{text}</a>
      <button type="button" onClick={() => setHide(true)} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
