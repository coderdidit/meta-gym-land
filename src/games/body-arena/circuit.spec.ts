import { describe, expect, it } from "vitest";
import { BodyCircuit, frameBody, type CircuitMode } from "./circuit";
import type { PosePoint } from "../arena/movement";

function pose(): PosePoint[] {
  const p = Array.from({ length: 17 }, () => ({
    x: 0.5,
    y: 0.55,
    visibility: 1,
  }));
  p[0] = { x: 0.5, y: 0.25, visibility: 1 };
  p[11] = { x: 0.36, y: 0.45, visibility: 1 };
  p[12] = { x: 0.64, y: 0.45, visibility: 1 };
  p[15] = { x: 0.43, y: 0.62, visibility: 1 };
  p[16] = { x: 0.57, y: 0.62, visibility: 1 };
  return p;
}
function create(mode: CircuitMode = "pulse", duration = 90000) {
  const p = pose();
  const f = frameBody(p, 4 / 3);
  if (!f) throw new Error("Missing framing");
  const c = new BodyCircuit(f, mode, duration);
  c.tick(0, p, true);
  return { c, p };
}
function advance(c: BodyCircuit, p: PosePoint[], ms: number, playable = true) {
  for (let t = 0; t < ms; t += 50) c.tick(Math.min(50, ms - t), p, playable);
}
function touch(c: BodyCircuit, p: PosePoint[], ms = 150) {
  p[c.wrist] = { ...c.target, visibility: 1 };
  advance(c, p, ms);
}

describe("Body-first movement circuit", () => {
  it("calibrates close-range framing without lower-body points", () => {
    expect(frameBody(pose(), 4 / 3)).not.toBeNull();
    expect(frameBody([], 4 / 3)).toBeNull();
    expect(frameBody(pose(), 0)).toBeNull();
    expect(frameBody(pose(), NaN)).toBeNull();
  });
  it("maps left and right wrists from the actual mirrored shoulder positions", () => {
    const p = pose();
    p.forEach((point) => {
      point.x = 1 - point.x;
    });
    expect(frameBody(p, 4 / 3)?.leftWrist).toBe(16);
  });
  it("alternates repeated strikes and requires returning each hand", () => {
    const { c, p } = create();
    touch(c, p);
    expect(c.strikes).toBe(1);
    expect(c.side).toBe(1);
    advance(c, p, 250);
    touch(c, p);
    expect(c.strikes).toBe(2);
    advance(c, p, 300);
    touch(c, p, 500);
    expect(c.strikes).toBe(2);
    p[15] = pose()[15];
    advance(c, p, 100);
    touch(c, p);
    expect(c.strikes).toBe(3);
  });
  it("does not award hits for hidden hands or the wrong hand", () => {
    const { c, p } = create();
    p[16] = { ...c.target, visibility: 1 };
    advance(c, p, 500);
    expect(c.reps).toBe(0);
    p[15] = { ...c.target, visibility: 0 };
    advance(c, p, 500);
    expect(c.reps).toBe(0);
    expect(c.elapsed).toBe(1000);
  });
  it("reach mode requires a continuous two-second hold and resets broken holds", () => {
    const { c, p } = create("reach");
    touch(c, p, 1000);
    expect(c.reaches).toBe(0);
    expect(c.hold).toBe(1000);
    p[15] = pose()[15];
    advance(c, p, 100);
    expect(c.hold).toBe(0);
    touch(c, p, 1900);
    expect(c.reaches).toBe(0);
    advance(c, p, 100);
    expect(c.reaches).toBe(1);
    expect(c.heldMs).toBe(3000);
  });
  it("adds recovery after 20 seconds and advances to a different movement", () => {
    const { c, p } = create();
    advance(c, p, 20000);
    expect(c.exercise).toBe("recover");
    advance(c, p, 6050);
    expect(c.exercise).toBe("weave");
    expect(c.reps).toBe(0);
  });
  it("requires a shoulder shift as well as head contact for weaving", () => {
    const { c, p } = create();
    advance(c, p, 26100);
    p[0] = { ...c.target, visibility: 1 };
    advance(c, p, 300);
    expect(c.weaves).toBe(0);
    p[11].x -= 0.1;
    p[12].x -= 0.1;
    advance(c, p, 200);
    expect(c.weaves).toBe(1);
  });
  it("freezes timing and clears partial holds on pause or lost face tracking", () => {
    const { c, p } = create("reach");
    touch(c, p, 800);
    const elapsed = c.elapsed;
    advance(c, p, 1000, false);
    expect(c.elapsed).toBe(elapsed);
    expect(c.hold).toBe(0);
    c.tick(50000, p, true);
    expect(c.elapsed).toBe(elapsed);
    p[0].visibility = 0;
    advance(c, p, 1000);
    expect(c.elapsed).toBe(elapsed);
  });
  it("does not count long browser frames as seconds of exercise", () => {
    const { c, p } = create();
    c.tick(10000, p, true);
    expect(c.elapsed).toBe(100);
  });
  it("ends at the chosen duration without awarding later movements", () => {
    const { c, p } = create("pulse", 1000);
    advance(c, p, 2000);
    expect(c.done).toBe(true);
    expect(c.elapsed).toBe(1000);
    touch(c, p);
    expect(c.reps).toBe(0);
  });
  it("keeps target rings within different camera aspect ratios", () => {
    for (const aspect of [4 / 3, 16 / 9, 3 / 4]) {
      const f = frameBody(pose(), aspect);
      if (!f) throw new Error("Expected valid camera framing");
      for (const mode of ["pulse", "reach"] as const) {
        const c = new BodyCircuit(f, mode);
        for (const side of [-1, 1] as const) {
          c.side = side;
          expect(c.target.x - c.radius / aspect).toBeGreaterThanOrEqual(0);
          expect(c.target.x + c.radius / aspect).toBeLessThanOrEqual(1);
          expect(c.target.y - c.radius).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});
