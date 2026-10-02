import { describe, expect, it } from "vitest";
import {
  MovementBus,
  PoseMovementProvider,
  neutralPose,
  poseReady,
} from "./movement";
import type { MovementEvent, PosePoint } from "./movement";

function upperBody(): PosePoint[] {
  // Deliberately omit every lower-body landmark.
  const p = Array.from({ length: 17 }, () => ({
    x: 0.5,
    y: 0.5,
    visibility: 1,
  }));
  p[0] = { x: 0.5, y: 0.15, visibility: 1 };
  p[11] = { x: 0.35, y: 0.35, visibility: 1 };
  p[12] = { x: 0.65, y: 0.35, visibility: 1 };
  p[13] = { x: 0.3, y: 0.46, visibility: 1 };
  p[14] = { x: 0.7, y: 0.46, visibility: 1 };
  p[15] = { x: 0.37, y: 0.58, visibility: 1 };
  p[16] = { x: 0.63, y: 0.58, visibility: 1 };
  return p;
}
function provider(p: PosePoint[]) {
  const baseline = neutralPose(p);
  if (!baseline) throw new Error("Expected upper-body calibration");
  const events: MovementEvent[] = [];
  const bus = new MovementBus();
  bus.subscribe((e) => events.push(e));
  return { detector: new PoseMovementProvider(bus, baseline), events };
}

describe("Close-range upper-body controls", () => {
  it("calibrates without hips, knees or visible hands", () => {
    const p = upperBody();
    for (let i = 13; i <= 16; i++) p[i].visibility = 0;
    expect(poseReady(p)).toBe(true);
    expect(neutralPose(p)?.shoulderWidth).toBeCloseTo(0.3);
  });
  it("recognizes a head-and-shoulder duck, not a nod, and rearms on neutral", () => {
    const p = upperBody();
    const { detector, events } = provider(p);
    p[0].y += 0.09;
    detector.update(p, 0);
    detector.update(p, 200);
    expect(events).toEqual([]);
    p[11].y += 0.09;
    p[12].y += 0.09;
    detector.update(p, 300);
    detector.update(p, 500);
    expect(events).toContainEqual({ action: "SQUAT", active: true });
    detector.update(upperBody(), 600);
    expect(events).toContainEqual({ action: "SQUAT", active: false });
  });
  it.each([
    [-0.12, "LEAN_LEFT"],
    [0.12, "LEAN_RIGHT"],
  ] as const)("recognizes shoulder lean %s", (offset, action) => {
    const p = upperBody();
    const { detector, events } = provider(p);
    p.forEach((point) => {
      point.x += offset;
    });
    detector.update(p, 0);
    detector.update(p, 200);
    expect(events).toContainEqual({ action, active: true });
  });
  it.each([
    [12, 14, 16, 0.9, "PUNCH_LEFT"],
    [11, 13, 15, 0.1, "PUNCH_RIGHT"],
  ] as const)(
    "recognizes short arm extension on shoulder %s",
    (shoulder, elbow, wrist, x, action) => {
      const p = upperBody();
      const { detector, events } = provider(p);
      p[elbow] = { x: (p[shoulder].x + x) / 2, y: 0.35, visibility: 1 };
      p[wrist] = { x, y: 0.35, visibility: 1 };
      detector.update(p, 0);
      detector.update(p, 200);
      expect(events).toContainEqual({ action, active: true });
      p[wrist].visibility = 0;
      detector.update(p, 300);
      expect(poseReady(p)).toBe(true);
      expect(events.at(-1)).toEqual({ action, active: false });
    },
  );
  it("does not infer a shield from hidden wrists and resets when the face is lost", () => {
    const p = upperBody();
    const { detector, events } = provider(p);
    p[15].y = p[16].y = 0.2;
    p[15].visibility = p[16].visibility = 0;
    detector.update(p, 0);
    detector.update(p, 200);
    expect(events).toEqual([]);
    p[15].visibility = p[16].visibility = 1;
    detector.update(p, 300);
    detector.update(p, 500);
    expect(events).toContainEqual({ action: "HANDS_UP", active: true });
    p[0].visibility = 0;
    detector.update(p, 600);
    expect(poseReady(p)).toBe(false);
    expect(events.at(-1)).toEqual({ action: "HANDS_UP", active: false });
  });
});
