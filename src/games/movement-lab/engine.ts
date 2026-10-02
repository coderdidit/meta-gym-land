export type Point = { x: number; y: number };
export type Difficulty = "gentle" | "focused";
export type InputMode = "camera" | "mouse";
export const ROUND_MS = 60_000;
export const FIELD = { width: 1000, height: 600 };

const patterns: Point[][] = [
  [{ x: 260, y: 290 }],
  [{ x: 740, y: 290 }],
  [{ x: 500, y: 160 }],
  [
    { x: 270, y: 390 },
    { x: 390, y: 300 },
    { x: 510, y: 210 },
  ],
  [
    { x: 730, y: 390 },
    { x: 610, y: 300 },
    { x: 490, y: 210 },
  ],
  [{ x: 280, y: 190 }],
  [{ x: 720, y: 190 }],
  [
    { x: 300, y: 330 },
    { x: 500, y: 330 },
    { x: 700, y: 330 },
  ],
];

export const rules = (difficulty: Difficulty) => ({
  radius: difficulty === "gentle" ? 64 : 46,
  targetMs: difficulty === "gentle" ? 4800 : 3400,
});

export class MovementRound {
  elapsed = 0;
  score = 0;
  completed = 0;
  missed = 0;
  combo = 0;
  bestCombo = 0;
  patternIndex = 0;
  checkpoint = 0;
  targetElapsed = 0;
  dwell = 0;
  cooldown = 0;
  feedback = "";
  feedbackMs = 0;
  constructor(public difficulty: Difficulty) {}
  get pattern() {
    return patterns[this.patternIndex % patterns.length];
  }
  get done() {
    return this.elapsed >= ROUND_MS;
  }
  get target() {
    return this.pattern[this.checkpoint];
  }

  advance(dt: number, hands: Point[], active: boolean) {
    if (!active || this.done) {
      this.dwell = 0;
      return;
    }
    // Never award time or hits for a suspended browser frame.
    dt = Math.min(Math.max(dt, 0), 100, ROUND_MS - this.elapsed);
    this.elapsed += dt;
    this.feedbackMs = Math.max(0, this.feedbackMs - dt);
    if (this.cooldown > 0) {
      this.cooldown -= dt;
      return;
    }
    this.targetElapsed += dt;
    const { radius, targetMs } = rules(this.difficulty);
    const touching = hands.some(
      (p) => Math.hypot(p.x - this.target.x, p.y - this.target.y) <= radius,
    );
    this.dwell = touching ? this.dwell + dt : 0;
    if (this.dwell >= (this.pattern.length === 1 ? 140 : 70)) {
      this.dwell = 0;
      this.checkpoint++;
      if (this.checkpoint === this.pattern.length) {
        this.completed++;
        this.combo++;
        this.bestCombo = Math.max(this.bestCombo, this.combo);
        this.score += 100 + Math.min(this.combo - 1, 5) * 10;
        this.next("Nice flow", 350);
      } else {
        this.targetElapsed = 0;
      }
    } else if (this.targetElapsed >= targetMs) {
      this.missed++;
      this.combo = 0;
      this.next("Next one. Keep moving.", 250);
    }
  }

  private next(message: string, cooldown: number) {
    this.patternIndex++;
    this.checkpoint = 0;
    this.targetElapsed = 0;
    this.dwell = 0;
    this.cooldown = cooldown;
    this.feedback = message;
    this.feedbackMs = 900;
  }
}

export type Landmark = { x: number; y: number; visibility?: number };
export type Calibration = {
  cx: number;
  top: number;
  width: number;
  height: number;
};
const visible = (p?: Landmark): p is Landmark =>
  !!p &&
  Number.isFinite(p.x) &&
  Number.isFinite(p.y) &&
  (p.visibility ?? 0) >= 0.6;

export function calibrate(landmarks: Landmark[]): Calibration | null {
  const a = landmarks[11],
    b = landmarks[12];
  if (!visible(a) || !visible(b)) return null;
  const span = Math.abs(a.x - b.x);
  if (span < 0.08 || span > 0.55) return null;
  return {
    cx: (a.x + b.x) / 2,
    top: (a.y + b.y) / 2 - span * 0.9,
    width: span * 2.7,
    height: span * 2,
  };
}

export function mapHands(
  landmarks: Landmark[],
  calibration: Calibration,
): Point[] {
  if (!visible(landmarks[11]) || !visible(landmarks[12])) return [];
  return [landmarks[15], landmarks[16]].filter(visible).map((p) => ({
    // MediaPipe is already in selfie mode: do not mirror a second time.
    x: ((p.x - calibration.cx) / calibration.width + 0.5) * FIELD.width,
    y: ((p.y - calibration.top) / calibration.height) * FIELD.height,
  }));
}
