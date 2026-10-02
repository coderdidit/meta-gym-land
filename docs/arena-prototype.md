# Arena prototype

Open `/#/arena`, or use the Arena link on Minigames. Existing games are unchanged.
The earlier Reach & Flow experiment remains at `/#/movement-lab` for comparison.

## Reuse and implementation

- Uses the existing PhaserGame lifecycle wrapper and Phaser renderer.
- Uses the existing PoseDetWebcam/MediaPipe pipeline and camera selector. The optional
  pose-result callback also serves the earlier prototype.
- Existing legacy pose labels describe held head/arm poses and do not support punches
  or calibrated upper-body duck cycles. Arena therefore has a separate, small recognition adapter;
  it does not replace the detectors controlling older games.
- `src/games/arena/movement.ts`: event bus, calibrated pose adapter and development
  keyboard adapter. Both inputs emit the same action start/end events.
- `src/games/arena/session.ts`: input-independent session rules, statistics, balanced
  shuffled encounter generation, cooldowns, recovery and bounded adaptation.
- `src/games/arena/ArenaScene.ts`: Phaser rendering, animation and session ticking.
- `src/components/movement-lab/Arena.tsx`: setup, session controls, camera, results
  and browser-local history. No backend or paid access is introduced.

## Playtest

1. Enable the webcam and click Start. Stay close to the computer with your head and
   shoulders visible. Sit or stand upright with relaxed arms
   for the automatic three-second countdown to capture neutral calibration. Missing
   or stale tracking resets the countdown; Cancel or Escape stops it. Recalibrate by
   returning to Setup if the camera or neutral position changes. Hips and knees are
   not used. Hands may be outside the frame at rest.
2. Duck for a high shot; dodge away from a glowing lane; hold both hands above the
   shoulders through a charged blast; alternate side punches when the core is open.
3. Return to neutral between movements. A held pose cannot farm repeated actions.
4. Choose 3, 5 or 10 minutes. Losing all health ends the encounter early. Tracking loss
   pauses time and damage. Escape, the Pause button and tab hiding pause the session.
5. Keyboard mode is available only in development: S = duck, arrows = dodge,
   A/D = alternating strikes, Space = shield. Hold defenses through the impact.
6. Finish, record whether you want another round, and export the local JSON results.
   Completed and manually ended sessions are labeled; navigation away is not captured.
   Storage retains the last 50 results, separated by their input-mode field.

There is no music requirement and no audio dependency. The player, sentinel, danger
lanes, projectiles and shield use Phaser vector shapes; no new asset licence is needed.

## Recognition limits

This is a playtest adapter, not validated exercise-form analysis. Ducks require both
head and shoulders to dip relative to calibration; they are not squats. Movement
thresholds use shoulder width, not lower-body landmarks. The internal `SQUAT` event
name is retained for compatibility with earlier prototype results but counts ducks.
Short side punches use arm extension in the camera plane, not forward punching depth. Left
and right follow the existing app's selfie landmark convention. Check this with actual
users and camera framing; synthetic tests cannot establish physical tracking quality.
Counts describe detected actions, not medical or fitness assessments. No calories are
estimated. A block is only counted as successful when held through the blast.

Face and shoulders must remain visible; losing them freezes the session. Missing
hands do not freeze play, but guard recognition needs both wrists and punch recognition
needs that arm's shoulder, elbow and wrist. Off-camera hands cannot award hits.
The director changes timing
only within conservative bounds after five resolved encounters, balances encounter
types and adds recovery after every five. It does not infer fatigue or prescribe exercise.

## Validation questions

- Can a new player read the threat without looking away to instructions?
- Do they understand and trust why they took damage?
- Do attacks feel connected to their movements and the character's response?
- Which actions fail due to tracking rather than player timing?
- Do they choose another round, and return on another day?

Keyboard play validates combat flow only. A real webcam/body playtest is still required
before judging workout feel, comfort, left/right mapping or recognition thresholds.
