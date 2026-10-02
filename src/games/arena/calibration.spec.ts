import { describe, expect, it } from "vitest";
import { ArenaCalibration, calibrationHint } from "./calibration";
import type { PosePoint } from "./movement";

function standing(): PosePoint[] {
  const p = Array.from({ length: 33 }, () => ({
    x: 0.5,
    y: 0.5,
    visibility: 1,
  }));
  p[11].y = p[12].y = 0.3;
  p[11].x = 0.35;
  p[12].x = 0.65;
  p[0].y = 0.15;
  p[23].y = p[24].y = 0.6;
  p[25].y = p[26].y = 0.8;
  return p;
}

describe("Arena start calibration", () => {
  it("explains missing shoulders instead of silently disabling start", () => {
    const p = standing();
    p[11].visibility = p[12].visibility = 0.1;
    expect(calibrationHint(p, 100, 100)).toContain("shoulders");
    expect(new ArenaCalibration().update(p, 100, 100).baseline).toBeNull();
  });
  it("distinguishes loading, stalled tracking, no body and invalid stance", () => {
    expect(calibrationHint([], null, 100)).toContain("pose detector");
    expect(calibrationHint(standing(), 100, 601)).toContain("fresh tracking");
    expect(calibrationHint([], 100, 100)).toContain("No upper body");
    const p = standing();
    p[11].x = p[12].x = 0.5;
    expect(calibrationHint(p, 100, 100)).toContain("both shoulders");
  });
  it("starts automatically after three seconds with only the upper body visible", () => {
    const c = new ArenaCalibration();
    expect(c.update([], 0, 0).baseline).toBeNull();
    const p = standing();
    for (let i = 13; i < p.length; i++) p[i].visibility = 0;
    expect(c.update(p, 1000, 1000).seconds).toBe(3);
    for (let t = 1100; t < 4000; t += 100)
      expect(c.update(p, t, t).baseline).toBeNull();
    expect(c.update(p, 4000, 4000).baseline).not.toBeNull();
  });
  it("resets the countdown on tracking loss, raised hands and cancellation", () => {
    const c = new ArenaCalibration();
    const p = standing();
    c.update(p, 0, 0);
    c.update(p, 1000, 1000);
    expect(c.update(p, 1000, 1600).baseline).toBeNull();
    expect(c.update(p, 1700, 1700).seconds).toBe(3);
    p[15].y = 0.1;
    expect(c.update(p, 1800, 1800).hint).toContain("Lower both hands");
    p[15].y = 0.5;
    expect(c.update(p, 2000, 2000).seconds).toBe(3);
    c.reset();
    expect(c.update(p, 4000, 4000).seconds).toBe(3);
  });
});
