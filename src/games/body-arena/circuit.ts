import { landmarksVisible, poseReady, type PosePoint } from "../arena/movement";

export type Presentation = "mirror" | "dark";
export type CircuitMode = "pulse" | "reach";
export type Exercise = "strike" | "weave" | "reach" | "recover";
export type Point = { x: number; y: number };
export type Framing = {
  center: number;
  shoulderY: number;
  headY: number;
  span: number;
  aspect: number;
  leftWrist: number;
  rightWrist: number;
};
const clamp = (n: number, low: number, high: number) =>
  Math.max(low, Math.min(high, n));

export function frameBody(p: PosePoint[], aspect: number): Framing | null {
  if (!poseReady(p) || !Number.isFinite(aspect) || aspect <= 0) return null;
  const span = Math.abs(p[11].x - p[12].x);
  if (span < 0.08) return null;
  return {
    center: (p[11].x + p[12].x) / 2,
    shoulderY: (p[11].y + p[12].y) / 2,
    headY: p[0].y,
    span,
    aspect,
    leftWrist: p[11].x < p[12].x ? 15 : 16,
    rightWrist: p[11].x < p[12].x ? 16 : 15,
  };
}
export const instructions: Record<Exercise, { title: string; detail: string }> =
  {
    strike: {
      title: "Strike. Return. Switch.",
      detail:
        "Alternate hands into the rings. Return each hand toward your chest.",
    },
    weave: {
      title: "Keep moving side to side.",
      detail:
        "Move your head and shoulders into each gate. Stay at a comfortable pace.",
    },
    reach: {
      title: "Reach gently. Hold. Release.",
      detail:
        "Place the matching hand in the ring for two seconds. Do not force your range.",
    },
    recover: {
      title: "Release your arms.",
      detail: "Breathe and reset. The next movement is coming.",
    },
  };

export class BodyCircuit {
  elapsed = 0;
  reps = 0;
  strikes = 0;
  weaves = 0;
  reaches = 0;
  heldMs = 0;
  movingMs = 0;
  hold = 0;
  score = 0;
  flash = 0;
  side: -1 | 1 = -1;
  private stageIndex = 0;
  private stageElapsed = 0;
  private dwell = 0;
  private armed = new Set<number>();
  private cooldown = 0;
  private active = false;
  private plan: Exercise[];
  constructor(
    public framing: Framing,
    public mode: CircuitMode,
    public duration = 90000,
  ) {
    this.plan =
      mode === "pulse"
        ? ["strike", "weave", "strike", "reach"]
        : ["reach", "reach", "weave", "reach"];
  }
  get done() {
    return this.elapsed >= this.duration;
  }
  get remaining() {
    return Math.max(0, this.duration - this.elapsed);
  }
  get exercise(): Exercise {
    return this.stageIndex % 2
      ? "recover"
      : this.plan[Math.floor(this.stageIndex / 2) % this.plan.length];
  }
  get blockDuration() {
    return this.exercise === "recover" ? 6000 : 20000;
  }
  get blockRemaining() {
    return this.blockDuration - this.stageElapsed;
  }
  get wrist() {
    return this.side === -1 ? this.framing.leftWrist : this.framing.rightWrist;
  }
  get radius() {
    return (
      this.framing.span *
      this.framing.aspect *
      (this.exercise === "weave" ? 0.24 : 0.22)
    );
  }
  get target(): Point {
    const f = this.framing;
    const reach = this.exercise === "reach";
    const xOffset = this.exercise === "weave" ? 0.35 : reach ? 0.75 : 0.85;
    const r = this.radius;
    return {
      x: clamp(
        f.center + this.side * f.span * xOffset,
        r / f.aspect + 0.02,
        1 - r / f.aspect - 0.02,
      ),
      y: clamp(
        this.exercise === "weave"
          ? f.headY
          : f.shoulderY - (reach ? 0.6 : 0.05) * f.span * f.aspect,
        r + 0.03,
        1 - r - 0.03,
      ),
    };
  }
  get holdProgress() {
    return this.exercise === "reach" ? Math.min(1, this.hold / 2000) : 0;
  }
  private distance(a: Point, b: Point) {
    return Math.hypot((a.x - b.x) * this.framing.aspect, a.y - b.y);
  }
  private home(p: PosePoint) {
    const f = this.framing;
    return (
      Math.abs(p.x - f.center) < f.span * 0.6 &&
      Math.abs(p.y - f.shoulderY) < f.span * f.aspect * 0.85
    );
  }
  suspend() {
    this.active = false;
    this.dwell = 0;
    this.hold = 0;
    this.armed.clear();
  }
  tick(delta: number, points: PosePoint[], playable: boolean) {
    if (this.done) return;
    if (!playable || !poseReady(points)) {
      this.suspend();
      return;
    }
    // Never count a suspended frame as exercise or held time.
    const dt = this.active
      ? Math.min(100, Math.max(0, delta), this.remaining)
      : 0;
    this.active = true;
    this.elapsed += dt;
    this.stageElapsed += dt;
    this.flash = Math.max(0, this.flash - dt);
    this.cooldown = Math.max(0, this.cooldown - dt);
    if (this.done) return;
    if (this.stageElapsed >= this.blockDuration) {
      this.stageElapsed = 0;
      this.stageIndex++;
      this.side = -1;
      this.suspend();
      this.cooldown = 0;
      return;
    }
    if (this.exercise === "recover") return;
    for (const wrist of [this.framing.leftWrist, this.framing.rightWrist]) {
      if (!landmarksVisible(points, [wrist])) this.armed.delete(wrist);
      else if (
        this.home(points[wrist]) &&
        this.distance(points[wrist], this.target) > this.radius * 1.3
      )
        this.armed.add(wrist);
    }
    const index = this.exercise === "weave" ? 0 : this.wrist;
    const touching =
      landmarksVisible(points, [index]) &&
      this.distance(points[index], this.target) <= this.radius;
    const shouldersShift =
      ((points[11].x + points[12].x) / 2 - this.framing.center) * this.side;
    const valid =
      touching &&
      (this.exercise === "weave"
        ? shouldersShift > this.framing.span * 0.12
        : this.armed.has(index));
    if (valid && this.cooldown === 0) {
      this.dwell += dt;
      if (this.exercise === "reach") {
        this.hold += dt;
        this.heldMs += dt;
      }
      this.movingMs += dt;
      if (this.dwell >= (this.exercise === "reach" ? 2000 : 100)) {
        this.reps++;
        this.score += this.exercise === "reach" ? 200 : 100;
        if (this.exercise === "reach") this.reaches++;
        else if (this.exercise === "weave") this.weaves++;
        else this.strikes++;
        this.armed.delete(index);
        this.side = this.side === -1 ? 1 : -1;
        this.flash = 400;
        this.cooldown = 180;
        this.dwell = 0;
        this.hold = 0;
      }
    } else {
      this.dwell = 0;
      this.hold = 0;
    }
  }
}
