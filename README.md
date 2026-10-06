# PITSTOP — Interactive Crash Simulation

Interactive, branching simulation of the PITSTOP helmet-mounted crash detector.
**Detect → Verify → Respond.** Follows `reference/PITSTOP_MASTER_INTERACTIVE_FLOW_A-Z.docx`.

Live:
- Computer (keyboard): https://flwaddt.github.io/pitstop-simulation/
- Phone (touch): https://flwaddt.github.io/pitstop-simulation/mobile/

Both are built from the same code (`npm run build` makes `dist/` and `dist/mobile/`).
Opening one on the wrong device shows a link to the other.

## Flow

```
INTRO title screen [START SIMULATION] → UI 1 system check (starts by itself) → SCENE 1 normal riding → RIDE (playable) → SCENE 2 crash → LOADING (Win98 dialog)
→ SCENE 3 PITSTOP → Bluetooth → Phone → SCENE 4 phone shows "ARE YOU OK?" ─CUT→ UI 3
UI 3 (real 10 → 0 countdown)
 ├─ I'M OK ──────────────→ UI 4 STATUS VERIFIED → back to SCENE 1
 └─ NO RESPONSE / 0 → silence · low hit · BEEP—BEEP → UI 5 NO RESPONSE
      → UI 6 ALERT SENT (Contact + Monitor at once) → UI 7 EMERGENCY CONTACT
      → UI 8 MONITOR ALERT → UI 9 CONTACTING 115 (Monitor → 115)
      → UI 10 115 RESPONSE → UI 11 RESPONSE COMPLETE → REPLAY
```

After NO RESPONSE every screen moves on by itself (5–8 s each, `CONFIG.autoSeconds`),
like signals arriving; buttons on those screens press themselves.

PITSTOP never calls 115 and has no GPS/SIM: the phone sends the alert and live location,
and the Monitor calls 115.

## Run / build

```bash
npm install
npm run dev           # local dev
npm run build         # dist/ — deployed to GitHub Pages by .github/workflows/deploy.yml
npm run build:single  # dist-single/ — one index.html (JS, CSS, fonts inlined) + assets/
```

Fonts (Press Start 2P, VT323) are bundled, so the site works offline once loaded.

## Change things — `src/data/assets.js`

- **Videos:** `ASSETS.video.*` → files in `public/assets/video/`.
- **Loading step:** Windows-style dialog drawn in HTML, `CONFIG.loadingSeconds`.
- **Speed:** `CONFIG.videoSpeed` (2 = scenes play twice as fast; a state can set its own `speed`).
- **Countdown:** counts 10 → 0; `countdownStepMs` sets how long each number stays (500 ms → 5 s total).
- **Timings:** countdown, `autoSeconds` for UI 5–10, `rideEventSeconds` for the ride.
- **Ride:** `CONFIG.includeRide = false` removes the playable segment.
- **Sound:** every cue has a built-in retro synth fallback. Put a file in `public/assets/audio/`
  and set its path in `ASSETS.audio` to replace one. `ASSETS.audio.music` loops under the UI
  screens only — use music you have the rights to publish.
- **UI 2** is not in the master state machine; `CONFIG.includeUI2 = true` shows it after Scene 3.

States and transitions: `src/data/states.js`. Screens: `src/screens/`. Window frame,
pixel icons, map and countdown ring: `src/components/`. Styles: `src/styles/`.

`scene-02-crash.mp4` had stray "LEFT → LEFT / RIGHT → LEFT" text in its first 4 seconds;
it was blurred out of the road surface. The clean clip is the one in `public/assets/video/`.

## Phones

The `/mobile/` version is made for phones and tablets: tap **NEXT ▸** (bottom right) instead of Space,
tap the answer buttons on ARE YOU OK?, and use the on-screen ◀ ▲ ▼ ▶ pad in the ride.
START goes fullscreen and locks landscape where the browser allows (Android). In portrait a
"rotate your phone" prompt appears; *PLAY UPRIGHT* dismisses it. The START tap also unlocks
video sound on iPhone.

## Controls (keyboard first)

| Key | What it does |
|---|---|
| **SPACE** | Next: start, skip a video, continue, replay |
| **W A S D / arrow keys** | Ride the scooter (RIDE) |
| **← / A, → / D** then **SPACE** | Choose I'M OK or NO RESPONSE (UI 3) |

Mouse works too. Top right: sound, fullscreen, restart. There are no on-screen captions, so the
player discovers the system by playing.
