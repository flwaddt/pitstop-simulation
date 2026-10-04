import { ASSETS, CONFIG } from './assets.js';

/**
 * PITSTOP state machine.
 *
 * Each state declares:
 *   type      'video' | 'ui' | 'route'
 *             video  — a cinematic clip, advances to `next` when it ends
 *             ui     — an interactive screen (see screens/index.js)
 *             route  — a pass-through state that only plays a cue and forwards
 *   asset     video file (video states). null ⇒ state is skipped.
 *   screen    screen component name (ui states)
 *   phone     true ⇒ rendered inside the smartphone frame
 *   next      default next state
 *   actions   { ACTION_NAME: 'TARGET_STATE' } — what a screen may trigger
 *   duration  seconds, for timed screens
 *   pillar    DETECT | VERIFY | RESPOND — lights the progress tracker
 *   tone      neutral | blue | green | red | mixed — drives glow colour
 *   cue       optional sound cue played on entry
 *   transition how a video enters: 'fade' | 'crossfade' | 'discover'
 *   actor / note  the short caption shown bottom-left. `actor` names which
 *             part of the system is doing the work (detector, phone, simulation).
 */
export const STATES = {
  START: {
    type: 'ui',
    screen: 'StartScreen',
    tone: 'neutral',
    actions: { START: 'NORMAL_RIDING' },
  },

  // ─── Cinematic scenes ──────────────────────────────────────────────
  NORMAL_RIDING: {
    type: 'video',
    asset: ASSETS.video.normalRiding,
    next: 'CRASH',
    transition: 'fade',
    tone: 'neutral',
    label: 'Scene 01 · Normal riding',
    actor: 'Everyday commute',
    note: 'PITSTOP sits on a dock on the back of the helmet.',
  },
  CRASH: {
    type: 'video',
    asset: ASSETS.video.crash,
    next: 'IMPACT_DETECTED',
    transition: 'crossfade',
    tone: 'neutral',
    label: 'Scene 02 · Crash',
    actor: 'Low-speed fall',
    note: 'A believable everyday accident.',
  },
  IMPACT_DETECTED: {
    type: 'video',
    asset: ASSETS.video.impactDetected,
    next: 'BLUETOOTH',
    transition: 'discover',
    pillar: 'DETECT',
    tone: 'red',
    label: 'Scene 03 · Impact detected',
    actor: 'PITSTOP detector',
    note: 'The helmet-mounted detector senses the impact.',
  },

  // ─── FUTURE cinematic slots (skipped while asset is null) ─────────
  BLUETOOTH: {
    type: 'video',
    asset: ASSETS.video.bluetooth,
    next: 'PHONE',
    transition: 'crossfade',
    pillar: 'DETECT',
    tone: 'blue',
    label: 'Scene 04 · PITSTOP → Bluetooth → Phone',
    actor: 'PITSTOP → Bluetooth',
    note: 'The detector hands the crash signal to the phone.',
  },
  PHONE: {
    type: 'video',
    asset: ASSETS.video.phone,
    next: 'PHONE_SIGNAL',
    transition: 'crossfade',
    pillar: 'DETECT',
    tone: 'blue',
    label: 'Scene 05 · Phone',
    actor: "Rider's phone",
    note: 'The phone receives the crash signal.',
  },

  // ─── Phone UI ─────────────────────────────────────────────────────
  // First phone screen: the hand-off from detector to phone
  // (UI reference 1 — "Crash signal received").
  PHONE_SIGNAL: {
    type: 'ui',
    screen: 'SignalReceived',
    phone: true,
    pillar: 'DETECT',
    tone: 'blue',
    cue: 'bluetooth',
    actions: { CONTINUE: 'ARE_YOU_OK' },
    actor: 'PITSTOP → Bluetooth → Phone',
    note: 'The detector has no GPS. It passes the crash signal to the phone.',
  },
  ARE_YOU_OK: {
    type: 'ui',
    screen: 'AreYouOk',
    phone: true,
    pillar: 'VERIFY',
    tone: 'mixed',
    cue: 'alert',
    duration: CONFIG.areYouOkSeconds,
    actions: { OK: 'STATUS_VERIFIED', NO_RESPONSE: 'NO_RESPONSE', TIMEOUT: 'NO_RESPONSE' },
    actor: "Rider's phone",
    note: 'You are the rider now. Answer, or let the timer run out.',
  },

  // ─── Safe branch ──────────────────────────────────────────────────
  STATUS_VERIFIED: {
    type: 'ui',
    screen: 'StatusVerified',
    phone: true,
    pillar: 'VERIFY',
    outcome: 'safe',
    tone: 'green',
    cue: 'safe',
    actions: { CONTINUE: 'SAFE_OUTCOME' },
    actor: "Rider's phone",
    note: 'The rider answered. Nothing is escalated.',
  },
  SAFE_OUTCOME: {
    type: 'ui',
    screen: 'SafeOutcome',
    phone: true,
    pillar: 'RESPOND',
    outcome: 'safe',
    tone: 'green',
    cue: 'confirm',
    actions: { RESTART: 'START' },
    actor: 'System complete',
    note: 'A false alarm costs the rider one tap.',
  },

  // ─── Emergency branch ─────────────────────────────────────────────
  NO_RESPONSE: {
    type: 'route',
    next: 'WAIT_VERIFY',
    cue: 'warning',
  },
  WAIT_VERIFY: {
    type: 'ui',
    screen: 'WaitVerify',
    phone: true,
    pillar: 'VERIFY',
    tone: 'blue',
    duration: CONFIG.verifySeconds,
    actions: { TIMEOUT: 'EMERGENCY_ALERT' },
    actor: "Rider's phone",
    note: 'A short wait before escalating filters out false alarms.',
  },
  EMERGENCY_ALERT: {
    type: 'ui',
    screen: 'EmergencyAlert',
    phone: true,
    pillar: 'RESPOND',
    outcome: 'emergency',
    tone: 'red',
    cue: 'emergency',
    actions: { CONTINUE: 'GPS_FROM_PHONE' },
    actor: "Rider's phone",
    note: 'No answer. The phone starts the emergency workflow.',
  },
  GPS_FROM_PHONE: {
    type: 'ui',
    screen: 'GPSFromPhone',
    phone: true,
    pillar: 'RESPOND',
    outcome: 'emergency',
    tone: 'blue',
    actions: { CONTINUE: 'EMERGENCY_CONTACT' },
    actor: "Rider's phone · GPS",
    note: 'Location comes from the phone. The detector has no GPS.',
  },
  EMERGENCY_CONTACT: {
    type: 'ui',
    screen: 'EmergencyContact',
    phone: true,
    pillar: 'RESPOND',
    outcome: 'emergency',
    tone: 'red',
    actions: { CALL_SMS: 'CALL_SMS' },
    actor: "Rider's phone",
    note: 'Fictional contact for this simulation.',
  },
  CALL_SMS: {
    type: 'ui',
    screen: 'CallSMS',
    phone: true,
    pillar: 'RESPOND',
    outcome: 'emergency',
    tone: 'red',
    cue: 'ring',
    actions: { CONTINUE: 'RESPONSE_SIMULATION' },
    actor: 'Simulation',
    note: 'No real call or SMS is sent.',
  },
  RESPONSE_SIMULATION: {
    type: 'ui',
    screen: 'ResponseSimulation',
    phone: true,
    pillar: 'RESPOND',
    outcome: 'emergency',
    tone: 'blue',
    cue: 'confirm',
    actions: { END: 'END' },
    actor: 'Simulation',
    note: 'The intended emergency-response workflow.',
  },
  END: {
    type: 'ui',
    screen: 'EndScreen',
    pillar: 'RESPOND',
    outcome: 'emergency',
    tone: 'neutral',
    actions: { RESTART: 'START' },
  },
};

export const INITIAL_STATE = 'START';
export const PILLARS = ['DETECT', 'VERIFY', 'RESPOND'];

/** A state is playable unless it is a route, or a video with no asset. */
export function isSkippable(state) {
  if (!state) return false;
  if (state.type === 'route') return true;
  if (state.type === 'video' && !state.asset) return true;
  return state.enabled === false;
}

/**
 * Follow `next` through skippable states until a playable one is found.
 * Returns { id, passed } where `passed` lists the skipped states (so their
 * cues can still play).
 */
export function resolveState(id) {
  const passed = [];
  let guard = 0;
  while (isSkippable(STATES[id]) && guard++ < 32) {
    passed.push(id);
    id = STATES[id].next;
  }
  return { id, passed };
}

/** The video asset that will play after `id`, so it can be preloaded. */
export function upcomingVideo(id) {
  const s = STATES[id];
  if (!s) return null;
  const nextId = s.next ?? s.actions?.START ?? null;
  if (!nextId) return null;
  const { id: resolved } = resolveState(nextId);
  const n = STATES[resolved];
  return n?.type === 'video' ? n.asset : null;
}
