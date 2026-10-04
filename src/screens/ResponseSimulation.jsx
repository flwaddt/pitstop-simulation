import PixelButton, { PixelPanel } from '../components/Button.jsx';
import { Brand, Headline, Micro, Tag } from '../components/Brand.jsx';
import VoxelMap from '../components/VoxelMap.jsx';
import { CONFIG } from '../data/assets.js';

/** Illustration of the intended workflow. No real dispatch. */
export default function ResponseSimulation({ act }) {
  return (
    <div className="scr">
      <Brand />
      <Tag tone="blue">Response simulation</Tag>
      <Headline tone="white" size="lg">Help is on the way</Headline>
      <PixelPanel tone="blue" className="map-panel map-panel-tall">
        <VoxelMap mode="respond" travel={CONFIG.responseTravelSeconds} />
        <span className="map-tag on">Response vehicle → rider</span>
        <span className="map-fict">Fictional map</span>
      </PixelPanel>
      <div className="chip chip-red chip-wide">
        <span className="chip-pulse" />
        <span>Emergency workflow active</span>
      </div>
      <Micro className="center">Intended workflow · this prototype does not dispatch an ambulance</Micro>
      <PixelButton tone="ghost" onClick={() => act('END')} autoFocus>
        End simulation
      </PixelButton>
    </div>
  );
}
