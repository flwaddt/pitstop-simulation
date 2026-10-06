import { ASSETS, CONFIG } from './assets.js';

/**
 * PITSTOP state machine — follows PITSTOP_MASTER_INTERACTIVE_FLOW_A-Z,
 * plus a playable RIDE between Scene 1 and the crash.
 *
 *  INTRO → UI_1 → SCENE_1 → RIDE (W A S D / arrows) → SCENE_2 → LOADING
 *       → SCENE_3 → SCENE_4 ─CUT→ UI_3
 *    UI_3 ├─ I'M OK ─────────────→ UI_4 → SCENE_1 (back to riding)
 *         └─ NO RESPONSE / 0 → BEEP-BEEP → UI_5 → UI_6 → UI_7 → UI_8
 *              → UI_9 → UI_10 → UI_11    (all automatic, like signals arriving)
 *
 * SPACE moves on: skips a video, advances a timed screen, or presses the
 * screen's `primary` button. Screens with keys:'self' handle keys themselves.
 *
 * Fields
 *   type        'video' | 'ui'
 *   asset       video file (video states). null ⇒ skipped
 *   screen      screen component (ui states, see screens/index.js)
 *   bare        render full-bleed, not inside the centred window wrapper
 *   backdrop    'freeze' ⇒ keep the last video frame visible behind the screen
 *   next        default next state (video end, auto-advance, SPACE)
 *   actions     { ACTION: 'TARGET' } a screen can trigger
 *   primary     action SPACE triggers on this screen
 *   keys        'self' ⇒ the screen handles the keyboard itself
 *   hint        label next to the SPACE key hint
 *   auto        seconds before the state advances to `next` on its own
 *   transition  how a video enters: 'fade' | 'crossfade' | 'cut'
 *   pillar      DETECT | VERIFY | RESPOND (progress tracker)
 *   cue         sound cue on entry
 *   enabled     false ⇒ skipped
 */
const T = CONFIG.autoSeconds;

export const STATES = {
  // Title screen. START SIMULATION (click or SPACE) → UI 1 system check.
  INTRO: {
    type: 'ui',
    screen: 'Intro',
    bare: true,
    actions: { START: 'UI_1' },
    primary: 'START',
    hideHint: true,
    hideHud: true,
  },

  UI_1: {
    type: 'ui',
    screen: 'SystemReady',
    actions: { START: 'SCENE_1' },
    primary: 'START',
    hint: 'START',
  },

  SCENE_1: {
    type: 'video',
    asset: ASSETS.video.scene1,
    next: 'RIDE',
    transition: 'fade',
  },

  // Playable: move the scooter with W A S D / arrows. SPACE — or hitting the
  // second rider — goes to the crash.
  RIDE: {
    type: 'ui',
    screen: 'Ride',
    bare: true,
    keys: 'self',
    enabled: CONFIG.includeRide,
    next: 'SCENE_2',
    actions: { CRASH: 'SCENE_2' },
    hint: 'CRASH',
  },

  SCENE_2: {
    type: 'video',
    asset: ASSETS.video.scene2,
    next: 'LOADING',
    transition: 'crossfade',
    pillar: 'DETECT',
  },

  // Windows-style "PITSTOP SYSTEM" dialog over the frozen crash frame.
  LOADING: {
    type: 'ui',
    screen: 'Loading',
    bare: true,
    backdrop: 'freeze',
    next: 'SCENE_3',
    auto: CONFIG.loadingSeconds,
    actions: { CANCEL: 'INTRO' },
    pillar: 'DETECT',
    cue: 'loading',
  },

  SCENE_3: {
    type: 'video',
    asset: ASSETS.video.scene3,
    next: 'UI_2',
    transition: 'fade',
    pillar: 'DETECT',
  },
  // Not in the master state machine; enable with CONFIG.includeUI2.
  UI_2: {
    type: 'ui',
    screen: 'CrashSignal',
    enabled: CONFIG.includeUI2,
    next: 'SCENE_4',
    actions: { CONTINUE: 'SCENE_4' },
    primary: 'CONTINUE',
    pillar: 'DETECT',
    cue: 'activate',
  },
  SCENE_4: {
    type: 'video',
    asset: ASSETS.video.scene4,
    next: 'UI_3',
    transition: 'crossfade',
    pillar: 'VERIFY',
  },

  // CUT from Scene 4 straight into the interactive takeover.
  UI_3: {
    type: 'ui',
    screen: 'AreYouOk',
    keys: 'self',
    hint: 'CONFIRM',
    actions: { OK: 'UI_4', NO_RESPONSE: 'UI_5' },
    pillar: 'VERIFY',
  },

  // ── Safe branch ──
  UI_4: {
    type: 'ui',
    screen: 'StatusVerified',
    actions: { CONTINUE: 'SCENE_1' },
    primary: 'CONTINUE',
    pillar: 'VERIFY',
    outcome: 'safe',
    cue: 'safe',
  },

  // ── Emergency branch: every step moves on by itself ──
  UI_5: { type: 'ui', screen: 'NoResponse', next: 'UI_6', auto: T.ui5, pillar: 'RESPOND', cue: 'alarm' },
  UI_6: {
    type: 'ui',
    screen: 'AlertSent',
    next: 'UI_7',
    auto: T.ui6,
    actions: { CONTACT: 'UI_7', MONITOR: 'UI_8' },
    pillar: 'RESPOND',
    cue: 'confirm',
  },
  UI_7: {
    type: 'ui',
    screen: 'EmergencyContact',
    next: 'UI_8',
    auto: T.ui7,
    actions: { VIEW_LOCATION: 'UI_8' },
    pillar: 'RESPOND',
    cue: 'confirm',
  },
  UI_8: {
    type: 'ui',
    screen: 'MonitorAlert',
    next: 'UI_9',
    auto: T.ui8,
    actions: { CONTACT_115: 'UI_9' },
    pillar: 'RESPOND',
    cue: 'alarm',
  },
  UI_9: { type: 'ui', screen: 'Contacting115', next: 'UI_10', auto: T.ui9, pillar: 'RESPOND', cue: 'dial' },
  UI_10: { type: 'ui', screen: 'Response115', next: 'UI_11', auto: T.ui10, pillar: 'RESPOND', cue: 'confirm' },
  UI_11: {
    type: 'ui',
    screen: 'ResponseComplete',
    actions: { REPLAY: 'INTRO' },
    primary: 'REPLAY',
    hint: 'REPLAY',
    pillar: 'RESPOND',
    outcome: 'done',
    cue: 'safe',
  },
};

export const INITIAL_STATE = 'INTRO';
export const PILLARS = ['DETECT', 'VERIFY', 'RESPOND'];

export function isSkippable(state) {
  if (!state) return false;
  if (state.enabled === false) return true;
  return state.type === 'video' && !state.asset;
}

export function resolveState(id) {
  let guard = 0;
  while (isSkippable(STATES[id]) && guard++ < 32) id = STATES[id].next;
  return id;
}

/** Video that will most likely play after `id`, so it can be preloaded. */
export function upcomingVideo(id) {
  const s = STATES[id];
  if (!s) return null;
  const nextId = s.next ?? (s.actions ? Object.values(s.actions)[0] : null);
  if (!nextId) return null;
  const n = STATES[resolveState(nextId)];
  return n?.type === 'video' ? n.asset : null;
}
