import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "../helpers";
import { PlayerWithName } from "../objects";
import { MATRIX } from "..";
import { FONT, PILL_BLUE, PILL_RED } from "../gym-room-boot/assets";
import { createTextBox } from "../utils/text";
import { mainBgColorNum, highlightTextColorNum } from "../../GlobalStyles";
import { SceneInMetaGymRoom } from "../base-scenes/scene-in-metagym-room";

const SceneConfig = {
  active: false,
  visible: false,
  key: MATRIX,
};

export class MatrixScene extends SceneInMetaGymRoom {
  player: any;

  constructor() {
    super(SceneConfig);
  }

  create() {
    // basic props
    const width = getGameWidth(this);
    const height = getGameHeight(this);

    // basics
    this.handleExit({
      thisSceneKey: MATRIX,
    });

    // matrix
    const codeRain = {
      width: 60,
      height: 40,
      cellWidth: 32,
      cellHeight: 32,
      getPoints: function (quantity: number) {
        const cols = new Array(codeRain.width).fill(0);
        const lastCol = cols.length - 1;
        const Between = Phaser.Math.Between;
        const RND = Phaser.Math.RND;
        const points = [];

        for (let i = 0; i < quantity; i++) {
          const col = Between(0, lastCol);
          let row = (cols[col] += 1);

          if (RND.frac() < 0.01) {
            row *= RND.frac();
          }

          row %= codeRain.height;
          row |= 0;

          points[i] = new Phaser.Math.Vector2(32 * col, 32 * row);
        }

        return points;
      },
    };

    this.add.particles(FONT).createEmitter({
      alpha: { start: 1, end: 0.25, ease: "Expo.easeOut" },
      angle: 0,
      blendMode: "ADD",
      emitZone: { source: codeRain, type: "edge", quantity: 2000 },
      frame: Phaser.Utils.Array.NumberArray(8, 58),
      frequency: 100,
      lifespan: 6000,
      quantity: 25,
      scale: -0.5,
      tint: 0x0066ff00,
    });

    createTextBox({
      scene: this,
      x: width * 0.05,
      y: height * 0.015,
      config: { wrapWidth: 280 },
      bg: mainBgColorNum,
      stroke: highlightTextColorNum,
    }).start("press ESC to go back", 10);

    const hintTextBox = createTextBox({
      scene: this,
      x: width / 2 + width / 4,
      y: height * 0.015,
      config: { wrapWidth: 280 },
      bg: 0xfffefe,
      stroke: 0x00ff00,
      align: "center",
      txtColor: "#212125",
    });
    hintTextBox.setDepth(1);
    hintTextBox.setScrollFactor(0, 0);
    hintTextBox.start(
      "🤖 Welcome in MetaGymLand Matrix\n\n" +
        "choose\n" +
        "RED PILL or BLUE PILL?\n" +
        "You can fly in this room",
      50,
    );

    // pills
    const redPill = this.physics.add
      .sprite(width * 0.16, height * 0.32, PILL_RED)
      .setName(PILL_RED);
    const bluePill = this.physics.add
      .sprite(width * 0.82, height * 0.32, PILL_BLUE)
      .setName(PILL_BLUE);
    const pillis = [redPill, bluePill];

    // player
    this.player = new PlayerWithName({
      scene: this,
      x: Phaser.Math.Between(width * 0.1, this.physics.world.bounds.width - 80),
      y: this.physics.world.bounds.height,
      name: this.selectedAvatar?.name,
    });

    this.player.setDepth(1);
    this.player.body.setCollideWorldBounds(true);

    const onCollide = (avatar: any, item: { name: string }) => {
      if (item.name === PILL_RED) {
        this.cameras.main.setBackgroundColor("#23BD32");
        hintTextBox.start("🤖", 50);
        const info = createTextBox({
          scene: this,
          x: width / 2,
          y: height / 2,
          config: { wrapWidth: 280 },
          bg: 0x010000,
          stroke: 0x3b6a59,
          align: "center",
          txtColor: "#63E778",
        })
          .setOrigin(0.5)
          .setDepth(1)
          .setScrollFactor(0, 0)
          .start(
            "🤖 You have chosen the RED PILL\n" +
              "Good choice!\n\n" +
              "NOW, join our social channels\n" +
              "if you would like to see\n" +
              "how deep the rabbit hole goes [CLICK THIS MESSAGE]",
            50,
          );
        info.setInteractive({ useHandCursor: true });
        info.on("pointerdown", openExternalLink, this);
      } else {
        hintTextBox.start("🤖", 50);
        createTextBox({
          scene: this,
          x: width / 2,
          y: height / 2,
          config: { wrapWidth: 280 },
          bg: 0xfffefe,
          stroke: highlightTextColorNum,
          align: "center",
          txtColor: "#212125",
        })
          .setOrigin(0.5)
          .setDepth(1)
          .setScrollFactor(0, 0)
          .start(
            "🤖 You have chosen\n" + "the BLUE PILL\n\n" + "taking you back...",
            10,
          );
        setTimeout(() => {
          if (this.exit && this.scene.key === MATRIX) {
            this.exit();
          }
        }, 3500);
      }
      pillis.forEach((i) => i.destroy());
    };
    this.physics.add.collider(this.player, pillis, onCollide, undefined, this);
  }

  // eslint-disable-next-line no-unused-vars
  update(time: any, delta: any) {
    this.player?.update();
  }
}

function openExternalLink() {
  const url = "https://app.metagymland.com/#/socials";
  const s = window.open(url, "_blank");
  if (s && s.focus) {
    s.focus();
  } else if (!s) {
    window.location.href = url;
  }
}
