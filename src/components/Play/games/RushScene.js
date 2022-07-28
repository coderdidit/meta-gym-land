import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "./helpers";
import { PlayerWithName, RectObstacle } from "./objects";
import { GYM_ROOM_SCENE, RUSH } from "./shared";
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
    this.bgTile = this.add
      .tileSprite(width / 2, height / 2, width, height, RUSH_BG)
      .setScrollFactor(0);

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

    this.createTextBoxes();

    // player
    this.player = new PlayerWithName({
      scene: this,
      x: width / 2,
      y: height - height * 0.08,
      name: this.selectedAvatar?.name,
    });

    // graphics
    this.createPlayerOuterGraphics();

    this.cursorKeys = this.player.cursorKeys;

    this.obstacleGraphics = new RectObstacle({
      scene: this,
      x: width / 2,
      y: height / 2,
    });
    this.obstacleGraphics.collideWith(this.player);

    // camera
    this.cameras.main.setOrigin(0.48, 0.88);
    this.cameras.main.startFollow(this.player);

    // vals needed for speed calc
    this.lastSpeeds = new Map();
    this.distanceTraveledInInterval = 0;
    this.intervalStartTime = Date.now();
    this.curMovingSpeed = 0;
  }

  createPlayerOuterGraphics() {
    const width = getGameWidth(this);
    const height = getGameHeight(this);

    const graphicsUpY = height / 1.15;
    const graphicsBottomY = height - height * 0.06;
    this.leftUpCircle = this.add
      .graphics()
      .fillStyle(0x06ff00, 0.8)
      .fillCircle(width - width * 0.54, graphicsUpY, 15);

    this.rightUpCircle = this.add
      .graphics()
      .fillStyle(0x06ff00, 0.8)
      .fillCircle(width - width * 0.46, graphicsUpY, 15);

    this.rightButtomCircle = this.add
      .graphics()
      .fillStyle(0xff0000, 0.8)
      .fillCircle(width - width * 0.46, graphicsBottomY, 15);
    this.leftButtomCircle = this.add
      .graphics()
      .fillStyle(0xff0000, 0.8)
      .fillCircle(width - width * 0.54, graphicsBottomY, 15);
  }

  calculateCurrentSpeed() {
    const timeElapsed = (Date.now() - this.intervalStartTime) / 1000;
    const vel = this.distanceTraveledInInterval / timeElapsed;
    this.lastSpeeds.set(Date.now(), vel);
    this.intervalStartTime = Date.now();
    this.distanceTraveledInInterval = 0;

    const _median = (vals) => {
      const sorted = vals.sort((a, b) => a - b);
      const half = Math.floor(sorted.length / 2);

      if (sorted.length % 2) return sorted[half];

      return (sorted[half - 1] + sorted[half]) / 2.0;
    };

    const medianVel = this.lastSpeeds.size
      ? _median(Array.from(this.lastSpeeds.values()))
      : 0.0;

    let speedLabel = "IDLE";
    if (medianVel > 0 && medianVel < 0.8) {
      speedLabel = "SLOWLY";
    } else if (medianVel > 0.8 && medianVel < 1.8) {
      speedLabel = "MEDIUM";
    } else if (medianVel > 1.8) {
      speedLabel = "FAST";
    } else if (medianVel > 2.8) {
      speedLabel = "VERY_FAST";
    }
    const factor = medianVel ? medianVel * 2 : 0;
    let boost = 1;
    if (speedLabel === "MEDIUM") {
      boost = 2;
    } else if (speedLabel === "FAST") {
      boost = 3;
    }

    // cleanup
    for (const ts of this.lastSpeeds.keys()) {
      const secondsAgo = (Date.now() - ts) / 1000;
      if (secondsAgo > 3) {
        this.lastSpeeds.delete(ts);
      }
    }

    return factor * boost;
  }

  // eslint-disable-next-line no-unused-vars
  update(time, delta) {
    if ((Date.now() - this.intervalStartTime) / 1000 > 3) {
      this.curMovingSpeed = this.calculateCurrentSpeed();
      this.statsBox.start(`Current speed: ${this.curMovingSpeed}`, 0);
    }

    this.leftButtomCircle.setAlpha(0.2);
    this.rightButtomCircle.setAlpha(0.2);
    this.leftUpCircle.setAlpha(0.2);
    this.rightUpCircle.setAlpha(0.2);

    const curPose = gstate.getPose();
    // Every frame, we create a new velocity for the sprite based on what keys the player is holding down.
    const velocity = new Phaser.Math.Vector2(0, 0);
    // Horizontal movement
    switch (true) {
      case this.cursorKeys?.left.isDown || curPose === gpose.HTL:
        velocity.x -= 1;
        this.leftButtomCircle.setAlpha(0.8);
        break;
      case this.cursorKeys?.right.isDown || curPose === gpose.HTR:
        velocity.x += 1;
        this.rightButtomCircle.setAlpha(0.8);
        break;
      default:
      // do nothing
    }

    // Vertical movement
    let movedUp = false;
    switch (true) {
      case this.cursorKeys?.down.isDown || curPose === gpose.LA_UP:
        this.leftUpCircle.setAlpha(0.8);
        movedUp = true;
        break;
      case this.cursorKeys?.up.isDown ||
        curPose === gpose.RA_UP ||
        curPose === gpose.BA_UP:
        this.rightUpCircle.setAlpha(0.8);
        movedUp = true;
        break;
      default:
        this.flipFlop = false;
      // do nothing
    }

    if (movedUp) {
      velocity.y -= 1;
      if (!this.flipFlop) {
        this.flipFlop = true;
        this.distanceTraveledInInterval += 1;
      }
    }

    const speed = this.curMovingSpeed ? 150 * this.curMovingSpeed : 150;

    // We normalize the velocity so that the player is always moving at the same speed, regardless of direction.
    const normalizedVelocity = velocity.normalize();
    const normalizedYVelocity = this.curMovingSpeed ? -1 : normalizedVelocity.y;
    this.player.body.setVelocity(
      normalizedVelocity.x * speed,
      normalizedYVelocity * speed,
    );

    this.bgTile.tilePositionY = this.cameras.main.scrollY;
    this.bgTile.tilePositionX = this.cameras.main.scrollX;
    this.leftButtomCircle.y = this.cameras.main.scrollY;
    this.leftButtomCircle.x = this.cameras.main.scrollX;
    this.rightButtomCircle.y = this.cameras.main.scrollY;
    this.rightButtomCircle.x = this.cameras.main.scrollX;
    this.rightUpCircle.y = this.cameras.main.scrollY;
    this.rightUpCircle.x = this.cameras.main.scrollX;
    this.leftUpCircle.x = this.cameras.main.scrollX;
    this.leftUpCircle.y = this.cameras.main.scrollY;
  }

  createTextBoxes() {
    const width = getGameWidth(this);
    const height = getGameHeight(this);

    createTextBox(
      this,
      width * 0.05,
      height * 0.015,
      { wrapWidth: 280 },
      mainBgColorNum,
      highlightTextColorNum,
    )
      .start("press ESC to go back", 10)
      .setScrollFactor(0, 0);

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

    // stats
    this.statsBox = createTextBox(
      this,
      width * 0.05,
      height * 0.09,
      { wrapWidth: 280 },
      0xfffefe,
      0x00ff00,
      "left",
      "#212125",
    )
      .setScrollFactor(0, 0)
      .start("Current speed: 0", 0);
  }
}
