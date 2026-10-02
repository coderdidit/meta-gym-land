import { ACTIONS, MovementAction, MovementEvent } from "./movement";
export type Encounter =
  | "HIGH_PROJECTILE"
  | "LEFT_ATTACK"
  | "RIGHT_ATTACK"
  | "BLOCK_ATTACK"
  | "VULNERABLE_ENEMY";
export const ENCOUNTERS: Encounter[] = [
  "HIGH_PROJECTILE",
  "LEFT_ATTACK",
  "RIGHT_ATTACK",
  "BLOCK_ATTACK",
  "VULNERABLE_ENEMY",
];
export const encounterText: Record<Encounter, { title: string; hint: string }> =
  {
    HIGH_PROJECTILE: { title: "HIGH SHOT", hint: "Duck under the beam" },
    LEFT_ATTACK: { title: "LEFT LANE IN DANGER", hint: "Dodge right" },
    RIGHT_ATTACK: { title: "RIGHT LANE IN DANGER", hint: "Dodge left" },
    BLOCK_ATTACK: {
      title: "CHARGED BLAST",
      hint: "Raise both hands. Hold your shield.",
    },
    VULNERABLE_ENEMY: {
      title: "CORE EXPOSED",
      hint: "Strike! Alternate left and right.",
    },
  };
const defense: Partial<Record<Encounter, MovementAction>> = {
  HIGH_PROJECTILE: "SQUAT",
  LEFT_ATTACK: "LEAN_RIGHT",
  RIGHT_ATTACK: "LEAN_LEFT",
  BLOCK_ATTACK: "HANDS_UP",
};

