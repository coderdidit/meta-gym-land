import { InGameFont } from "GlobalStyles";
import Phaser from "phaser";
import { RUNNER_ACTUAL } from "../../shared";

export { RunnerScene };

const SceneConfig = {
  active: false,
  visible: false,
  key: RUNNER_ACTUAL,
};

class RunnerScene extends Phaser.Scene {
  gameSpeed = 8;
  isGameRunning = false;
  respawnTime = 0;
  score = 0;
  jumpSound!: Phaser.Sound.BaseSound;
  hitSound!: Phaser.Sound.BaseSound;
  reachSound!: Phaser.Sound.BaseSound;
  startTrigger!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  ground!: Phaser.GameObjects.TileSprite;
  dino!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  scoreText!: Phaser.GameObjects.Text;
  highScoreText!: Phaser.GameObjects.Text;
  environment!: Phaser.GameObjects.Group;
  gameOverScreen!: Phaser.GameObjects.Container;
  gameOverText!: Phaser.GameObjects.Image;
  restart!: Phaser.GameObjects.Image;
  obsticles!: Phaser.Physics.Arcade.Group;
  cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
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

    const bottomPositionY = height;
    const bottomPositionX = width * 0.05;

    this.dino = this.physics.add
      .sprite(bottomPositionX, bottomPositionY, "dino-idle")
      .setCollideWorldBounds(true)
      .setGravityY(5000)
      .setBodySize(44, 92)
      .setDepth(1)
      .setOrigin(0, 1);

    this.ground = this.add
      .tileSprite(bottomPositionX, bottomPositionY, 88, 26, "ground")
      .setOrigin(0, 1);

    this.startTrigger = this.physics.add
      .sprite(bottomPositionX, bottomPositionY - this.dino.height * 1.5, "")
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
      this.add.image(width / 2, 170, "cloud"),
      this.add.image(width - 80, 80, "cloud"),
      this.add.image(width / 1.3, 100, "cloud"),
    ]);
    this.environment.setAlpha(0);

    this.gameOverScreen = this.add
      .container(width / 2, height / 2 - 50)
      .setAlpha(0);
    this.gameOverText = this.add.image(0, 0, "game-over");
    this.restart = this.add.image(0, 80, "restart").setInteractive();
    this.gameOverScreen.add([this.gameOverText, this.restart]);

    this.obsticles = this.physics.add.group();

    this.initAnims();
    this.initStartTrigger();
    this.initColliders();
    this.handleInputs();
    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.handleScore();
  }

  initColliders() {
    this.physics.add.collider(
      this.dino,
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
        this.dino.setTexture("dino-hurt");
        this.respawnTime = 0;
        this.gameSpeed = 10;
        this.gameOverScreen.setAlpha(1);
        this.score = 0;
        this.hitSound.play();
      },
      undefined,
      this,
    );
  }

  initStartTrigger() {
    const { width, height } = this.gameDimentions();
    this.physics.add.overlap(
      this.startTrigger,
      this.dino,
      () => {
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
            this.dino.setVelocityX(80);
            this.dino.play("dino-run", true);

            if (this.ground.width < width) {
              this.ground.width += 17 * 2;
            }

            if (this.ground.width >= 1000) {
              this.ground.width = width;
              this.isGameRunning = true;
              this.dino.setVelocityX(0);
              this.scoreText.setAlpha(1);
              this.environment.setAlpha(1);
              startEvent.remove();
            }
          },
        });
      },
      undefined,
      this,
    );
  }

  initAnims() {
    this.anims.create({
      key: "dino-run",
      frames: this.anims.generateFrameNumbers("dino", { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "dino-down-anim",
      frames: this.anims.generateFrameNumbers("dino-down", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

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

  handleScore() {
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

  handleInputsOnUpdate() {
    if (this.cursorKeys?.space.isDown) {
      if (!this.dino.body.onFloor() || this.dino.body.velocity.x > 0) {
        return;
      }
      this.jumpSound.play();
      this.dino.body.setSize(this.dino.body.width, 92);
      this.dino.body.offset.y = 0;
      this.dino.setVelocityY(-1600);
      this.dino.setTexture("dino", 0);
    }

    if (this.cursorKeys?.down.isDown) {
      if (!this.dino.body.onFloor() || !this.isGameRunning) {
        return;
      }

      this.dino.body.setSize(this.dino.body.width, 58);
      this.dino.body.offset.y = 34;
    }
    if (this.cursorKeys?.down.isUp) {
      if (this.score !== 0 && !this.isGameRunning) {
        return;
      }

      this.dino.body.setSize(this.dino.body.width, 92);
      this.dino.body.offset.y = 0;
    }
  }

  handleInputs() {
    this.restart.on(
      "pointerdown",
      () => {
        this.dino.setVelocityY(0);
        this.dino.body.setSize(this.dino.body.width, 92);
        this.dino.body.offset.y = 0;
        this.physics.resume();
        this.obsticles.clear(true, true);
        this.isGameRunning = true;
        this.gameOverScreen.setAlpha(0);
        this.anims.resumeAll();
      },
      this,
    );
  }

  placeObsticle() {
    const obsticleNum = Math.floor(Math.random() * 7) + 1;
    const distance = Phaser.Math.Between(600, 900);

    let obsticle;
    if (obsticleNum > 6) {
      const enemyHeight = [20, 50];
      obsticle = this.obsticles
        .create(
          this.gameDimentions().width + distance,
          this.gameDimentions().height -
            enemyHeight[Math.floor(Math.random() * 2)],
          `enemy-bird`,
        )
        .setOrigin(0, 1);
      obsticle.play("enemy-dino-fly", 1);
      obsticle.body.height = obsticle.body.height / 1.5;
    } else {
      obsticle = this.obsticles
        .create(
          this.gameDimentions().width + distance,
          this.gameDimentions().height,
          `obsticle-${obsticleNum}`,
        )
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
    if (this.respawnTime >= 1500) {
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

    if (this.dino.body.deltaAbsY() > 0) {
      this.dino.anims.stop();
      this.dino.setTexture("dino", 0);
    } else {
      this.dino.body.height <= 58
        ? this.dino.play("dino-down-anim", true)
        : this.dino.play("dino-run", true);
    }
  }
}
