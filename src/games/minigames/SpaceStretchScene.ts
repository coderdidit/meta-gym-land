import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "../helpers";
import { Player } from "../objects";
import { PLAYER_KEY, PLAYER_SCALE, SPACE_STRETCH_SCENE } from "..";
import { createTextBox } from "../utils/text";
import { ASTEROIDS } from "../gym-room-boot/assets";
import * as gstate from "../../ai/gpose/state";
import * as gpose from "../../ai/gpose/pose";
import {
  highlightTextColorNum,
  mainBgColorNum,
  highlightTextColor,
  InGameFont,
} from "../../GlobalStyles";
import party, { sources } from "party-js";
import { SceneInMetaGymRoom } from "../base-scenes/scene-in-metagym-room";

const SceneConfig = {
  active: false,
  visible: false,
  key: SPACE_STRETCH_SCENE,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 3000 },
    },
  },
};

const asteroidScale = 1;
const maxAsteroidPlatformsCnt = 7;
const roboTextTimeouts: NodeJS.Timeout[] = [];
const playerSpeed = 100;

export class SpaceStretchScene extends SceneInMetaGymRoom {
  shapes: any;
  starsGraphics!: Phaser.GameObjects.Graphics;
  won!: boolean;
  lastMovetime!: number;
  score!: number;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  landingAcceleration!: number;
  scoreBoard!: Phaser.GameObjects.Text;
  placedAsteroidPlatforms!: number;
  player: any; // specify type later
  explodeEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  flyEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super(SceneConfig);
  }

  // eslint-disable-next-line no-unused-vars
  color(i: any) {
    return 0xffffff;
    // keeping for reference
    // return 0x001100 * (i % 15) + 0x000033 * (i % 5);
  }

  draw() {
    this.shapes.forEach((shape: any, i: any) => {
      this.starsGraphics.fillStyle(this.color(i), 0.5).fillCircleShape(shape);
    }, this);
  }

  drawGround(width: number | undefined, height: number) {
    const groundHeight = height * 0.02;
    const rect = new Phaser.Geom.Rectangle(
      0,
      height - groundHeight,
      width,
      groundHeight,
    );
    const groundGraphics = this.add.graphics();
    groundGraphics.fillStyle(0xb8abb2, 1).fillRectShape(rect);
    return rect;
  }

  create() {
    this.won = false;
    // basic props
    const width = getGameWidth(this);
    const height = getGameHeight(this);
    // basics
    this.handleExit({
      thisSceneKey: SPACE_STRETCH_SCENE,
    });

    // background
    // this.game.graphics
    // this.cameras.main.backgroundColor = "linear-gradient(180deg, #000207 0%, #003963 100%)";
    this.starsGraphics = this.add.graphics();
    this.starsGraphics.clear();
    const rect = new Phaser.Geom.Rectangle(0, 0, width, height);
    this.starsGraphics
      .fillGradientStyle(0x023246, 0x1e0338, 0x300240, 0x370232, 1)
      .fillRectShape(rect);

    this.drawGround(width, height);
    this.shapes = new Array(45)
      .fill(null)
      .map(
        () =>
          new Phaser.Geom.Circle(
            Phaser.Math.Between(0, width),
            Phaser.Math.Between(0, height),
            Phaser.Math.Between(1, 3),
          ),
      );
    this.draw();

    // basics
    this.handleExit({
      thisSceneKey: SPACE_STRETCH_SCENE,
      callbackOnExit: () => {
        roboTextTimeouts.forEach((t) => clearTimeout(t));
      },
    });

    this.lastMovetime = Date.now();
    this.score = 0;
    if (this.input && this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    this.explodeEmitter = this.add.particles(0, 0, ASTEROIDS, {
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: Phaser.BlendModes.SCREEN,
      lifespan: 600,
      gravityY: 800,
      emitting: false, // Start stopped
    }) as any;

    this.flyEmitter = this.add.particles(0, 0, PLAYER_KEY, {
      speed: 100,
      scale: { start: 0.2, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      emitting: false, // Start stopped
    }) as any;
    this.flyEmitter.startFollow(this.player);

    const onCollide = (avatar: any, asteroid: any) => {
      this.explodeEmitter.setPosition(asteroid.x, asteroid.y);
      this.explodeEmitter.explode(10);
      asteroid.destroy();
      this.score++;
      this.scoreBoard.setText(`SCORE: ${this.score}`);
    };

    // Create asteroids group for collision detection
    const asteroidsGroup = this.physics.add.group();

    // Add asteroids to the group (this would be done where asteroids are created)
    // For now, we'll comment out the collider until we have the proper group
    // this.physics.add.collider(
    //   this.player,
    //   asteroidsGroup,
    //   onCollide,
    //   undefined,
    //   this,
    // );
  }

  youWonMsg() {
    const canvasParent = document.querySelector(
      "#phaser-app canvas",
    ) as sources.DynamicSourceType;
    if (canvasParent) party.confetti(canvasParent);
    // setInterval(() => {
    //     party.confetti(canvasParent);
    // }, 1000);

    const width = getGameWidth(this);
    const height = getGameHeight(this);

    const msg =
      "All asteroids are crushed 🎉\n" +
      "\n\n" +
      "Press X to 🎮 restart\n" +
      "Press ESC to exit";

    const youWonText = createTextBox({
      scene: this,
      x: width / 2,
      y: height / 2,
      config: { wrapWidth: 280 },
      bg: mainBgColorNum,
      stroke: highlightTextColorNum,
    });
    youWonText.setOrigin(0.5).setDepth(1).setScrollFactor(0, 0);
    youWonText.start(msg, 50);
  }

  // eslint-disable-next-line no-unused-vars
  update(time: any, delta: any) {
    if (!this.won && this.score === this.placedAsteroidPlatforms) {
      this.won = true;
      this.youWonMsg();
      return;
    }

    const now = Date.now();
    const timeDiff = (now - this.lastMovetime) / 1000;
    const player = this.player;
    player.body.setVelocityX(0);
    player.body.setVelocityY(0);

    const isIdle = !gstate.isNonIdle();
    if (!isIdle) {
      // reset
      this.landingAcceleration = 2;
    }
    // deffer gravity from in move state
    if (timeDiff > 0.8) {
      if (isIdle) {
        player.body.setAllowGravity(true);
        player.body.setVelocityY(playerSpeed);
      }
    }
    // if not in move for longer start accelerating gravity
    if (timeDiff > 3) {
      if (isIdle) {
        player.body.setVelocityY(playerSpeed + this.landingAcceleration);
        this.landingAcceleration += 1.2;
      }
    }
    const curPose = gstate.getPose();
    if (player.cursorKeys?.left.isDown || curPose === gpose.HTL) {
      player.body.setVelocityX(playerSpeed * 0.8 * -1);
      player.body.setAllowGravity(false);
      this.lastMovetime = now;
    } else if (player.cursorKeys?.right.isDown || curPose === gpose.HTR) {
      player.body.setVelocityX(playerSpeed * 0.8);
      player.body.setAllowGravity(false);
      this.lastMovetime = now;
    } else if (player.cursorKeys?.up.isDown || curPose === gpose.BA_UP) {
      this.flyEmitter.start();
      player.body.setVelocityY(playerSpeed * -1);
      player.body.setAllowGravity(false);
      this.lastMovetime = now;
    } else {
      this.flyEmitter.stop();
    }
  }
}
