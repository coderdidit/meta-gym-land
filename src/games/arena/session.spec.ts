import { describe, expect, it } from "vitest";
import { ArenaSession, EncounterDirector, ENCOUNTERS } from "./session";
import { MovementBus, neutralPose, PoseMovementProvider } from "./movement";
import type { MovementEvent, PosePoint } from "./movement";

function advance(s: ArenaSession, ms: number) {
  for (let t = 0; t < ms; t += 50) s.tick(Math.min(50, ms - t), true);
}
function encounter(type: typeof ENCOUNTERS[number]) {
  const s = new ArenaSession(180000);
  s.director.next = () => type;
  advance(s, 3000);
  return s;
}

describe("Arena encounters", () => {
  it("resolves a fresh held duck and freezes completely on tracking loss", () => {
    const s = encounter("HIGH_PROJECTILE");
    s.movement({ action: "SQUAT", active: true });
    const elapsed = s.elapsed;
    s.tick(5000, false);
    expect(s.elapsed).toBe(elapsed);
    expect(s.health).toBe(100);
    s.tick(50, true);
    s.movement({ action: "SQUAT", active: true });
    advance(s, 4000);
    expect(s.success).toBe(1);
    expect(s.movements.SQUAT).toBe(2);
  });
  it("does not reward a pose held before the encounter began", () => {
    const s = new ArenaSession(180000);
    s.director.next = () => "HIGH_PROJECTILE";
    s.tick(50, true);
    s.movement({ action: "SQUAT", active: true });
    advance(s, 7000);
    expect(s.failed).toBe(1);
    expect(s.health).toBe(90);
  });
  it("requires a sustained guard for the charged blast", () => {
    const s = encounter("BLOCK_ATTACK");
    s.movement({ action: "HANDS_UP", active: true });
    advance(s, 4000);
    expect(s.blockCount).toBe(1);
    const short = encounter("BLOCK_ATTACK");
    advance(short, 3750);
    short.movement({ action: "HANDS_UP", active: true });
    advance(short, 150);
    expect(short.failed).toBe(1);
  });
  it("only damages an exposed enemy with alternating, distinct punches", () => {
    const s = encounter("VULNERABLE_ENEMY");
    s.movement({ action: "PUNCH_LEFT", active: true });
    expect(s.enemyHealth).toBe(100);
    s.movement({ action: "PUNCH_LEFT", active: false });
    advance(s, 3300);
    s.movement({ action: "PUNCH_LEFT", active: true });
    expect(s.enemyHealth).toBe(90);
    s.movement({ action: "PUNCH_LEFT", active: true });
    s.movement({ action: "PUNCH_LEFT", active: false });
    advance(s, 400);
    s.movement({ action: "PUNCH_LEFT", active: true });
    expect(s.enemyHealth).toBe(90);
    s.movement({ action: "PUNCH_RIGHT", active: true });
    expect(s.enemyHealth).toBe(80);
    advance(s, 3300);
    expect(s.success).toBe(1);
  });
  it("ends at the selected duration and ignores late input", () => {
    const s = new ArenaSession(1000);
    advance(s, 1200);
    expect(s.done).toBe(true);
    expect(s.elapsed).toBe(1000);
    s.movement({ action: "PUNCH_LEFT", active: true });
    expect(s.movements.PUNCH_LEFT).toBe(0);
  });
});

describe("EncounterDirector", () => {
  it("balances each bag, avoids consecutive repeats and bounds adaptation", () => {
    const d = new EncounterDirector(() => 0.42);
    const events = Array.from({ length: 20 }, () => d.next());
    for (let i = 0; i < events.length; i += 5)
      expect(new Set(events.slice(i, i + 5)).size).toBe(5);
    expect(events.every((e, i) => i === 0 || events[i - 1] !== e)).toBe(true);
    for (let i = 0; i < 100; i++) d.record(true);
    expect(d.level).toBe(3);
    expect(d.telegraphMs).toBeGreaterThan(2500);
    for (let i = 0; i < 100; i++) d.record(false);
    expect(d.level).toBe(0);
  });
});

describe("Pose movement edges", () => {
  it("debounces a raised guard, counts once per hold and resets on lost visibility", () => {
    const p: PosePoint[] = Array.from({ length: 33 }, () => ({
      x: 0.5,
      y: 0.5,
      visibility: 1,
    }));
    p[11] = { x: 0.4, y: 0.3, visibility: 1 };
    p[12] = { x: 0.6, y: 0.3, visibility: 1 };
    p[23].y = p[24].y = 0.6;
    p[25].y = p[26].y = 0.8;
    const baseline = neutralPose(p);
    if (!baseline) throw new Error("Expected neutral calibration");
    const bus = new MovementBus(),
      events: MovementEvent[] = [];
    const unsubscribe = bus.subscribe((e) => events.push(e));
    const provider = new PoseMovementProvider(bus, baseline);
    p[15].y = p[16].y = 0.1;
    provider.update(p, 0);
    provider.update(p, 200);
    provider.update(p, 400);
    expect(
      events.filter((e) => e.action === "HANDS_UP" && e.active),
    ).toHaveLength(1);
    provider.update([], 500);
    expect(events.at(-1)).toEqual({ action: "HANDS_UP", active: false });
    unsubscribe();
    provider.update(p, 600);
    provider.update(p, 800);
    expect(events).toHaveLength(2);
  });
});
