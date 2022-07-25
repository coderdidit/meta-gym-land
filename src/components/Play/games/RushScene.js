import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "./helpers";
import { Player } from "./objects";
import { PLAYER_KEY, PLAYER_SCALE, GYM_ROOM_SCENE, RUSH } from "./shared";
import { createTextBox } from "./utils/text";
import { mainBgColorNum, highlightTextColorNum } from "../../../GlobalStyles";
import { EarnableScene } from "./EarnableScene";
import * as gstate from "../../gpose/state";
import * as gpose from "../../gpose/pose";
import { RUSH_BG } from "./assets";

const SceneConfig = {
  active: false,
  visible: false,
  key: RUSH,
};

export class RushScene extends EarnableScene {
  constructor() {
    super(SceneConfig);
  }

  init = (data) => {
    this.selectedAvatar = data.selectedAvatar;
  };

  exit() {
    this.game.registry.values?.setMinigame(GYM_ROOM_SCENE);
    this.scene.start(GYM_ROOM_SCENE);
  }

  create() {
    // basic props
    const width = getGameWidth(this);
    const height = getGameHeight(this);

    // bg
    this.rushBg = this.add.tileSprite(
      width / 2,
      height / 2,
      width,
      height,
      RUSH_BG,
    );

    // constrols
    this.input.keyboard.on(
      "keydown",
      async (event) => {
        const code = event.keyCode;
        if (
          code === Phaser.Input.Keyboard.KeyCodes.ESC ||
          code === Phaser.Input.Keyboard.KeyCodes.X
        ) {
          await this.updateXP();
        }
        if (code === Phaser.Input.Keyboard.KeyCodes.X) {
          this.scene.start(RUSH);
        }
        if (code === Phaser.Input.Keyboard.KeyCodes.ESC) {
          this.exit();
        }
      },
      this,
    );

    createTextBox(
      this,
      width * 0.05,
      height * 0.015,
      { wrapWidth: 280 },
      mainBgColorNum,
      highlightTextColorNum,
    ).start("press ESC to go back", 10);

    const hintTextBox = createTextBox(
      this,
      width / 2 + width / 4,
      height * 0.015,
      { wrapWidth: 280 },
      0xfffefe,
      0x00ff00,
      "center",
      "#212125",
    );
    hintTextBox.setDepth(1);
    hintTextBox.setScrollFactor(0, 0);
    hintTextBox.start("🤖 Welcome in MetaGymLand RUSH minigame", 50);

    // player
    this.player = new Player({
      scene: this,
      x: width / 2,
      y:
        this.physics.world.bounds.height -
        this.physics.world.bounds.height * 0.1,
      key: PLAYER_KEY,
    });
    this.player.setScale(PLAYER_SCALE);
    this.player.setDepth(1);
    this.player.body.setCollideWorldBounds(true);

    // this.cameras.main.startFollow(this.player);

    // set initial values
    this.currentSpeed = 0;
    this.flipFlop = false;
    this.last5Ups = new Deque();
    this.distanceTraveled = 0;
    this.startTime = Date.now();
    this.curVel = 0;
    // velocity gauge
    this.scoreBoard = this.add.text(
      width * 0.05,
      height * 0.1,
      "Moves Per Second: 0",
      {
        fill: "#ba3a3a",
        font: "900 20px Orbitron",
      },
    );

    this.scoreBoard2 = this.add.text(width * 0.05, height * 0.15, "Stats", {
      fill: "#48A869",
      font: "900 20px Orbitron",
    });

    this.lastSpeeds = new Map();
    this.curMove = Date.now();
    this.lastMoveTs = new Date("12-12-2020").getTime();
  }

