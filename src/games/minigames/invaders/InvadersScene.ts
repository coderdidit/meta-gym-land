import Phaser from "phaser";
import { INVADERS } from "../..";
import { SceneInMetaGymRoom } from "../../base-scenes/scene-in-metagym-room";
import { Alien } from "./interface/alien";
import { AssetType } from "./interface/assets";
import { Bullet } from "./interface/bullet";
import { EnemyBullet } from "./interface/enemy-bullet";
import {
  AnimationFactory,
  AnimationType,
} from "./interface/factory/animation-factory";
import { GameState } from "./interface/game-state";
import { Kaboom } from "./interface/kaboom";
import { AlienManager } from "./interface/manager/alien-manager";
import { AssetManager } from "./interface/manager/asset-manager";
import { ScoreManager } from "./interface/manager/score-manager";
import { Ship } from "./interface/ship";
import { getGameWidth, getGameHeight } from "games/helpers";
import * as gstate from "../../../ai/gpose/state";
import * as gpose from "../../../ai/gpose/pose";
import { createTextBox } from "games/utils/text";
import { highlightTextColorNum, mainBgColorNum } from "GlobalStyles";

const SceneConfig = {
  active: false,
  visible: false,
  key: INVADERS,
};

export class InvadersScene extends SceneInMetaGymRoom {
  state!: GameState;
  assetManager!: AssetManager;
  animationFactory!: AnimationFactory;
  scoreManager!: ScoreManager;
  bulletTime = 0;
  firingTimer = 0;
  starfield!: Phaser.GameObjects.TileSprite;
  player!: Phaser.Physics.Arcade.Sprite;
  alienManager!: AlienManager;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  fireKey!: Phaser.Input.Keyboard.Key | undefined;
  flipFlop = false;
  escTextBox: any;

  constructor() {
    super({ key: INVADERS });
  }

  preload() {
    this.load.setBaseURL("/assets/minigames/invaders");
    this.load.image(AssetType.Starfield, "/images/starfield.png");
    this.load.image(AssetType.Bullet, "/images/bullet.png");
    this.load.image(AssetType.EnemyBullet, "/images/enemy-bullet.png");
    this.load.spritesheet(AssetType.Alien, "/images/invader.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.image(AssetType.Ship, "/images/player.png");
    this.load.spritesheet(AssetType.Kaboom, "/images/explode.png", {
      frameWidth: 128,
      frameHeight: 128,
    });
  }

  create() {
    // exit or restart
    this.handleExit({
      thisSceneKey: INVADERS,
    });

    const width = getGameWidth(this);
    const height = getGameHeight(this);

    this.state = GameState.Playing;

    const bg = this.add.image(width / 2, height / 2, AssetType.Starfield);
    bg.setDisplaySize(width, height);

    this.assetManager = new AssetManager(this);
    this.animationFactory = new AnimationFactory(this);
    this.cursors = this.input?.keyboard?.createCursorKeys();
    this.fireKey = this.input?.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.player = Ship.create(this);
    this.alienManager = new AlienManager(this);
    this.scoreManager = new ScoreManager(this);
    this.createTextBoxes();

    // this.fireKey.on("down", () => {
    //   switch (this.state) {
    //     case GameState.Win:
    //     case GameState.GameOver:
    //       this.restart();
    //       break;
    //   }
    // });
  }

  private createTextBoxes() {
    const width = getGameWidth(this);
    const height = getGameHeight(this);

    const escTextBoxY = height * 0.015;
    this.escTextBox = createTextBox({
      scene: this,
      x: width * 0.05,
      y: escTextBoxY,
      config: { wrapWidth: 280 },
      bg: mainBgColorNum,
      stroke: highlightTextColorNum,
    })
      .start("press ESC to go back", 3)
      .setScrollFactor(0, 0);
  }

  update() {
    this._shipKeyboardHandler();
    if (this.time.now > this.firingTimer) {
      this._enemyFires();
    }

    this.physics.overlap(
      this.assetManager.bullets,
      this.alienManager.aliens,
      this._bulletHitAliens as any,
      undefined,
      this,
    );
    this.physics.overlap(
      this.assetManager.enemyBullets,
      this.player,
      this._enemyBulletHitPlayer as any,
      undefined,
      this,
    );

    this.score = this.scoreManager.score;
  }

  private _shipKeyboardHandler() {
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setVelocity(0, 0);

    const curPose = gstate.getPose();

    if (this.cursors?.left.isDown || curPose === gpose.HTL) {
      playerBody.setVelocityX(-200);
    } else if (this.cursors?.right.isDown || curPose === gpose.HTR) {
      playerBody.setVelocityX(200);
    }

    if (
      this.fireKey?.isDown ||
      curPose === gpose.LA_UP ||
      curPose === gpose.RA_UP
    ) {
      if (!this.flipFlop) {
        this._fireBullet();
        this.flipFlop = true;
      }
    }

    if (curPose === gpose.IDLE) {
      this.flipFlop = false;
    }
  }

  private _bulletHitAliens(bullet: Bullet, alien: Alien) {
    const explosion: Kaboom = this.assetManager.explosions.get();
    bullet.kill();
    alien.kill(explosion);
    this.scoreManager.increaseScore();
    if (!this.alienManager.hasAliveAliens) {
      this.scoreManager.increaseScore(10);
      this.scoreManager.setWinText({
        scene: this,
      });
      this.state = GameState.Win;
    }
  }

  private _enemyBulletHitPlayer(_ship: any, enemyBullet: EnemyBullet) {
    const explosion: Kaboom = this.assetManager.explosions.get();
    enemyBullet.kill();
    const live: Phaser.GameObjects.Sprite =
      this.scoreManager.lives.getFirstAlive();
    if (live) {
      live.setActive(false).setVisible(false);
    }

    explosion.setPosition(this.player.x, this.player.y);
    explosion.play(AnimationType.Kaboom);

    if (this.scoreManager.noMoreLives) {
      this.scoreManager.setGameOverText({ scene: this });
      this.assetManager.gameOver();
      this.state = GameState.GameOver;
      this.player.disableBody(true, true);
    }
  }

  private _enemyFires() {
    if (!this.player.active) {
      return;
    }
    const enemyBullet: EnemyBullet = this.assetManager.enemyBullets.get();
    const randomEnemy = this.alienManager.getRandomAliveEnemy();
    if (enemyBullet && randomEnemy) {
      enemyBullet.setPosition(randomEnemy.x, randomEnemy.y);
      this.physics.moveToObject(enemyBullet, this.player, 120);
      this.firingTimer = this.time.now + 2000;
    }
  }

  private _fireBullet() {
    if (!this.player.active) {
      return;
    }

    if (this.time.now > this.bulletTime) {
      const bullet: Bullet = this.assetManager.bullets.get();
      if (bullet) {
        bullet.shoot(this.player.x, this.player.y - 18);
        this.bulletTime = this.time.now + 200;
      }
    }
  }

  restart() {
    this.state = GameState.Playing;
    this.player.enableBody(true, this.player.x, this.player.y, true, true);
    this.scoreManager.resetLives();
    this.scoreManager.hideText();
    this.alienManager.reset();
    this.assetManager.reset();
  }
}
