import Phaser from "phaser";
import { SceneInMetaGymRoom } from "games/base-scenes/scene-in-metagym-room";
import { GYM_MAN_MAZE_ACTUAL } from "../../shared";
import { Player } from "./objects";
import { InGameFont } from "GlobalStyles";
import { getGameWidth, getGameHeight } from "../../helpers";

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
  scoreText!: Phaser.GameObjects.Text;
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

    this.scoreText = this.add
      .text(width - width * 0.2, height * 0.1, "SCORE: " + player.score)
      .setFontFamily(InGameFont)
      .setFontSize(18)
      .setColor("#ffffff")
      .setScrollFactor(0, 0);
  }

  reset() {
    for (const child of this.pills.getChildren() as any[]) {
      child.enableBody(false, child.x, child.y, true, true);
    }
    this.pillsAte = 0;
  }

  update() {
    const player = this.player;
    const cursors = this.cursors;

    let inMove = false;
    if (cursors.left.isDown) {
      player.setTurn(Phaser.LEFT);
      inMove = true;
    } else if (cursors.right.isDown) {
      player.setTurn(Phaser.RIGHT);
      inMove = true;
    } else if (cursors.up.isDown) {
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
