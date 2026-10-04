/**
 * PITSTOP — central asset configuration.
 *
 * Every media file the simulation uses is referenced from here, so swapping
 * a video or adding a sound is a one-line change.
 *
 * Paths are relative to /public. BASE_URL keeps them working when the build
 * is hosted from a sub-folder.
 */
const base = import.meta.env.BASE_URL;
const p = (path) => (path ? `${base}${path}` : null);

export const ASSETS = {
  video: {
    normalRiding: p('assets/video/scene-01-normal-riding.mp4'),
    crash: p('assets/video/scene-02-crash.mp4'),
    impactDetected: p('assets/video/scene-03-impact-detected.mp4'),

    // FUTURE — Scene 4 (PITSTOP → Bluetooth → Phone) and Scene 5 (Phone).
    // Leave as null until the clips exist. A state whose asset is null is
    // skipped automatically; set a path here and it plays in sequence.
    // e.g. bluetooth: p('assets/video/scene-04-bluetooth.mp4'),
    bluetooth: null,
    phone: null,
  },

  image: {
    startPoster: p('assets/img/start-poster.jpg'),
  },

  /**
   * Optional audio. Every cue has a built-in synthesized fallback (see
   * src/lib/audio.js). Drop a file into /public/assets/audio and set its
   * path here to replace the synth tone, e.g.
   *   alert: p('assets/audio/alert.mp3'),
   */
  audio: {
    detect: null,
    bluetooth: null,
    alert: null,
    tick: null,
    warning: null,
    emergency: null,
    locate: null,
    ring: null,
    safe: null,
    confirm: null,
  },
};

/** Presentation options. */
export const CONFIG = {
  areYouOkSeconds: 10,
  verifySeconds: 8,
  /** Seconds the GPS screen "searches" before the fix is shown. */
  gpsAcquireSeconds: 2.4,
  /** Seconds for the response vehicle to reach the rider on the map. */
  responseTravelSeconds: 11,
  /** Videos keep their own soundtrack. Set false to start muted. */
  soundOnByDefault: true,
};
