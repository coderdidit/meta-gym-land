import { SceneInMetaGymRoom } from "games/base-scenes/scene-in-metagym-room";
import {
  highlightTextColorNum,
  InGameFont,
  mainBgColorNum,
} from "GlobalStyles";
import Phaser from "phaser";
import { PLAYER_KEY, RUNNER_ACTUAL } from "../..";
import * as gstate from "../../../ai/gpose/state";
import * as gpose from "../../../ai/gpose/pose";
import {
  createTextBox,
  GameUI,
  TimeoutManager,
  ParticlePresets,
} from "games/utils";
import Key from "ts-key-namespace";
import { TextBox } from "phaser3-rex-plugins/templates/ui/ui-components";

export { RunnerScene };

const gameXPercentageOffsett = 0.1;
const gameYPercentageOffsett = 0.1;

const SceneConfig = {
  active: false,
  visible: false,
  key: RUNNER_ACTUAL,
};

class RunnerScene extends SceneInMetaGymRoom {
  gameSpeed = 8;
  isGameRunning = false;
  respawnTime = 0;
  score = 0;
  jumpSound!: Phaser.Sound.BaseSound;
  hitSound!: Phaser.Sound.BaseSound;
  reachSound!: Phaser.Sound.BaseSound;
  startTrigger!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  ground!: Phaser.GameObjects.TileSprite;
  player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  scoreText!: Phaser.GameObjects.Text;
  highScoreText!: Phaser.GameObjects.Text;
  environment!: Phaser.GameObjects.Group;
  restart!: Phaser.GameObjects.Image;
  obsticles!: Phaser.Physics.Arcade.Group;
  cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  bottomPositionY!: number;
  gameOverTextBox!: TextBox;
  runEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  constructor() {
    super(SceneConfig);
  }

  gameDimentions(): {
    width: number;
    height: number;
  } {
    const { width, height } = this.game.config;
    return { width: Number(width), height: Number(height) };
  }

  create() {
    const { width, height } = this.gameDimentions();
    this.cameras.main.setBackgroundColor(0xbababa);

    this.jumpSound = this.sound.add("jump", { volume: 0.2 });
    this.hitSound = this.sound.add("hit", { volume: 0.2 });
    this.reachSound = this.sound.add("reach", { volume: 0.2 });

    this.bottomPositionY = height - height * gameYPercentageOffsett;
    const bottomPositionX = width * gameXPercentageOffsett;

    this.physics.world.setBounds(0, 0, width, this.bottomPositionY);

    this.player = this.physics.add
      .sprite(bottomPositionX, this.bottomPositionY, PLAYER_KEY)
      .setCollideWorldBounds(true)
      .setGravityY(3000)
      .setDepth(1)
      .setOrigin(0, 1);

    this.player.setBodySize(this.player.width, this.player.height);

    this.cursorKeys = this.input?.keyboard?.createCursorKeys();

    this.runEmitter = ParticlePresets.trail(this, PLAYER_KEY) as any;
    this.runEmitter.startFollow(this.player);

    this.ground = this.add
      .tileSprite(bottomPositionX, this.bottomPositionY, 88, 26, "ground")
      .setOrigin(0, 1);

    this.startTrigger = this.physics.add
      .sprite(
        this.player.x,
        this.bottomPositionY - this.player.height * 1.5,
        "",
      )
      .setAlpha(0)
      .setOrigin(0, 1)
      .setImmovable();

    this.scoreText = this.add
      .text(width, 0, "00000", {
        color: "#535353",
        font: `900 35px ${InGameFont}`,
        resolution: 5,
      })
      .setOrigin(1, 0)
      .setAlpha(0);

    this.highScoreText = this.add
      .text(0, 0, "00000", {
        color: "#535353",
        font: `900 35px ${InGameFont}`,
        resolution: 5,
      })
      .setOrigin(1, 0)
      .setAlpha(0);

    this.environment = this.add.group();
    this.environment.addMultiple([
      this.add.image(width / 2, this.bottomPositionY / 2.7, "cloud"),
      this.add.image(width / 1.3, this.bottomPositionY / 2, "cloud"),
      this.add.image(width - 80, this.bottomPositionY / 1.5, "cloud"),
    ]);
    this.environment.setAlpha(0);

    this.obsticles = this.physics.add.group();

    this.createTextBoxes();
    this.initAnims();
    this.initStartTrigger();
    this.initColliders();

    this.handleScore();
    this.handleExitRestart();
  }