export class EncounterDirector {
  private bag: Encounter[] = [];
  private last: Encounter | undefined;
  private recent: boolean[] = [];
  level = 0;
  constructor(private random = Math.random) {}
  next(): Encounter {
    if (!this.bag.length) {
      this.bag = [...ENCOUNTERS];
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(this.random() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
      if (this.bag[0] === this.last)
        [this.bag[0], this.bag[1]] = [this.bag[1], this.bag[0]];
    }
    this.last = this.bag.shift();
    return this.last as Encounter;
  }
  record(success: boolean) {
    this.recent.push(success);
    if (this.recent.length < 5) return;
    const rate = this.recent.filter(Boolean).length / this.recent.length;
    if (rate >= 0.8) this.level = Math.min(3, this.level + 1);
    if (rate <= 0.4) this.level = Math.max(0, this.level - 1);
    this.recent = [];
  }
  get telegraphMs() {
    return 3300 - this.level * 250;
  }
  get recoveryMs() {
    return 2100 - this.level * 150;
  }
}

export class ArenaSession {
  elapsed = 0;
  health = 100;
  enemyHealth = 100;
  defeated = 0;
  score = 0;
  combo = 0;
  bestCombo = 0;
  success = 0;
  failed = 0;
  blockCount = 0;
  movements = Object.fromEntries(ACTIONS.map((a) => [a, 0])) as Record<
    MovementAction,
    number
  >;
  active = new Set<MovementAction>();
  encounter: Encounter | null = null;
  encounterElapsed = 0;
  encounterDuration = 0;
  stage: "recovery" | "telegraph" | "attack" = "recovery";
  message = "Guard up. The sentinel is waking.";
  feedbackTime = 0;
  hitFlash = 0;
  private rest = 3000;
  private hold = 0;
  private engaged = false;
  private strikes = 0;
  private lastPunch: MovementAction | null = null;
  private lastPunchAt = -1000;
  private inputEnabled = false;
  constructor(
    public duration: number,
    public director = new EncounterDirector(),
  ) {}
  get done() {
    return this.elapsed >= this.duration || this.health <= 0;
  }
  get remaining() {
    return Math.max(0, this.duration - this.elapsed);
  }
  clearInput() {
    this.active.clear();
    this.hold = 0;
    this.engaged = false;
    this.inputEnabled = false;
  }
  movement(event: MovementEvent) {
    if (!event.active) {
      this.active.delete(event.action);
      return;
    }
    if (!this.inputEnabled || this.done || this.active.has(event.action))
      return;
    this.active.add(event.action);
    this.movements[event.action]++;
    if (!this.encounter) return;
    if (defense[this.encounter] === event.action) this.engaged = true;
    if (
      this.encounter === "VULNERABLE_ENEMY" &&
      this.stage === "attack" &&
      event.action.startsWith("PUNCH")
    ) {
      if (
        event.action === this.lastPunch ||
        this.elapsed - this.lastPunchAt < 300 ||
        this.strikes >= 4
      )
        return;
      this.lastPunch = event.action;
      this.lastPunchAt = this.elapsed;
      this.strikes++;
      this.damageEnemy(10);
      this.score += 25;
      this.hitFlash = 250;
      this.message = "HIT! Switch sides.";
      this.feedbackTime = 650;
    }
  }
  tick(dt: number, playable: boolean) {
    if (!playable || this.done) {
      this.clearInput();
      return;
    }
    this.inputEnabled = true;
    dt = Math.min(100, Math.max(0, dt), this.remaining);
    this.elapsed += dt;
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.feedbackTime = Math.max(0, this.feedbackTime - dt);
    if (this.done) return;
    if (this.stage === "recovery") {
      this.rest -= dt;
      if (this.rest <= 0) this.begin();
      return;
    }
    this.encounterElapsed += dt;
    const required = this.encounter ? defense[this.encounter] : undefined;
    this.hold =
      required && this.active.has(required) && this.engaged
        ? this.hold + dt
        : 0;
    if (this.encounterElapsed < this.encounterDuration) return;
    if (this.stage === "telegraph") {
      this.stage = "attack";
      this.encounterElapsed = 0;
      this.encounterDuration =
        this.encounter === "VULNERABLE_ENEMY" ? 3600 : 550;
      return;
    }
    this.resolve(
      this.encounter === "VULNERABLE_ENEMY"
        ? this.strikes >= 2
        : this.hold >= (this.encounter === "BLOCK_ATTACK" ? 650 : 120),
    );
  }
  private begin() {
    this.encounter = this.director.next();
    this.stage = "telegraph";
    this.encounterElapsed = 0;
    this.encounterDuration = this.director.telegraphMs;
    this.hold = 0;
    this.engaged = false;
    this.strikes = 0;
    this.lastPunch = null;
    // Require a fresh movement for each encounter, not a pose held all session.
    this.message = encounterText[this.encounter].hint;
  }
  private resolve(success: boolean) {
    if (success) {
      this.success++;
      this.combo++;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      this.score += 100 + Math.min(this.combo, 5) * 20;
      if (this.encounter === "BLOCK_ATTACK") this.blockCount++;
      if (this.encounter !== "VULNERABLE_ENEMY") this.damageEnemy(8);
      this.message =
        this.encounter === "VULNERABLE_ENEMY"
          ? "DIRECT HIT. Well played."
          : "EVADED. Your turn is coming.";
    } else {
      this.failed++;
      this.combo = 0;
      this.health = Math.max(0, this.health - 10);
      this.message = "HIT TAKEN. Reset your stance.";
    }
    this.feedbackTime = 1900;
    this.director.record(success);
    this.stage = "recovery";
    this.encounter = null;
    this.rest = this.director.recoveryMs;
    // A little recovery after every fifth encounter keeps longer rounds bounded.
    if ((this.success + this.failed) % 5 === 0) {
      this.rest += 5000;
      this.message = "RECOVER. Lower your arms and breathe.";
      this.feedbackTime = this.rest;
    }
  }
  private damageEnemy(amount: number) {
    this.enemyHealth = Math.max(0, this.enemyHealth - amount);
    if (this.enemyHealth === 0) {
      this.defeated++;
      this.enemyHealth = 100;
      this.score += 300;
      this.health = Math.min(100, this.health + 15);
    }
  }
}
