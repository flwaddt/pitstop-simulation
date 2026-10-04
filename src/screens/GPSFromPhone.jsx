import { useEffect, useState } from 'react';
import PixelButton, { PixelPanel } from '../components/Button.jsx';
import { Brand, Headline, Tag } from '../components/Brand.jsx';
import { BluetoothIcon, DetectorPixel, GpsIcon, PhonePixel } from '../components/PixelArt.jsx';
import VoxelMap from '../components/VoxelMap.jsx';
import { CONFIG } from '../data/assets.js';
import { playCue } from '../lib/audio.js';

/** Location comes from the phone. The chain makes that explicit. */
export default function GPSFromPhone({ act }) {
  const [acquired, setAcquired] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setAcquired(true);
      playCue('locate');
    }, CONFIG.gpsAcquireSeconds * 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="scr">
      <Brand />
      <div className="stack-tight">
        <Headline tone="blue" size="md">{acquired ? 'GPS location acquired' : 'Acquiring GPS…'}</Headline>
        <Tag tone="white">Location from phone</Tag>
      </div>

      <ol className="chain" aria-label="Signal path">
        <li className="chain-node">
          <DetectorPixel />
          <span>PITSTOP</span>
        </li>
        <li className="chain-arrow" aria-hidden="true" />
        <li className="chain-node">
          <BluetoothIcon className="chain-ico" />
          <span>Bluetooth</span>
        </li>
        <li className="chain-arrow" aria-hidden="true" />
        <li className="chain-node">
          <PhonePixel />
          <span>Phone</span>
        </li>
        <li className="chain-arrow" aria-hidden="true" />
        <li className={`chain-node ${acquired ? 'is-on' : 'is-wait'}`}>
          <GpsIcon className="chain-ico" />
          <span>GPS</span>
        </li>
      </ol>

      <PixelPanel tone="blue" className="map-panel">
        <VoxelMap mode="locate" acquired={acquired} />
        <span className={`map-tag ${acquired ? 'on' : ''}`}>{acquired ? 'Rider located · phone GPS' : 'Searching…'}</span>
        <span className="map-fict">Fictional map</span>
      </PixelPanel>

      <PixelButton tone="blue" onClick={() => act('CONTINUE')} disabled={!acquired} autoFocus={acquired}>
        Continue
      </PixelButton>
    </div>
  );
}
