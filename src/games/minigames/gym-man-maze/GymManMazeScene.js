import Phaser from "phaser";
import { SceneInMetaGymRoom } from "games/base-scenes/scene-in-metagym-room";
import { GYM_MAN_MAZE_ACTUAL } from "../../shared";
import { Player } from "./objects";
import { InGameFont } from "GlobalStyles";
import { getGameWidth, getGameHeight } from "../../helpers";

export { GymManMazeScene };

const gridSize = 32;
const pillOffset = parseInt(gridSize / 2);
const mapScale = 2;

const SceneConfig = {
  active: false,
  visible: false,
  key: GYM_MAN_MAZE_ACTUAL,
};

class GymManMazeScene extends SceneInMetaGymRoom {
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

    let spawnPoint = this.map.findObject(
      "objects",
      (obj) => obj.name === "player",
    );

    let position = new Phaser.Geom.Point(
      spawnPoint.x * mapScale,
      spawnPoint.y * mapScale,
    );
    this.player = new Player(this, position);
    this.player.sprite.setScale(0.8);

    // world bounds
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels * mapScale,
      this.map.heightInPixels * mapScale,
    );
    this.physics.world.setBoundsCollision(true, true, true, true);
    this.player.sprite.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.player.sprite);
    const player = this.player;

    this.pills = this.physics.add.group();
    this.map.filterObjects("objects", (value, _index, _array) => {
      if (value.name == "pill") {
        let pill = this.physics.add.sprite(
          value.x * mapScale + pillOffset * mapScale,
          value.y * mapScale - pillOffset * mapScale,
          "pill",
        );
        this.pills.add(pill);
        this.pillsCount++;
      }
    });

    let pillsCount = 0;
    this.pillsAte = 0;
    this.physics.add.collider(player.sprite, this.walls);

    this.physics.add.overlap(
      player.sprite,
      this.pills,
      (_sprite, pill) => {
        pill.disableBody(true, true);
        this.pillsAte++;
        player.score += 1;
        if (pillsCount == this.pillsAte) {
          this.reset();
        }
      },
      null,
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
    for (let child of this.pills.getChildren()) {
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
      player.sprite.setVelocity(0, 0);
    }

    this.scoreText.setText("SCORE: " + player.score);
    //drawDebug();
  }

  drawDebug() {
    this.graphics.clear();
    this.player.drawDebug(this.graphics);
  }
}
