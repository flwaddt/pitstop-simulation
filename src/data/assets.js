/**
 * PITSTOP — central asset configuration.
 * Every media file is referenced from here; swapping one is a one-line change.
 * Paths are relative to /public.
 */
// The phone build lives in /mobile/ and reads the shared videos from ../assets.
const base = import.meta.env.VITE_ASSET_BASE || import.meta.env.BASE_URL;
const p = (path) => (path ? `${base}${path}` : null);

export const ASSETS = {
  video: {
    scene1: p('assets/video/scene-01-normal-riding.mp4'),
    scene2: p('assets/video/scene-02-crash.mp4'),
    scene3: p('assets/video/scene-03-bluetooth-to-phone.mp4'),
    scene4: p('assets/video/scene-04-are-you-ok-phone.mp4'),
    /** Optional alternative to the HTML loading dialog (not used by default). */
    loading: p('assets/video/loading-dialog.mp4'),
  },

  /**
   * Optional audio files. Every cue has a synthesized fallback in
   * src/lib/audio.js, so all of these can stay null.
   *   music — loops quietly under the UI screens (not under the videos).
   *           Use only music you have the rights to publish.
   */
  audio: {
    music: null,
    click: null,
    loading: null,
    activate: null,
    tick: null,
    zeroHit: null,
    alarm: null,
    confirm: null,
    dial: null,
    safe: null,
    impact: null,
  },
};

export const CONFIG = {
  /** Playback speed for every cinematic scene (1 = original). A state can override with `speed`. */
  videoSpeed: 2,
  /** UI 3 countdown, in seconds. */
  countdownSeconds: 10,
  /** Milliseconds each countdown number stays on screen (1500 → the 10 → 0 count takes 15 s). */
  countdownStepMs: 1500,
  /** LOADING (Windows-style dialog) after the crash, in seconds. */
  loadingSeconds: 0.8,
  /** Playable riding segment between Scene 1 and the crash. */
  includeRide: true,
  /** RIDE: seconds before the second rider comes at you (Space works any time). */
  rideEventSeconds: 4,
  /**
   * Emergency branch: after NO RESPONSE every screen moves on by itself,
   * like signals arriving. Seconds per screen (SPACE skips ahead).
   */
  autoSeconds: {
    ui5: 5, // NO RESPONSE
    ui6: 5.5, // ALERT SENT
    ui7: 6, // EMERGENCY CONTACT  (auto-presses VIEW LOCATION)
    ui8: 6, // MONITOR ALERT      (auto-presses CONTACT 115)
    ui9: 5.5, // CONTACTING 115
    ui10: 7, // 115 RESPONSE       (vehicle drives to the rider)
  },
  /** UI 2 is not in the master state machine; set true to show it after Scene 3. */
  includeUI2: false,
  soundOnByDefault: true,
};
