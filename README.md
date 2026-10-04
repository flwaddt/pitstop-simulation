# PITSTOP — Interactive Crash Simulation

Cinematic, branching product simulation for the PITSTOP helmet-mounted crash detector.
**Detect. Verify. Respond.**

## Run

```bash
npm install
npm run dev          # local dev server
npm run build        # dist/  → upload to any static host (Netlify, Vercel, GitHub Pages)
npm run build:single # dist-single/ → one index.html with JS/CSS inlined + assets/ folder
```

Open the built `index.html` through a web server (not by double-clicking), because videos load over HTTP.
Use Chrome or Edge in fullscreen (the ⛶ button) on a 16:9 screen for judging.

## Flow (state machine)

```
START → NORMAL_RIDING → CRASH → IMPACT_DETECTED
      → [BLUETOOTH] → [PHONE]            (future Scene 4/5 — skipped until assets exist)
      → PHONE_SIGNAL (crash signal received, UI ref 1)
      → ARE_YOU_OK  (10 s countdown)
          ├─ I'M OK ─────────────→ STATUS_VERIFIED → SAFE_OUTCOME → restart
          └─ NO RESPONSE / timeout → NO_RESPONSE → WAIT_VERIFY (8 s)
               → EMERGENCY_ALERT → GPS_FROM_PHONE → EMERGENCY_CONTACT
               → CALL_SMS → RESPONSE_SIMULATION → END → restart
```

All states live in `src/data/states.js`. Each declares its type (video / ui / route), asset,
next state, available actions, duration, tone colour, sound cue and caption.

## Change or add assets — `src/data/assets.js`

- Swap a video: replace the file in `public/assets/video/` or change its path.
- **Add Scene 4 / Scene 5:** drop the clip in `public/assets/video/` and set
  `bluetooth:` / `phone:` in `ASSETS.video`. The states already exist in the machine
  and start playing automatically once their asset is not `null`.
- Sounds: every cue has a synthesized fallback. Set a file path in `ASSETS.audio` to replace one.
- Timings (countdown, verify wait, GPS search, vehicle travel) are in `CONFIG`.
- If a video file is missing, the app shows a placeholder naming the expected file.

## Structure

```
src/
  components/  CinematicPlayer (2-layer preload + crossfade), PhoneUI, Button (PixelButton/PixelPanel),
               ProgressIndicator (countdown ring), Transition, Hud, Brand, PixelArt, Checkmark,
               VoxelMap (fictional map), AssetPlaceholder
  screens/     StartScreen, SignalReceived, AreYouOk, StatusVerified, SafeOutcome, WaitVerify,
               EmergencyAlert, GPSFromPhone, EmergencyContact, CallSMS, ResponseSimulation, EndScreen
  data/        states.js, assets.js
  hooks/       useSimulation (state machine), useCountdown
  lib/         audio.js (optional sound layer)
  styles/      globals.css (design tokens, HUD), cinematic.css, ui.css
public/assets/ video/, img/, audio/
reference/     UI reference images (not shipped; visual source of truth only)
```

## Product claims

The UI keeps hardware and simulation separate: PITSTOP detects the impact and sends the signal
over Bluetooth (no GPS or cellular hardware); the phone provides GPS, network, call and SMS;
the emergency contact, call/SMS and response vehicle are a simulation of the intended workflow.
No real call, SMS or dispatch happens.

## Controls

Skip scene: button or → key. HUD top-right: sound, fullscreen, restart.