  // eslint-disable-next-line no-unused-vars
  update(time, delta) {
    if ((Date.now() - this.startTime) / 1000 > 3) {
      const vel =
        this.distanceTraveled / ((Date.now() - this.startTime) / 1000);
      this.lastSpeeds.set(Date.now(), vel);
      this.startTime = Date.now();
      this.distanceTraveled = 0;
    }

    const medianVel = this.lastSpeeds.size
      ? median(Array.from(this.lastSpeeds.values()))
      : 0.0;

    //  Scroll the background

    const factor = medianVel ? medianVel * 2 : 0;
    this.rushBg.tilePositionY -= factor;

    let speedLabel = "IDLE";
    if (medianVel > 0 && medianVel < 0.8) {
      speedLabel = "SLOWLY";
    } else if (medianVel > 0.8 && medianVel < 1.8) {
      speedLabel = "MEDIUM";
    } else if (medianVel > 1.8) {
      speedLabel = "FAST";
    }

    this.scoreBoard.setText(
      `Avg Moves Per 3 Second: ${medianVel.toFixed(2)} (${speedLabel})`,
    );

    for (const ts of this.lastSpeeds.keys()) {
      const secondsAgo = (Date.now() - ts) / 1000;
      if (secondsAgo > 3) {
        this.lastSpeeds.delete(ts);
      }
    }

    this.handlePlayerMoves(time, delta);
  }

  // eslint-disable-next-line no-unused-vars
  handlePlayerMoves(time, delta) {
    const player = this.player;
    const height = getGameHeight(this);
    if (player.y < height * 0.15) {
      player.y = this.physics.world.bounds.height;
    }
    // time, delta example output
    // {time: 23744.10000000149, delta: 16.65000000074506}

    // calc speed here
    if (!this.last5Ups.isEmpty) {
      const curTime = time;
      // eslint-disable-next-line no-unused-vars
      const lastMoveTimeAgo = (curTime - this.last5Ups.front()) / 1000;
      const medianDeltasBetweenLast5Moves = this.last5Ups.medianDeltas() / 1000;
      this.scoreBoard2.setText(
        `last move seconds ago: ${lastMoveTimeAgo.toFixed(2)}` +
          "\n" +
          `median gap between last 5 moves ${medianDeltasBetweenLast5Moves.toFixed(
            2,
          )}`,
      );
    }

    // maintain queue
    if (this.last5Ups.length >= 5) {
      this.last5Ups.removeRear();
    }

    const speed = 150;
    const curPose = gstate.getPose();
    // Every frame, we create a new velocity for the sprite based on what keys the player is holding down.
    const velocity = new Phaser.Math.Vector2(0, 0);
    // Horizontal movement
    switch (true) {
      case player.cursorKeys?.left.isDown || curPose === gpose.HTL:
        velocity.x -= 1;
        // this.anims.play('left', true);
        break;
      case player.cursorKeys?.right.isDown || curPose === gpose.HTR:
        velocity.x += 1;
        // this.anims.play('right', true);
        break;
      default:
      // do nothing
    }

    // Vertical movement
    switch (true) {
      case player.cursorKeys?.down.isDown ||
        curPose === gpose.LA_UP ||
        curPose === gpose.NDWN:
        if (!this.flipFlop) {
          this.flipFlop = true;
          this.distanceTraveled += 1;
          this.last5Ups.addFront(time);
          this.lastMoveTs = Date.now();
        }
        break;
      case player.cursorKeys?.up.isDown ||
        curPose === gpose.RA_UP ||
        curPose === gpose.BA_UP:
        if (!this.flipFlop) {
          this.flipFlop = true;
          this.distanceTraveled += 1;
          this.last5Ups.addFront(time);
          this.lastMoveTs = Date.now();
        }
        break;
      default:
        this.flipFlop = false;
      // do nothing
    }
  }
}

class Deque {
  constructor() {
    this.items = [];
  }

  get isEmpty() {
    return !this.items.length;
  }

  front() {
    return this.items[0];
  }

  diff() {
    const elems = this.items;
    return elems.slice(1).map((n, i) => {
      return elems[i] - n;
    });
  }

  medianDeltas() {
    return median(this.diff());
  }

  deltaBetweenCurrTimeAndPAssedTimes(curTime) {
    return curTime - this.average();
  }

  rear() {
    return this.items[this.items.length - 1];
  }

  addFront(item) {
    this.items.unshift(item);
  }

  addRear(item) {
    this.items.push(item);
  }

  removeFront() {
    return this.items.shift();
  }

  removeRear() {
    return this.items.pop();
  }

  get length() {
    return this.items.length;
  }
}

const median = (vals) => {
  const sorted = vals.sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);

  if (sorted.length % 2) return sorted[half];

  return (sorted[half - 1] + sorted[half]) / 2.0;
};
