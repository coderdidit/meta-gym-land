import Phaser from "phaser";
import { SceneInMetaGymRoom } from "games/base-scenes/scene-in-metagym-room";
import { GYM_MAN_MAZE_ACTUAL } from "../../shared";
import { Player } from "./objects";
import { highlightTextColorNum, mainBgColorNum } from "GlobalStyles";
import { getGameWidth, getGameHeight } from "../../helpers";
import { createTextBox } from "games/utils/text";
import TextBox from "phaser3-rex-plugins/templates/ui/textbox/TextBox";
import * as gstate from "../../../ai/gpose/state";
import * as gpose from "../../../ai/gpose/pose";

export { GymManMazeScene };

const gridSize = 32;
const pillOffset = gridSize / 2;
const mapScale = 2;

const SceneConfig = {
  active: false,
  visible: false,
  key: GYM_MAN_MAZE_ACTUAL,
};

class GymManMazeScene extends SceneInMetaGymRoom {
  map!: Phaser.Tilemaps.Tilemap;
  walls: any;
  player!: Player;
  pills!: Phaser.Physics.Arcade.Group;
  pillsCount = 0;
  pillsAte = 0;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  graphics!: Phaser.GameObjects.Graphics;
  scoreText!: TextBox;
  constructor() {
    super(SceneConfig);
  }

  create() {
    // this.cameras.main.backgroundColor.setTo(179, 201, 217);

    const tiles = "pacman-tiles";
    this.map = this.make.tilemap({
      key: "map",
      tileWidth: gridSize,
      tileHeight: gridSize,
    });
    const tileset = this.map.addTilesetImage(tiles, tiles, gridSize, gridSize);

    // position map
    const width = getGameWidth(this);
    const height = getGameHeight(this);

    this.walls = this.map.createLayer("walls", [tileset]);
    this.walls.setCollisionByProperty({ collides: true });
    this.walls.setScale(mapScale);

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
    this.player.setScale(0.8);

    // world bounds
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels * mapScale,
      this.map.heightInPixels * mapScale,
    );
    this.physics.world.setBoundsCollision(true, true, true, true);
    this.player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.player);
    const player = this.player;

    this.pills = this.physics.add.group();
    this.map.filterObjects(
      "objects",
      (value: any, _index: number, _array: Phaser.GameObjects.GameObject[]) => {
        if (value.name == "pill") {
          const pill = this.physics.add.sprite(
            value.x * mapScale + pillOffset * mapScale,
            value.y * mapScale - pillOffset * mapScale,
            "pill",
          );
          this.pills.add(pill);
          this.pillsCount++;
        }
      },
    );

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

    this.cursors = this.input.keyboard.createCursorKeys();

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
    hintTextBox.start("🤖 Welcome in MetaGymLand Swamps", 10);
  }

  update() {
    const player = this.player;
    const cursors = this.cursors;
    const curPose = gstate.getPose();

    let inMove = false;
    if (cursors.left.isDown || curPose === gpose.HTL) {
      player.setTurn(Phaser.LEFT);
      inMove = true;
    } else if (cursors.right.isDown || curPose === gpose.HTR) {
      player.setTurn(Phaser.RIGHT);
      inMove = true;
    } else if (
      cursors.up.isDown ||
      curPose === gpose.LA_UP ||
      curPose === gpose.RA_UP ||
      curPose === gpose.BA_UP
    ) {
      player.setTurn(Phaser.UP);
      inMove = true;
    } else if (cursors.down.isDown) {
      player.setTurn(Phaser.DOWN);
      inMove = true;
    } else {
      player.setTurn(Phaser.NONE);
    }

    if (inMove) {
      player.update();
    } else {
      player.setVelocity(0, 0);
    }

    this.scoreText.setText("SCORE: " + player.score);
  }
}
