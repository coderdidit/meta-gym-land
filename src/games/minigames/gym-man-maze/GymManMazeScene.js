import Phaser from "phaser";
import { SceneInMetaGymRoom } from "games/base-scenes/scene-in-metagym-room";
import { GYM_MAN_MAZE_ACTUAL } from "../../shared";
import { Player, Ghost } from "./objects";
import { InGameFont } from "GlobalStyles";
import { getGameWidth, getGameHeight } from "../../helpers";

export { GymManMazeScene };

const gridSize = 32;
const offset = parseInt(gridSize / 2);

const Animation = {
  Player: {
    Stay: "player-stay",
  },
};

const SceneConfig = {
  active: false,
  visible: false,
  key: GYM_MAN_MAZE_ACTUAL,
};

class GymManMazeScene extends SceneInMetaGymRoom {
  constructor() {
    super(SceneConfig);
  }

  setupAnims() {
    const spritesheet = "pacman-spritesheet";

    this.anims.create({
      key: Animation.Player.Stay,
      frames: [{ key: spritesheet, frame: 9 }],
      frameRate: 20,
    });
  }

  create() {
    const tiles = "pacman-tiles";
    this.setupAnims();

    this.map = this.make.tilemap({
      key: "map",
      tileWidth: gridSize,
      tileHeight: gridSize,
    });
    const tileset = this.map.addTilesetImage(tiles);

    // position map
    const width = getGameWidth(this);
    const height = getGameHeight(this);
    this.cameras.main.scrollX = -this.map.widthInPixels / 2;
    this.cameras.main.scrollY = -this.map.heightInPixels / 3;

    this.layer1 = this.map.createStaticLayer("Layer 1", tileset, 0, 0);
    this.layer1.setCollisionByProperty({ collides: true });

    let spawnPoint = this.map.findObject(
      "Objects",
      (obj) => obj.name === "Player",
    );

    let position = new Phaser.Geom.Point(
      spawnPoint.x + offset,
      spawnPoint.y - offset,
    );
    this.player = new Player(this, position, Animation.Player, () => {
      if (this.player.life <= 0) {
        this.newGame();
      } else {
        this.respawn();
      }
    });

    const player = this.player;

    this.pills = this.physics.add.group();
    this.map.filterObjects("Objects", (value, _index, _array) => {
      if (value.name == "Pill") {
        let pill = this.physics.add.sprite(
          value.x + offset,
          value.y - offset,
          "pill",
        );
        this.pills.add(pill);
        this.pillsCount++;
      }
    });

    let pillsCount = 0;
    this.pillsAte = 0;
    this.physics.add.collider(player.sprite, this.layer1);

    this.physics.add.overlap(
      player.sprite,
      this.pills,
      (_sprite, pill) => {
        pill.disableBody(true, true);
        this.pillsAte++;
        player.score += 10;
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

  newGame() {
    this.reset();
    const player = this.player;
    player.score = 0;
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
