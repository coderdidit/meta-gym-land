import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "../helpers";
import { Player } from "../objects";
import { PLAYER_SCALE, FLY_FIT_SCENE } from "..";
import { BTC, AIRPLANE, GYM_ROOM_BG } from "../gym-room-boot/assets";
import {
  createTextBox,
  GameUI,
  TimeoutManager,
  TweenPresets,
  ParticlePresets,
} from "../utils";
import party, { sources } from "party-js";
import * as gstate from "../../ai/gpose/state";
import * as gpose from "../../ai/gpose/pose";
import { InGameFont } from "../../GlobalStyles";
import { SceneInMetaGymRoom } from "../base-scenes/scene-in-metagym-room";

const SceneConfig = {
  active: false,
  visible: false,
  key: FLY_FIT_SCENE,
};

const timeoutManager = new TimeoutManager();
const playerNgSpeed = 30;
const playerSpeed = 80;
const btcScale = 0.11;
const btcCnt = 12;

export class FlyFitScene extends SceneInMetaGymRoom {
  won!: boolean;
  graphics!: Phaser.GameObjects.Graphics;
  scoreBoard!: Phaser.GameObjects.Text;
  score!: number;
  cursorKeys: any;
  player!: any; // specify type later
  bGtiTleSprite!: Phaser.GameObjects.TileSprite;
  constructor() {
    super(SceneConfig);
  }

  create() {
    this.cameras.main.backgroundColor.setTo(113, 190, 208);
    // basic props
    this.won = false;
    const width = getGameWidth(this);
    const height = getGameHeight(this);

    // TODO: check this later
    // this.graphics = this.add.graphics();
    // this.graphics.clear();
    // const rect = new Phaser.Geom.Rectangle(0, 0, width, height);
    // const starGraphics = this.make.graphics({x: 0, y: 0, add: false});
    // const bgGraphics = starGraphics
    //   .fillGradientStyle(0xdce7fc, 0x82b1ff, 0x4281ff, 0x4287f5, 1)
    //   .fillRectShape(rect);
    // bgGraphics.generateTexture("flySky", width, height);

    const bg = this.add.image(width, height, GYM_ROOM_BG);
    bg.setDisplaySize(width * 1.5, height * 1.5);
    this.physics.world.setBounds(0, 0, width * 1.5, height * 1.5);

    // basics
    this.handleExit({
      thisSceneKey: FLY_FIT_SCENE,
      callbackOnExit: () => {
        timeoutManager.clear();
      },
    });

    // text
    this.scoreBoard = GameUI.createScoreBoard(this, width, height, 0);
    GameUI.createEscHint(this, width, height, 10);

    // hint
    const hintTextBox = GameUI.createHintTextBox(
      this,
      width,
      height,
      "🤖 Look! it's flying tokens airdrop\n" +
        "try to catch them all\n" +
        "by moving your body\n\n" +
        "like a BIRD",
      50,
    );

    timeoutManager.setTimeout(() => {
      if (!hintTextBox) return;
      hintTextBox.start("🤖", 50);
    }, 15000);

    this.score = 0;
    const btcGroup = this.physics.add.group({
      key: BTC,
      quantity: btcCnt,
      collideWorldBounds: true,
    });

    TweenPresets.rotatingAnimation(this, btcGroup.getChildren(), 500);

    const btcRect = new Phaser.Geom.Rectangle(
      width * 0.04,
      height * 0.13,
      width * 1.5,
      height * 1.5,
    );
    // for degub
    // this.graphics.fillGradientStyle(0x023246, 0x1E0338, 0x300240, 0x370232, 1)
    //     .fillRectShape(btcRect);
    btcGroup.getChildren().forEach((sprite) => {
      if (sprite instanceof Phaser.Physics.Arcade.Sprite) {
        sprite.setScale(btcScale);
        sprite.setDepth(1);
      }
    });
    Phaser.Actions.RandomRectangle(btcGroup.getChildren(), btcRect);

    // player elements
    const plane = this.add
      .sprite(0, 0, AIRPLANE)
      .setScale(PLAYER_SCALE * 0.12)
      .setDepth(1);

    // player sprite inside player container
    const playerInner = new Player({
      scene: this,
      x: 0,
      y: 0,
    })
      .setOrigin(0.5, 0.5)
      .setScale(PLAYER_SCALE)
      .setDepth(2);

    this.cursorKeys = playerInner.cursorKeys;

    // this made the plane to have body element
    this.physics.world.enable(plane);
    this.add.existing(plane);
    this.player = this.add.container(width, height, [plane, playerInner]);

    this.physics.world.enableBody(this.player);

    this.player.body.setCollideWorldBounds(true);

    const roundPixels = true;
    this.cameras.main.startFollow(this.player, roundPixels, 0.1, 0.1);

    const collectBtc = (_avatar: any, btcItem: { destroy: () => void }) => {
      btcItem.destroy();
      this.score += 1;
      this.scoreBoard.setText(`SCORE: ${this.score}`);
    };

    this.physics.add.overlap(plane, btcGroup, collectBtc, undefined, this);
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
      "You catched the whole\n" +
      "flying tokens airdrop 🎉\n" +
      "\n\n" +
      "Press X to 🎮 restart\n" +
      "Press ESC to exit";

    const youWonText = createTextBox({
      scene: this,
      x: width / 2,
      y: height / 2,
      config: { wrapWidth: 280 },
    });
    youWonText.setOrigin(0.5).setDepth(3).setScrollFactor(0, 0);
    youWonText.start(msg, 50);
  }

  // eslint-disable-next-line no-unused-vars
  update(_time: any, _delta: any) {
    if (!this.won && this.score === btcCnt) {
      this.won = true;
      this.youWonMsg();
      return;
    }
    // Every frame, we update the player
    this.handlePlayerMoves();
  }

  private handlePlayerMoves() {
    const player = this.player;
    player.body.setAngularVelocity(0);
    player.body.setVelocity(0, 0);
    player.body.setAcceleration(0);

    const curPose = gstate.getPose();
    if (this.cursorKeys?.up.isDown || curPose === gpose.BA_UP) {
      const ng = player.angle - 90;
      const vec = this.physics.velocityFromAngle(ng, playerSpeed);
      player.body.setVelocity(vec.x, vec.y);
    } else if (this.cursorKeys?.left.isDown || curPose === gpose.HTL) {
      player.body.setAngularVelocity(playerNgSpeed * -1);
    } else if (this.cursorKeys?.right.isDown || curPose === gpose.HTR) {
      player.body.setAngularVelocity(playerNgSpeed);
    }
  }
}
