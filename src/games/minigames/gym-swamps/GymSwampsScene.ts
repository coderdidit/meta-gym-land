import Phaser from "phaser";
import { SceneInMetaGymRoom } from "games/base-scenes/scene-in-metagym-room";
import { GYM_SWAMPS_ACTUAL } from "../..";
import { Player } from "./objects";
import { highlightTextColorNum, mainBgColorNum } from "GlobalStyles";
import { getGameWidth, getGameHeight } from "../../helpers";
import { createTextBox } from "games/utils/text";
import TextBox from "phaser3-rex-plugins/templates/ui/textbox/TextBox";
import * as gstate from "../../../ai/gpose/state";
import * as gpose from "../../../ai/gpose/pose";
import { GYM_ROOM_BG } from "@games/gym-room-boot/assets";

export { GymSwampsScene };

const gridSize = 32;
const mapScale = 2;

const SceneConfig = {
  active: false,
  visible: false,
  key: GYM_SWAMPS_ACTUAL,
};

class GymSwampsScene extends SceneInMetaGymRoom {
  map!: Phaser.Tilemaps.Tilemap;
  walls: any;
  player!: Player;
  pills!: Phaser.Physics.Arcade.Group;
  pillsCount = 0;
  pillsAte = 0;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  graphics!: Phaser.GameObjects.Graphics;
  scoreText!: TextBox;
  flipFlop = false;
  floor: Phaser.Tilemaps.TilemapLayer | null = null;

  constructor() {
    super(SceneConfig);
  }

  create() {
    // basics
    this.handleExit({
      thisSceneKey: GYM_SWAMPS_ACTUAL,
    });

    const tiles = "swamp-tiles";
    this.map = this.make.tilemap({
      key: "swamp-map",
      tileWidth: gridSize,
      tileHeight: gridSize,
    });

    this.cameras.main.backgroundColor.setTo(179, 201, 217);

    const tileset = this.map.addTilesetImage(tiles);
    if (!tileset) throw new Error("Tileset not found");
    this.walls = this.map.createLayer("walls", [tileset]);
    if (!this.walls) throw new Error("Walls layer not found");
    this.walls.setCollisionByProperty({ collides: true });
    this.walls.setScale(mapScale);

    this.floor = this.map.createLayer("floor", [tileset]);
    if (!this.floor) throw new Error("Floor layer not found");
    this.floor.setScale(mapScale);

    const spawnPoint = this.map.findObject(
      "objects",
      (obj) => obj.name === "player",
    );

    if (!spawnPoint?.x || !spawnPoint?.y) {
      throw Error("spawnPoint not set");
    }

    this.player = new Player({
      scene: this,
      x: spawnPoint.x * mapScale,
      y: spawnPoint.y * mapScale,
    });
    this.player;

    // world bounds
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels * mapScale,
      this.map.heightInPixels * mapScale,
    );
    this.physics.world.setBoundsCollision(true, true, true, true);
    this.player.setCollideWorldBounds(true);

    const roundPixels = true;
    this.cameras.main.startFollow(this.player, roundPixels, 0.1, 0.1);
    const player = this.player;

    this.pills = this.physics.add.group();
    this.map.filterObjects(
      "objects",
      (value: any, _index: number, _array: Phaser.GameObjects.GameObject[]) => {
        if (["bottle", "fish"].includes(value.name)) {
          const pill = this.physics.add.sprite(
            value.x * mapScale,
            value.y * mapScale,
            value.name,
          );
          this.pills.add(pill);
          this.pillsCount++;
          return true;
        }
        return false;
      },
    );

    this.tweens.add({
      targets: this.pills.getChildren(),
      props: {
        angle: {
          getEnd: function (target: { angle: number }, _key: any, _value: any) {
            let a = 45;
            if (Math.random() > 0.5) {
              a = 60;
            }
            // direction
            if (Math.random() > 0.5) {
              return target.angle + a;
            } else {
              return target.angle - a;
            }
          },

          getStart: function (
            target: { angle: number },
            _key: any,
            _value: any,
          ) {
            return target.angle;
          },
        },
      },
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      duration: 500,
    });

    const pillsCount = 0;
    this.pillsAte = 0;
    this.physics.add.collider(player, this.walls);

    this.physics.add.overlap(
      player,
      this.pills,
      (_sprite: any, pill: any) => {
        pill.disableBody(true, true);
        this.pillsAte++;
        player.score += 1;
        if (pillsCount == this.pillsAte) {
          this.reset();
        }
      },
      undefined,
      this,
    );

    if (this.input && this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
    }

    this.graphics = this.add.graphics();

    this.createTextBoxes();
  }

  private reset() {
    for (const child of this.pills.getChildren() as any[]) {
      child.enableBody(false, child.x, child.y, true, true);
    }
    this.pillsAte = 0;
  }

  private createTextBoxes() {
    const width = getGameWidth(this);
    const height = getGameHeight(this);

    const escTextBoxY = height * 0.015;
    const escTextBox = createTextBox({
      scene: this,
      x: width * 0.05,
      y: escTextBoxY,
      config: { wrapWidth: 280 },
      bg: mainBgColorNum,
      stroke: highlightTextColorNum,
    })
      .start("press ESC to go back", 10)
      .setScrollFactor(0, 0);

    this.scoreText = createTextBox({
      scene: this,
      x: width * 0.05,
      y: escTextBoxY + escTextBox.height * 1.8,
      config: { wrapWidth: 280 },
      bg: 0xfffefe,
      stroke: 0x00ff00,
      align: "center",
      txtColor: "#212125",
    })
      .setScrollFactor(0, 0)
      .start("SCORE: " + this.player.score, 0);

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
    hintTextBox.start("🤖 Welcome in MetaGymLand Canals", 10);
  }

  update() {
    const player = this.player;
    const cursors = this.cursors;
    const curPose = gstate.getPose();

    let inMove = false;
    if (cursors.left.isDown || curPose === gpose.HTL) {
      if (!this.flipFlop) {
        this.flipFlop = true;
        player.setTurn(Phaser.LEFT);
        inMove = true;
      }
    } else if (cursors.right.isDown || curPose === gpose.HTR) {
      if (!this.flipFlop) {
        this.flipFlop = true;
        player.setTurn(Phaser.RIGHT);
        inMove = true;
      }
    } else if (
      cursors.up.isDown ||
      curPose === gpose.LA_UP ||
      curPose === gpose.RA_UP ||
      curPose === gpose.BA_UP
    ) {
      const left = player.angle == -90;
      const rigth = player.angle == 90;
      const up = player.angle == 0;
      const down = player.angle == -180;
      if (left) {
        player.moveTo.x = -1;
        player.moveTo.y = 0;
      } else if (rigth) {
        player.moveTo.x = 1;
        player.moveTo.y = 0;
      } else if (up) {
        player.moveTo.x = 0;
        player.moveTo.y = -1;
      } else if (down) {
        player.moveTo.x = 0;
        player.moveTo.y = 1;
      }
      inMove = true;
    } else {
      this.flipFlop = false;
      player.setTurn(Phaser.NONE);
    }

    if (inMove) {
      player.update();
    } else {
      player.setVelocity(0, 0);
    }

    this.scoreText.setText("SCORE: " + player.score);
    this.score = this.player.score;
  }
}
