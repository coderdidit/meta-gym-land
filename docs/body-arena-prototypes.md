# Mirror Arena and Dark Arena

Routes: `/#/mirror_arena` and `/#/dark_arena`. Original `/#/arena` stays available.
These are two presentations of the same new circuit, not two separate rule engines.

## What to compare

- Mirror puts targets directly over a mirrored live camera image.
- Dark never draws the camera image. It draws a glowing upper-body skeleton with the
  same targets. The camera still runs for tracking; this is not segmentation or a
  photographic silhouette.
- Pulse uses 20-second blocks of repeated alternating strikes, shoulder/head weaves,
  and occasional held reaches, with 6-second recovery blocks.
- Reach prioritizes gentle two-second holds, alternating sides and returning each
  hand toward the chest before repeating. It also includes slow weaves.
- Both have a 90-second trial and 3-minute option. There is no music, beat matching,
  health depletion, or penalty for moving at a comfortable pace.

This tests a more sustained movement loop, not a claim of cardio intensity or an
exercise prescription. No calories, heart rate or exercise-form grading are inferred.

## Controls and calibration

Enable the camera, click Start, then sit or stand neutrally for the three-second
countdown. Face and shoulders establish the frame; hips and knees are never used.
Hands can be out of view at rest, but the matching wrist must be visible to hit a
ring. Hands must return toward the chest between repetitions. A weave requires
both the head to enter the ring and the shoulders to shift, not just a head tilt.
Targets are bounded to the image and use shoulder width and actual camera aspect
ratio. Keep a comfortable range and leave clear space for your arms.

Escape, Pause or hiding the tab pauses. Losing face/shoulder tracking also freezes
the timer and resets partial holds; restored tracking resumes automatically.
Canceling calibration, route changes and unmounting stop their respective work.
The camera button stops the stream when disabled; there is only one visible canvas,
not a separate webcam panel. The existing pose library is unchanged.

The pointer demo uses synthetic upper-body landmarks, no camera permission. Move
onto the ring to test hits/holds; in weave blocks the pointer controls the head and
shoulder shift. Demo mode tests presentation and flow only, not physical recognition.

## Validation data

Completed or explicitly ended trials retain input mode, presentation, circuit,
planned and actual duration, score, strike/weave/reach counts, cumulative detected
hold time, effort feedback and replay intent. Incomplete hold fragments count toward
hold time, but only uninterrupted two-second holds count as completed reaches.
Last 50 trials are browser-local under `mgl-body-arena-trials-v1`; export produces JSON.
Navigation abandonment is not captured. Demo trials are explicitly labeled and must
be excluded from workout comparisons. No video or landmarks are stored or uploaded.
The existing app still loads the pose model from its configured CDN.

Test both presentations with the SAME circuit and duration; vary order between
players. Ask whether motion feels continuous, targets feel reachable, hits feel
trustworthy, and they want to replay. Compare Pulse vs Reach separately from the
Mirror vs Dark presentation comparison.

## Implementation and checks

- `src/games/body-arena/circuit.ts`: pure frame-based session rules and calibration.
- `src/games/body-arena/render.ts`: integrated video/skeleton/targets Canvas renderer.
- `src/components/body-arena/CameraStage.tsx`: existing MediaPipe context, react-webcam
  and cancellable inference loop, with a separate animation loop for smooth drawing.
- `src/components/body-arena/BodyArena.tsx`: setup, lifecycle, results and local export.
- `circuit.spec.ts`: missing/hidden landmarks, mirrored sides, return-to-center,
  alternating repetitions, held reaches, recovery, pause, timing and target bounds.

Live camera alignment, actual effort, comfortable reach and tracking thresholds still
need physical playtests. Synthetic tests and pointer demos cannot establish these.
