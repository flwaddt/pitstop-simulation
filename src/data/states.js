import { ASSETS, CONFIG } from './assets.js';

/**
 * PITSTOP state machine — follows PITSTOP_MASTER_INTERACTIVE_FLOW_A-Z.
 *
 *  UI_1 → SCENE_1 → SCENE_2 → LOADING → SCENE_3 → SCENE_4 ─CUT→ UI_3
 *    UI_3 ├─ I'M OK ─────────────→ UI_4 → SCENE_1 (replay loop)
 *         └─ NO RESPONSE / 0 → BEEP-BEEP → UI_5 → UI_6 → UI_7 → UI_8
 *                                         → UI_9 → UI_10 → UI_11 → UI_1
 *
 * Fields
 *   type        'video' | 'ui'
 *   asset       video file (video states). null ⇒ skipped
 *   screen      screen component (ui states, see screens/index.js)
 *   next        default next state (video end, or auto-advance)
 *   actions     { ACTION: 'TARGET' } a screen can trigger
 *   auto        seconds before a ui state advances to `next` by itself
 *   transition  how a video enters: 'fade' | 'crossfade' | 'cut'
 *   backdrop    what the video layer does under a ui state: 'hidden' | 'freeze'
 *   pillar      DETECT | VERIFY | RESPOND (progress tracker)
 *   cue         sound cue on entry
 *   actor/note  one-line caption: who in the system is acting
 *   enabled     false ⇒ skipped
 */
export const STATES = {
  UI_1: {
    type: 'ui',
    screen: 'SystemReady',
    actions: { START: 'SCENE_1' },
    actor: 'PITSTOP',
    note: 'System ready. Start the simulation.',
  },

  SCENE_1: {
    type: 'video',
    asset: ASSETS.video.scene1,
    next: 'SCENE_2',
    transition: 'fade',
    label: 'Scene 1 · Normal riding',
    actor: 'Everyday commute',
    note: 'PITSTOP is mounted on the rider’s helmet.',
  },
  SCENE_2: {
    type: 'video',
    asset: ASSETS.video.scene2,
    next: 'LOADING',
    transition: 'crossfade',
    pillar: 'DETECT',
    label: 'Scene 2 · Crash',
    actor: 'Low-speed collision',
    note: 'Both riders fall. PITSTOP stays on the helmet.',
  },
  LOADING: CONFIG.loadingMode === 'video'
    ? {
        type: 'video',
        asset: ASSETS.video.loading,
        next: 'SCENE_3',
        transition: 'cut',
        pillar: 'DETECT',
        cue: 'loading',
        actor: 'PITSTOP',
        note: 'Processing crash data…',
      }
    : {
        type: 'ui',
        screen: 'Loading',
        backdrop: 'freeze',
        next: 'SCENE_3',
        auto: CONFIG.loadingSeconds,
        actions: { CANCEL: 'UI_1' },
        pillar: 'DETECT',
        cue: 'loading',
        actor: 'PITSTOP',
        note: 'Processing crash data…',
      },
  SCENE_3: {
    type: 'video',
    asset: ASSETS.video.scene3,
    next: 'UI_2',
    transition: 'fade',
    pillar: 'DETECT',
    label: 'Scene 3 · PITSTOP → Bluetooth → Phone',
    actor: 'PITSTOP → Bluetooth → Phone',
    note: 'PITSTOP has no GPS or SIM. It sends the crash signal to the phone.',
  },
  // Not in the master state machine; enable with CONFIG.includeUI2.
  UI_2: {
    type: 'ui',
    screen: 'CrashSignal',
    enabled: CONFIG.includeUI2,
    next: 'SCENE_4',
    actions: { CONTINUE: 'SCENE_4' },
    pillar: 'DETECT',
    cue: 'activate',
    actor: 'PITSTOP → Bluetooth → Phone',
    note: 'The phone receives the crash signal.',
  },
  SCENE_4: {
    type: 'video',
    asset: ASSETS.video.scene4,
    next: 'UI_3',
    transition: 'crossfade',
    pillar: 'VERIFY',
    label: 'Scene 4 · Phone',
    actor: 'Rider’s phone',
    note: 'The phone asks: Are you OK?',
  },

  // CUT from Scene 4 straight into the interactive takeover.
  UI_3: {
    type: 'ui',
    screen: 'AreYouOk',
    actions: { OK: 'UI_4', NO_RESPONSE: 'UI_5' },
    pillar: 'VERIFY',
    actor: 'You are the rider',
    note: 'Answer before the timer reaches 0.',
  },

  // ── Safe branch ──
  UI_4: {
    type: 'ui',
    screen: 'StatusVerified',
    actions: { CONTINUE: 'SCENE_1' },
    pillar: 'VERIFY',
    outcome: 'safe',
    cue: 'safe',
    actor: 'Rider confirmed safe',
    note: 'No emergency response. Back to riding.',
  },

  // ── Emergency branch ──
  UI_5: {
    type: 'ui',
    screen: 'NoResponse',
    next: 'UI_6',
    auto: CONFIG.noResponseSeconds,
    pillar: 'RESPOND',
    cue: 'alarm',
    actor: 'Rider’s phone',
    note: 'No answer. Emergency protocol starts.',
  },
  UI_6: {
    type: 'ui',
    screen: 'AlertSent',
    next: 'UI_7',
    auto: CONFIG.alertSentSeconds,
    actions: { CONTACT: 'UI_7', MONITOR: 'UI_8' },
    pillar: 'RESPOND',
    cue: 'confirm',
    actor: 'Phone → Contact + Monitor',
    note: 'Both get the alert and live location at the same time.',
  },
  UI_7: {
    type: 'ui',
    screen: 'EmergencyContact',
    actions: { VIEW_LOCATION: 'UI_8' },
    pillar: 'RESPOND',
    cue: 'click',
    actor: 'Emergency contact',
    note: 'Receives the alert and live location.',
  },
  UI_8: {
    type: 'ui',
    screen: 'MonitorAlert',
    actions: { CONTACT_115: 'UI_9' },
    pillar: 'RESPOND',
    cue: 'alarm',
    actor: 'Monitor',
    note: 'Sees rider, contact, crash status and location. The Monitor calls 115.',
  },
  UI_9: {
    type: 'ui',
    screen: 'Contacting115',
    next: 'UI_10',
    auto: CONFIG.contacting115Seconds,
    pillar: 'RESPOND',
    cue: 'dial',
    actor: 'Monitor → 115',
    note: 'PITSTOP never calls 115 directly.',
  },
  UI_10: {
    type: 'ui',
    screen: 'Response115',
    next: 'UI_11',
    auto: CONFIG.response115Seconds,
    pillar: 'RESPOND',
    cue: 'confirm',
    actor: '115',
    note: 'Incident received. Response unit dispatched.',
  },
  UI_11: {
    type: 'ui',
    screen: 'ResponseComplete',
    actions: { REPLAY: 'UI_1' },
    pillar: 'RESPOND',
    outcome: 'done',
    cue: 'safe',
    actor: 'Simulation complete',
    note: 'Detect → Verify → Respond.',
  },
};

export const INITIAL_STATE = 'UI_1';
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
