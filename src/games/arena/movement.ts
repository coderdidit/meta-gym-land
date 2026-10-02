export const ACTIONS = [
  "SQUAT",
  "LEAN_LEFT",
  "LEAN_RIGHT",
  "HANDS_UP",
  "PUNCH_LEFT",
  "PUNCH_RIGHT",
] as const;
export type MovementAction = typeof ACTIONS[number];
export type MovementEvent = { action: MovementAction; active: boolean };
export type PosePoint = { x: number; y: number; visibility?: number };
export type NeutralPose = {
  shoulderY: number;
  headY: number;
  centerX: number;
  shoulderWidth: number;
};

export class MovementBus {
  private listeners = new Set<(event: MovementEvent) => void>();
  emit(event: MovementEvent) {
    this.listeners.forEach((listener) => listener(event));
  }
  subscribe(listener: (event: MovementEvent) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const trackingParts: Array<[string, number[]]> = [
  ["face", [0]],
  ["shoulders", [11, 12]],
];
export function landmarksVisible(points: PosePoint[], indices: number[]) {
  return indices.every(
    (i) =>
      points[i] &&
      Number.isFinite(points[i].x) &&
      Number.isFinite(points[i].y) &&
      (points[i].visibility ?? 0) >= 0.6,
  );
}
export function poseReady(points: PosePoint[]) {
  return trackingParts.every(([, indices]) =>
    landmarksVisible(points, indices),
  );
}
export function neutralPose(p: PosePoint[]): NeutralPose | null {
  if (!poseReady(p)) return null;
  const shoulderY = (p[11].y + p[12].y) / 2;
  const shoulderWidth = Math.abs(p[11].x - p[12].x);
  if (shoulderWidth < 0.08) return null;
  return {
    shoulderY,
    headY: p[0].y,
    centerX: (p[11].x + p[12].x) / 2,
    shoulderWidth,
  };
}

// Recognition emits edges, not a fresh action on every camera frame.
// Return to neutral to re-arm a movement; game rules never live in this class.
export class PoseMovementProvider {
  private active = new Set<MovementAction>();
  private pending = new Map<MovementAction, number>();
  constructor(private bus: MovementBus, private baseline: NeutralPose) {}
  reset() {
    this.active.forEach((action) => this.bus.emit({ action, active: false }));
    this.active.clear();
    this.pending.clear();
  }
  update(p: PosePoint[], now: number) {
    if (!poseReady(p)) {
      this.reset();
      return;
    }
    const b = this.baseline;
    const sy = (p[11].y + p[12].y) / 2;
    const lean = ((p[11].x + p[12].x) / 2 - b.centerX) / b.shoulderWidth;
    const lowered = Math.min(
      (sy - b.shoulderY) / b.shoulderWidth,
      (p[0].y - b.headY) / b.shoulderWidth,
    );
    const handsUp =
      landmarksVisible(p, [15, 16]) &&
      p[15].y < sy - b.shoulderWidth * 0.12 &&
      p[16].y < sy - b.shoulderWidth * 0.12;
    const extended = (s: number, e: number, w: number) => {
      if (!landmarksVisible(p, [s, e, w])) return false;
      const a = p[s],
        c = p[e],
        d = p[w];
      const upper = Math.hypot(a.x - c.x, a.y - c.y);
      const lower = Math.hypot(c.x - d.x, c.y - d.y);
      const reach = Math.hypot(a.x - d.x, a.y - d.y);
      return (
        reach / Math.max(0.001, upper + lower) > 0.9 &&
        Math.abs(d.x - a.x) > b.shoulderWidth * 0.55 &&
        Math.abs(d.y - sy) < b.shoulderWidth * 0.45
      );
    };
    // In selfie mode the screen-left arm follows the app's existing 12/14/16 mapping.
    const conditions: Record<MovementAction, boolean> = {
      // Keep the prototype event name for stored results; this is a duck, not a squat.
      SQUAT: lowered > (this.active.has("SQUAT") ? 0.1 : 0.22),
      LEAN_LEFT: lean < (this.active.has("LEAN_LEFT") ? -0.15 : -0.3),
      LEAN_RIGHT: lean > (this.active.has("LEAN_RIGHT") ? 0.15 : 0.3),
      HANDS_UP: handsUp,
      PUNCH_LEFT: !handsUp && extended(12, 14, 16),
      PUNCH_RIGHT: !handsUp && extended(11, 13, 15),
    };
    for (const action of ACTIONS) {
      if (!conditions[action]) {
        this.pending.delete(action);
        if (this.active.delete(action))
          this.bus.emit({ action, active: false });
      } else if (!this.active.has(action)) {
        const since = this.pending.get(action);
        if (since === undefined) this.pending.set(action, now);
        else if (now - since >= (action.startsWith("PUNCH") ? 60 : 120)) {
          this.active.add(action);
          this.pending.delete(action);
          this.bus.emit({ action, active: true });
        }
      }
    }
  }
}

const keys: Record<string, MovementAction> = {
  KeyS: "SQUAT",
  ArrowLeft: "LEAN_LEFT",
  ArrowRight: "LEAN_RIGHT",
  KeyA: "PUNCH_LEFT",
  KeyD: "PUNCH_RIGHT",
  Space: "HANDS_UP",
};
export function connectKeyboard(bus: MovementBus, target: Window = window) {
  const held = new Set<MovementAction>();
  const down = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement)?.closest?.("input, select, textarea, button"))
      return;
    const action = keys[e.code];
    if (!action) return;
    e.preventDefault();
    if (!held.has(action)) {
      held.add(action);
      bus.emit({ action, active: true });
    }
  };
  const up = (e: KeyboardEvent) => {
    const action = keys[e.code];
    if (action && held.delete(action)) {
      e.preventDefault();
      bus.emit({ action, active: false });
    }
  };
  const release = () => {
    held.forEach((action) => bus.emit({ action, active: false }));
    held.clear();
  };
  target.addEventListener("keydown", down);
  target.addEventListener("keyup", up);
  target.addEventListener("blur", release);
  return () => {
    release();
    target.removeEventListener("keydown", down);
    target.removeEventListener("keyup", up);
    target.removeEventListener("blur", release);
  };
}
