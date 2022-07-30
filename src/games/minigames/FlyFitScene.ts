import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "../helpers";
import { Player } from "../objects";
import { PLAYER_KEY, PLAYER_SCALE, FLY_FIT_SCENE } from "../shared";
import { BTC, AIRPLANE } from "../gym-room-boot/assets";
import { createTextBox } from "../utils/text";
import party, { sources } from "party-js";
import * as gstate from "../../ai/gpose/state";
import * as gpose from "../../ai/gpose/pose";
import { mainBgColor, InGameFont } from "../../GlobalStyles";
import { SceneInMetaGymRoom } from "../base-scenes/ts/scene-in-metagym-room";

const SceneConfig = {
  active: false,
  visible: false,
  key: FLY_FIT_SCENE,
};

const roboTextTimeouts: NodeJS.Timeout[] = [];
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
  constructor() {
    super(SceneConfig);
  }

  create() {
    // basic props
    this.won = false;
    const width = getGameWidth(this);
    const height = getGameHeight(this);

    this.graphics = this.add.graphics();
    this.graphics.clear();
    const rect = new Phaser.Geom.Rectangle(0, 0, width, height);
    this.graphics
      .fillGradientStyle(0xdce7fc, 0x82b1ff, 0x4281ff, 0x4287f5, 1)
      .fillRectShape(rect);

    // basics
    this.handleExit({
      thisSceneKey: FLY_FIT_SCENE,
      callbackOnExit: () => {
        roboTextTimeouts.forEach((t) => clearTimeout(t));
      },
    });

    // text
    this.scoreBoard = this.add.text(width * 0.05, height * 0.015, "SCORE: 0", {
      font: `900 20px ${InGameFont}`,
    });
    this.add.text(width * 0.05, height * 0.04, "press ESC to go back", {
      font: `900 17px ${InGameFont}`,
    });

    // hint
    const hintTextBox = createTextBox({
      scene: this,
      x: width / 2 + width / 4,
      y: height * 0.015,
      config: { wrapWidth: 280 },
    });
    hintTextBox.setDepth(1);
    hintTextBox.setScrollFactor(0, 0);
    hintTextBox.start("🤖", 50);
    roboTextTimeouts.push(
      setTimeout(() => {
        if (!hintTextBox) return;
        hintTextBox.start(
          "🤖 Look! it's flying tokens airdrop\n" +
            "try to catch them all\n" +
            "by moving your body\n\n" +
            "like a BIRD",
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

    this.score = 0;
    const btcGroup = this.physics.add.group({
      key: BTC,
      quantity: btcCnt,
      collideWorldBounds: true,
    });

    const btcRect = new Phaser.Geom.Rectangle(
      width * 0.04,
      height * 0.13,
      width - width * 0.04,
      height - height * 0.13,
    );
    // for degub
    // this.graphics.fillGradientStyle(0x023246, 0x1E0338, 0x300240, 0x370232, 1)
    //     .fillRectShape(btcRect);
    btcGroup.getChildren().forEach((item) => {
      item.body.gameObject?.setScale(btcScale).setDepth(1);
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
      key: PLAYER_KEY,
    })
      .setOrigin(0.5, 0.5)
      .setScale(PLAYER_SCALE)
      .setDepth(2);

    this.cursorKeys = playerInner.cursorKeys;

    // this made the plane to have body element
    this.physics.world.enable(plane);
    this.add.existing(plane);
    this.player = this.add.container(width / 2, height / 2, [
      plane,
      playerInner,
    ]);

    this.physics.world.enableBody(this.player);

    this.player.body.setCollideWorldBounds(true);

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
    youWonText.setOrigin(0.5).setDepth(1).setScrollFactor(0, 0);
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

  handlePlayerMoves() {
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