  private handleExitRestart() {
    // exit or restart
    const fn = async (event: KeyboardEvent) => {
      const key = event.key;
      if (key === Key.Escape) {
        this.exit(RUNNER_ACTUAL);
      }
      if (key === "x") {
        this.scene.start(RUNNER_ACTUAL);
        // this.restartGame();
      }
    };
    this.input?.keyboard?.on("keydown", fn, this);
  }

  private displayGameOverText() {
    const { width, height } = this.gameDimentions();
    this.gameOverTextBox = createTextBox({
      scene: this,
      x: width / 2,
      y: height / 2,
      config: {},
      bg: mainBgColorNum,
      stroke: highlightTextColorNum,
      padding: 25,
    }).start("GAME OVER" + "\n" + "press x to restart", 30);
  }

  private createTextBoxes() {
    const { width, height } = this.gameDimentions();

    const escTextBoxY = height * 0.015;
    // ESC text box
    GameUI.createEscHint(this, width, height, 3);

    // hints
    GameUI.createHintTextBox(
      this,
      width,
      height,
      "🤖 Move your hands up to start",
      3,
    );
  }

  private initColliders() {
    this.physics.add.collider(
      this.player,
      this.obsticles,
      () => {
        this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20;

        const highScore = this.highScoreText.text.substr(
          this.highScoreText.text.length - 5,
        );
        const newScore =
          Number(this.scoreText.text) > Number(highScore)
            ? this.scoreText.text
            : highScore;

        this.highScoreText.setText("HI " + newScore);
        this.highScoreText.setAlpha(1);

        this.physics.pause();
        this.isGameRunning = false;
        this.anims.pauseAll();
        this.player.setTint(0x808080);
        this.runEmitter.stop();

        this.respawnTime = 0;
        this.gameSpeed = 10;
        this.displayGameOverText();
        // this.score = 0;
        this.hitSound.play();
      },
      undefined,
      this,
    );
  }

  private initStartTrigger() {
    this.physics.add.overlap(
      this.startTrigger,
      this.player,
      () => {
        this.startGame();
      },
      undefined,
      this,
    );
  }

  private startGame() {
    const { width, height } = this.gameDimentions();
    const groundEnd = width - width * (gameXPercentageOffsett * 1.5);
    if (this.startTrigger.y === 10) {
      this.startTrigger.body.reset(0, height);
      return;
    }

    this.startTrigger.disableBody(true, true);

    const startEvent = this.time.addEvent({
      delay: 1000 / 60,
      loop: true,
      callbackScope: this,
      callback: () => {
        this.player.setVelocityX(80);
        this.runEmitter.start();
        if (this.ground.width < width) {
          this.ground.width += 17 * 2;
        }

        if (this.ground.width >= 1000) {
          this.ground.width = groundEnd;
          this.isGameRunning = true;
          this.player.setVelocityX(0);
          this.scoreText.setAlpha(1);
          this.environment.setAlpha(1);
          startEvent.remove();
        }
      },
    });
  }

  private initAnims() {
    this.anims.create({
      key: "enemy-dino-fly",
      frames: this.anims.generateFrameNumbers("enemy-bird", {
        start: 0,
        end: 1,
      }),
      frameRate: 6,
      repeat: -1,
    });
  }

