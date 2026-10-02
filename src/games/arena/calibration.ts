import {
  neutralPose,
  landmarksVisible,
  trackingParts,
  type PosePoint,
} from "./movement";

export function calibrationHint(
  points: PosePoint[],
  receivedAt: number | null,
  now: number,
) {
  if (receivedAt === null)
    return "Waiting for the pose detector. Loading can take a few seconds.";
  if (now - receivedAt >= 500)
    return "Waiting for fresh tracking. Check that the webcam is still running.";
  if (!points.length)
    return "No upper body detected. Face the camera with your head and shoulders in view.";
  const missing = trackingParts
    .filter(([, indices]) => !landmarksVisible(points, indices))
    .map(([name]) => name);
  if (missing.length)
    return `Not clearly visible: ${missing.join(
      ", ",
    )}. Adjust the camera to frame your head and shoulders.`;
  if (!neutralPose(points))
    return "Face the camera with both shoulders visible, sitting or standing upright.";
  const shoulderY = (points[11].y + points[12].y) / 2;
  if (
    [15, 16].some(
      (i) => landmarksVisible(points, [i]) && points[i].y < shoulderY,
    )
  )
    return "Lower both hands and sit or stand upright for calibration.";
  return null;
}

// Countdown only advances while fresh, usable neutral-pose results keep arriving.
export class ArenaCalibration {
  private since: number | null = null;
  reset() {
    this.since = null;
  }
  update(points: PosePoint[], receivedAt: number | null, now: number) {
    const hint = calibrationHint(points, receivedAt, now);
    if (hint) {
      this.reset();
      return { hint, seconds: 3, baseline: null };
    }
    if (this.since === null) this.since = now;
    const seconds = Math.max(0, Math.ceil((3000 - (now - this.since)) / 1000));
    return {
      hint: `Hold still, arms relaxed. Starting in ${seconds}...`,
      seconds,
      baseline: seconds === 0 ? neutralPose(points) : null,
    };
  }
}
