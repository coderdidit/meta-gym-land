import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "../helpers";
import { Player } from "../objects";
import { PLAYER_SCALE, SPACE_STRETCH_SCENE } from "..";
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
      gravity: { y: 3000 },
    },
  },
};

const asteroidScale = 1;
const maxAsteroidPlatformsCnt = 7;
const roboTextTimeouts: NodeJS.Timeout[] = [];
const playerSpeed = 100;

export class SpaceStretchScene extends SceneInMetaGymRoom {
  shapes: any;
  graphics: any;
  won!: boolean;
  lastMovetime!: number;
  score!: number;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  landingAcceleration!: number;
  scoreBoard!: Phaser.GameObjects.Text;
  placedAsteroidPlatforms!: number;
  player: any; // specify type later
  emitter!: Phaser.GameObjects.Particles.ParticleEmitter;

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
      this.graphics.fillStyle(this.color(i), 0.5).fillCircleShape(shape);
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
    this.graphics.fillStyle(0xb8abb2, 1).fillRectShape(rect);
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
    this.graphics = this.add.graphics();
    this.graphics.clear();
    const rect = new Phaser.Geom.Rectangle(0, 0, width, height);
    this.graphics
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
    this.cursors = this.input.keyboard.createCursorKeys();
    this.landingAcceleration = 2;

    // openingText
    // hint
    const hintTextBox = createTextBox({
      scene: this,
      x: width / 2 + width / 4,
      y: height * 0.015,
      config: { wrapWidth: 280 },
      bg: mainBgColorNum,
      stroke: highlightTextColorNum,
    });
    hintTextBox.setDepth(1);
    hintTextBox.setScrollFactor(0, 0);
    hintTextBox.start("🤖", 50);
    roboTextTimeouts.push(
      setTimeout(() => {
        if (!hintTextBox) return;
        hintTextBox.start(
          "🤖 Land 🚀 on asteroids\n" +
            "and crush them 💥\n\n" +
            "Move your hands up\n" +
            "Tilt your head to the sides\n" +
            "Use the GRAVITY!",
          50,
        );
        roboTextTimeouts.push(
          setTimeout(() => {
            if (!hintTextBox) return;
            hintTextBox.start("🤖", 50);
          }, 15000),
        );
      }, 500),
    );

    // Add the scoreboard in
    this.scoreBoard = this.add.text(width * 0.05, height * 0.015, "SCORE: 0", {
      color: highlightTextColor,
      font: `500 20px ${InGameFont}`,
    });
    this.add.text(width * 0.05, height * 0.04, "press ESC to go back", {
      color: "#FFBE59",
      font: `500 17px ${InGameFont}`,
    });

    const asteroidGroupProps = {
      immovable: true,
      allowGravity: false,
    };
    const asteroids = this.physics.add.group(asteroidGroupProps);
    const worldWidth = this.physics.world.bounds.width;
    const worldHeight = this.physics.world.bounds.height;
    this.placedAsteroidPlatforms = 0;

    const placeAsteroids = () => {
      const yOffset = 32 * 1.5;
      const xOffset = worldWidth * 0.1;
      const step = 100;
      let asteroidYPos = yOffset + 45;
      for (let i = 0; i < maxAsteroidPlatformsCnt; i++) {
        if (asteroidYPos < worldHeight - (yOffset + 15)) {
          // add biased randomnes to keep some tiles on left some on right
          let x = 0;
          if (i % 2 === 0) {
            // bias towards left
            x = Phaser.Math.Between(xOffset, worldWidth / 2.3);
          } else {
            // bias towards right
            x = Phaser.Math.Between(worldWidth / 1.3, worldWidth - xOffset);
          }
          const asteroidTile = asteroids.create(x, asteroidYPos, ASTEROIDS);
          asteroidTile.setScale(asteroidScale);
          asteroidYPos += step;
          this.placedAsteroidPlatforms += 1;
        }
      }
    };

    placeAsteroids();

    this.emitter = this.add.particles(ASTEROIDS).createEmitter({
      speed: { min: -800, max: 800 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      blendMode: Phaser.BlendModes.SCREEN,
      lifespan: 600,
      gravityY: 800,
    });
    this.emitter.pause();

    // player
    this.player = new Player({
      scene: this,
      x: Phaser.Math.Between(width * 0.1, this.physics.world.bounds.width - 80),
      y: this.physics.world.bounds.height,
    });
    this.player.setScale(PLAYER_SCALE);
    this.player.setDepth(1);
    this.player.body.setCollideWorldBounds(true);

    // adjust collision box
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.8);

    const onCollide = (avatar: any, asteroid: any) => {
      if (avatar.body.onFloor()) {
        this.score += 1;
        asteroid.setTint("0x4f4f4f");
        asteroid.setImmovable(false);
        asteroid.setVelocityY(600);
        this.emitter.resume();
        this.emitter.explode(10, asteroid.x, asteroid.y);
        this.scoreBoard.setText(`SCORE: ${this.score}`);
      }
    };

    this.physics.add.collider(
      this.player,
      asteroids,
      onCollide,
      undefined,
      this,
    );
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
      player.body.setVelocityY(playerSpeed * -1);
      player.body.setAllowGravity(false);
      this.lastMovetime = now;
    }
  }
}
