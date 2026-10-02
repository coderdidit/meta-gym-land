import Phaser from "phaser";
import { ArenaSession, encounterText } from "./session";

export interface ArenaBridge {
  session: ArenaSession | null;
  playable: boolean;
  onFrame: (session: ArenaSession) => void;
}

export function arenaConfig(bridge: ArenaBridge): Phaser.Types.Core.GameConfig {
  class ArenaScene extends Phaser.Scene {
    private ink!: Phaser.GameObjects.Graphics;
    private title!: Phaser.GameObjects.Text;
    private hint!: Phaser.GameObjects.Text;
    private label!: Phaser.GameObjects.Text;
    private lastUi = 0;
    constructor() {
      super("arena-prototype");
    }
    create() {
      this.ink = this.add.graphics();
      this.title = this.add
        .text(500, 60, "THE SENTINEL", {
          fontFamily: "Georgia",
          fontSize: "32px",
          color: "#f7ebd7",
        })
        .setOrigin(0.5);
      this.hint = this.add
        .text(500, 110, "Your body is the controller.", {
          fontFamily: "sans-serif",
          fontSize: "21px",
          color: "#a8c8c7",
        })
        .setOrigin(0.5);
      this.label = this.add
        .text(500, 530, "", {
          fontFamily: "sans-serif",
          fontSize: "17px",
          color: "#d7e6df",
        })
        .setOrigin(0.5);
    }
    update(time: number, delta: number) {
      const s = bridge.session;
      if (s) {
        s.tick(delta, bridge.playable);
        if (time - this.lastUi > 100 || s.done) {
          this.lastUi = time;
          bridge.onFrame(s);
        }
      }
      const g = this.ink;
      g.clear();
      g.fillGradientStyle(0x112b3b, 0x18243e, 0x102d32, 0x0b1c2b, 1);
      g.fillRect(0, 0, 1000, 600);
      // Arena floor and perspective lanes give body dodges a visible destination.
      g.fillStyle(0x183c42);
      g.fillEllipse(500, 460, 880, 190);
      g.lineStyle(2, 0x426168, 0.5);
      g.strokeEllipse(500, 460, 880, 190);
      for (const x of [85, 180, 295, 425, 590, 770, 920])
        g.lineBetween(500, 350, x, 550);
      g.lineStyle(1, 0x69818a, 0.15);
      for (let y = 220; y < 420; y += 45) g.lineBetween(40, y, 960, y);
      const current = s?.encounter;
      const attacking = s?.stage === "attack";
      const pulse = 0.2 + 0.12 * Math.sin(time / 130);
      if (current === "LEFT_ATTACK" || current === "RIGHT_ATTACK") {
        const x = current === "LEFT_ATTACK" ? 80 : 255;
        g.fillStyle(0xff755f, attacking ? 0.65 : pulse);
        g.fillRoundedRect(x, 330, 150, 180, 14);
        g.lineStyle(2, 0xff755f, 0.8);
        g.strokeRoundedRect(x, 330, 150, 180, 14);
      }
      if (current === "HIGH_PROJECTILE") {
        g.fillStyle(0xffc779, attacking ? 0.6 : pulse);
        g.fillRect(80, 264, 730, 12);
        g.lineStyle(1, 0xffc779, 0.7);
        g.lineBetween(80, 270, 810, 270);
      }
      const active = s?.active;
      const squatting = active?.has("SQUAT");
      const px =
        235 +
        (active?.has("LEAN_LEFT") ? -80 : active?.has("LEAN_RIGHT") ? 80 : 0);
      const py = squatting ? 345 : 275;
      // Player: bright gloves, face and articulated limbs, drawn without new assets.
      g.fillStyle(0x06151c, 0.6);
      g.fillEllipse(px, 458, 115, 23);
      g.lineStyle(17, 0x74b8c0);
      g.lineBetween(px - 18, py + 97, px - 30, 447);
      g.lineBetween(px + 18, py + 97, px + 30, 447);
      g.fillStyle(0x43d9bf);
      g.fillRoundedRect(px - 36, py + 35, 72, 85, 16);
      g.fillStyle(0xf4e5c7);
      g.fillCircle(px, py, 32);
      g.fillStyle(0x173645);
      g.fillRoundedRect(px - 23, py - 12, 46, 20, 8);
      g.fillStyle(0x43d9bf);
      g.fillCircle(px - 10, py - 2, 4);
      g.fillCircle(px + 10, py - 2, 4);
      const guarding = active?.has("HANDS_UP");
      const lp = active?.has("PUNCH_LEFT"),
        rp = active?.has("PUNCH_RIGHT");
      const left = {
        x: guarding ? px - 47 : lp ? px + 115 : px - 58,
        y: guarding ? py - 35 : py + 60,
      };
      const right = {
        x: guarding ? px + 47 : rp ? px + 125 : px + 58,
        y: guarding ? py - 35 : py + 65,
      };
      g.lineStyle(13, 0x87b8c0);
      g.lineBetween(px - 25, py + 47, left.x, left.y);
      g.lineBetween(px + 25, py + 47, right.x, right.y);
      g.fillStyle(0xffc779);
      g.fillCircle(left.x, left.y, 16);
      g.fillStyle(0xf28aa3);
      g.fillCircle(right.x, right.y, 16);
      if (guarding) {
        g.lineStyle(5, 0x6ff9e4, 0.85);
        g.strokeEllipse(px, py + 35, 180, 190);
        g.fillStyle(0x6ff9e4, 0.09);
        g.fillEllipse(px, py + 35, 180, 190);
      }
      // The enemy visibly opens its core during attack opportunities.
      const ex = 765 + (s?.hitFlash ? Math.sin(time) * 6 : 0);
      const ey = 290 + Math.sin(time / 550) * 6;
      const vulnerable = current === "VULNERABLE_ENEMY" && attacking;
      g.fillStyle(0x07131e, 0.6);
      g.fillEllipse(ex, 452, 155, 25);
      g.lineStyle(22, 0x668293);
      g.lineBetween(ex - 33, ey + 75, ex - 52, 435);
      g.lineBetween(ex + 33, ey + 75, ex + 52, 435);
      g.fillStyle(s?.hitFlash ? 0xffffff : 0x48667e);
      g.fillRoundedRect(ex - 63, ey - 28, 126, 123, 22);
      g.fillStyle(0x9bb8c9);
      g.fillRoundedRect(ex - 48, ey - 85, 96, 66, 17);
      g.fillStyle(0x142336);
      g.fillRoundedRect(ex - 35, ey - 66, 70, 24, 6);
      g.fillStyle(0xff755f);
      g.fillRect(ex - 25, ey - 58, 17, 5);
      g.fillRect(ex + 8, ey - 58, 17, 5);
      g.lineStyle(23, 0x668293);
      g.lineBetween(ex - 60, ey, ex - 110, ey + 55);
      g.lineBetween(ex + 60, ey, ex + 100, ey + 45);
      g.fillStyle(vulnerable ? 0xffc779 : 0x173442);
      g.fillCircle(ex, ey + 28, vulnerable ? 32 + Math.sin(time / 90) * 3 : 21);
      g.lineStyle(3, vulnerable ? 0xffe6ae : 0x6e97a1);
      g.strokeCircle(ex, ey + 28, 32);
      if (current === "BLOCK_ATTACK") {
        g.fillStyle(0xef8cff, attacking ? 0.8 : pulse + 0.1);
        g.fillCircle(
          ex - 100,
          ey + 48,
          25 + ((s?.encounterElapsed || 0) / (s?.encounterDuration || 1)) * 18,
        );
      }
      if (attacking && current !== "VULNERABLE_ENEMY") {
        const t = Math.min(
          1,
          (s?.encounterElapsed || 0) / (s?.encounterDuration || 1),
        );
        g.fillStyle(current === "BLOCK_ATTACK" ? 0xef8cff : 0xffb966);
        g.fillCircle(
          680 - t * 490,
          current === "HIGH_PROJECTILE" ? 270 : 350,
          current === "BLOCK_ATTACK" ? 30 : 14,
        );
      }
      if (s?.hitFlash) {
        g.lineStyle(5, 0xffe9b1, 0.8);
        g.lineBetween(px + 100, py + 60, ex - 65, ey + 25);
      }
      const bar = (x: number, value: number, color: number) => {
        g.fillStyle(0x0a1d26);
        g.fillRoundedRect(x, 175, 180, 10, 5);
        g.fillStyle(color);
        g.fillRoundedRect(x, 175, Math.max(1, value * 1.8), 10, 5);
      };
      bar(145, s?.health ?? 100, 0x43d9bf);
      bar(675, s?.enemyHealth ?? 100, 0xff937d);
      if (s && !s.done) {
        this.title.setText(
          current ? encounterText[current].title : "RESET YOUR STANCE",
        );
        this.hint.setText(
          s.feedbackTime > 0
            ? s.message
            : current
            ? encounterText[current].hint
            : "Breathe. Watch the sentinel.",
        );
        this.label.setText(
          vulnerable
            ? "LEFT  /  RIGHT  /  LEFT  /  RIGHT"
            : s.stage === "telegraph"
            ? "READ THE ATTACK. GET READY."
            : s.stage === "attack"
            ? "NOW!"
            : "RETURN TO NEUTRAL BETWEEN MOVEMENTS",
        );
        if (current) {
          g.fillStyle(0xffc779, 0.8);
          g.fillRoundedRect(
            360,
            143,
            280 * Math.max(0, 1 - s.encounterElapsed / s.encounterDuration),
            5,
            2,
          );
        }
      }
    }
  }
  return {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    backgroundColor: "#112b3b",
    scene: [ArenaScene],
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    render: { antialias: true },
    audio: { noAudio: true },
  };
}
