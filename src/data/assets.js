/**
 * PITSTOP — central asset configuration.
 * Every media file is referenced from here; swapping one is a one-line change.
 * Paths are relative to /public.
 */
const base = import.meta.env.BASE_URL;
const p = (path) => (path ? `${base}${path}` : null);

export const ASSETS = {
  video: {
    scene1: p('assets/video/scene-01-normal-riding.mp4'),
    scene2: p('assets/video/scene-02-crash.mp4'),
    scene3: p('assets/video/scene-03-bluetooth-to-phone.mp4'),
    scene4: p('assets/video/scene-04-are-you-ok-phone.mp4'),
    /** Only used when CONFIG.loadingMode === 'video'. */
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
  },
};

export const CONFIG = {
  /** UI 3 countdown, in seconds. */
  countdownSeconds: 10,
  /**
   * LOADING transition:
   *  'html'  — crisp Windows-style dialog drawn in HTML, ~1.4 s (matches spec)
   *  'video' — plays ASSETS.video.loading instead
   */
  loadingMode: 'html',
  loadingSeconds: 1.4,
  /** Auto-advance timings for screens without a button. */
  noResponseSeconds: 3.2, // UI 5
  alertSentSeconds: 4.5, // UI 6
  contacting115Seconds: 5, // UI 9
  response115Seconds: 7.5, // UI 10
  /** UI 2 is not in the master state machine; set true to show it after Scene 3. */
  includeUI2: false,
  soundOnByDefault: true,
};
