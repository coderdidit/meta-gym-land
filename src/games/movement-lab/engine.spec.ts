import { describe, it, expect } from "vitest";
import { MovementRound, calibrate, mapHands } from "./engine";

describe("movement rounds", () => {
  it("freezes target and round time when tracking is lost", () => {
    const round = new MovementRound("gentle");
    round.advance(80, [round.target], true);
    round.advance(5000, [], false);
    expect(round.elapsed).toBe(80);
    expect(round.dwell).toBe(0);
    expect(round.missed).toBe(0);
  });
  it("requires a deliberate touch and cannot farm a held position", () => {
    const round = new MovementRound("gentle");
    const point = round.target;
    round.advance(80, [point], true);
    expect(round.score).toBe(0);
    round.advance(80, [point], true);
    expect(round.completed).toBe(1);
    for (let i = 0; i < 10; i++) round.advance(80, [point], true);
    expect(round.completed).toBe(1);
  });
  it("requires sweep checkpoints in order", () => {
    const round = new MovementRound("focused");
    round.patternIndex = 3;
    round.advance(80, [round.pattern[2]], true);
    expect(round.checkpoint).toBe(0);
    for (const point of round.pattern) round.advance(80, [point], true);
    expect(round.completed).toBe(1);
  });
  it("ends at the round limit and ignores subsequent input", () => {
    const round = new MovementRound("gentle");
    round.elapsed = 59990;
    round.advance(1000, [], true);
    expect(round.elapsed).toBe(60000);
    round.advance(100, [round.target], true);
    expect(round.completed).toBe(0);
  });
});

describe("webcam mapping", () => {
  const pose = Array.from({ length: 33 }, () => ({
    x: 0.5,
    y: 0.5,
    visibility: 1,
  }));
  pose[11] = { x: 0.4, y: 0.5, visibility: 1 };
  pose[12] = { x: 0.6, y: 0.5, visibility: 1 };
  it("calibrates around shoulders and filters unreliable wrists", () => {
    const area = calibrate(pose);
    if (!area) throw new Error("Expected valid calibration");
    const hands = mapHands(pose, area);
    expect(hands[0].x).toBeCloseTo(500);
    expect(
      mapHands(
        pose.map((p, i) => (i === 15 ? { ...p, visibility: 0 } : p)),
        area,
      ),
    ).toHaveLength(1);
    expect(calibrate([])).toBeNull();
    expect(mapHands([], area)).toEqual([]);
  });
});