  private handleScore() {
    this.time.addEvent({
      delay: 1000 / 10,
      loop: true,
      callbackScope: this,
      callback: () => {
        if (!this.isGameRunning) {
          return;
        }

        this.score++;
        this.gameSpeed += 0.01;

        if (this.score % 100 === 0) {
          this.reachSound.play();

          this.tweens.add({
            targets: this.scoreText,
            duration: 100,
            repeat: 3,
            alpha: 0,
            yoyo: true,
          });
        }

        const score = Array.from(String(this.score), Number);
        for (let i = 0; i < 5 - String(this.score).length; i++) {
          score.unshift(0);
        }

        this.scoreText.setText(score.join(""));
      },
    });
  }

  private handleInputsOnUpdate() {
    const curPose = gstate.getPose();
    this.player.setScale(1, 1);

    if (
      this.cursorKeys?.space.isDown ||
      curPose === gpose.LA_UP ||
      curPose === gpose.RA_UP ||
      curPose === gpose.BA_UP
    ) {
      if (!this.player.body.onFloor() || this.player.body.velocity.x > 0) {
        return;
      }
      this.jumpSound.play();
      this.player.body.setSize(this.player.width, this.player.height);
      this.player.body.offset.y = 0;
      this.player.setVelocityY(-1600);
    }

    if (
      this.cursorKeys?.down.isDown ||
      curPose === gpose.HTL ||
      curPose === gpose.HTR
    ) {
      if (!this.player.body.onFloor() || !this.isGameRunning) {
        return;
      }

      this.player.body.setSize(undefined, 58);
      this.player.setScale(1, 0.5);
      this.player.body.offset.y = 34;
    }
    if (curPose === gpose.IDLE) {
      if (this.score !== 0 && !this.isGameRunning) {
        return;
      }
      this.player.body.setSize(undefined, this.player.height);
      this.player.body.offset.y = 0;
    }
  }

  // private restartGame(): void {
  //   this.gameOverTextBox.destroy();
  //   // gym buddy
  //   this.player.setTint(undefined);
  //   this.player.setVelocityY(0);
  //   this.player.setBodySize(this.player.width, this.player.height);
  //   this.player.body.offset.y = 0;
  //   this.runEmitter.start();
  //   this.physics.resume();
  //   this.obsticles.clear(true, true);
  //   this.isGameRunning = true;
  //   this.anims.resumeAll();
  // }

  private placeObsticle() {
    const obsticleNum = Math.floor(Math.random() * 7) + 1;
    const distance = Phaser.Math.Between(600, 900);
    const { width } = this.gameDimentions();

    const obsticleX = width + distance;

    let obsticle;
    if (obsticleNum > 6) {
      const enemyHeight = [20, 45];
      obsticle = this.obsticles
        .create(
          obsticleX,
          this.bottomPositionY - enemyHeight[Math.floor(Math.random() * 2)],
          `enemy-bird`,
        )
        .setOrigin(0, 1);
      obsticle.play("enemy-dino-fly", 1);
      obsticle.body.height = obsticle.body.height / 1.5;
    } else {
      obsticle = this.obsticles
        .create(obsticleX, this.bottomPositionY, `obsticle-${obsticleNum}`)
        .setOrigin(0, 1);

      obsticle.body.offset.y = +10;
    }

    obsticle.setImmovable();
  }

  update(_time: number, delta: number) {
    this.handleInputsOnUpdate();

    if (!this.isGameRunning) {
      return;
    }

    this.ground.tilePositionX += this.gameSpeed;
    Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.environment.getChildren(), -0.5);

    this.respawnTime += delta * this.gameSpeed * 0.08;
    // obsticles freequency
    if (this.respawnTime >= 2000) {
      this.placeObsticle();
      this.respawnTime = 0;
    }

    this.obsticles.getChildren().forEach((obsticle: any) => {
      if (obsticle.getBounds().right < 0) {
        this.obsticles.killAndHide(obsticle);
      }
    });

    this.environment.getChildren().forEach((env: any) => {
      if (env.getBounds().right < 0) {
        env.x = this.gameDimentions().width + 30;
      }
    });
  }
}
