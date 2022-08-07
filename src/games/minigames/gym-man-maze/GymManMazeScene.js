import Phaser from "phaser";
import { SceneInMetaGymRoom } from "games/base-scenes/scene-in-metagym-room";
import { GYM_MAN_MAZE_ACTUAL } from "../../shared";
import { Player, Ghost } from "./objects";

export { GymManMazeScene };

const width = 800;
const height = 625;
const gridSize = 32;
const offset = parseInt(gridSize / 2);

const Animation = {
  Player: {
    Eat: "player-eat",
    Stay: "player-stay",
    Die: "player-die",
  },
  Ghost: {
    Blue: {
      Move: "ghost-blue-move",
    },

    Orange: {
      Move: "ghost-orange-move",
    },

    White: {
      Move: "ghost-white-move",
    },

    Pink: {
      Move: "ghost-pink-move",
    },

    Red: {
      Move: "ghost-red-move",
    },
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
      key: Animation.Player.Eat,
      frames: this.anims.generateFrameNumbers(spritesheet, {
        start: 9,
        end: 13,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: Animation.Player.Stay,
      frames: [{ key: spritesheet, frame: 9 }],
      frameRate: 20,
    });

    this.anims.create({
      key: Animation.Player.Die,
      frames: this.anims.generateFrameNumbers(spritesheet, {
        start: 6,
        end: 8,
      }),
      frameRate: 1,
    });

    this.anims.create({
      key: Animation.Ghost.Blue.Move,
      frames: this.anims.generateFrameNumbers(spritesheet, {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: Animation.Ghost.Orange.Move,
      frames: this.anims.generateFrameNumbers(spritesheet, {
        start: 4,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: Animation.Ghost.White.Move,
      frames: this.anims.generateFrameNumbers(spritesheet, {
        start: 4,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: Animation.Ghost.Pink.Move,
      frames: this.anims.generateFrameNumbers(spritesheet, {
        start: 14,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: Animation.Ghost.Red.Move,
      frames: this.anims.generateFrameNumbers(spritesheet, {
        start: 16,
        end: 17,
      }),
      frameRate: 10,
      repeat: -1,
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

    this.layer1 = this.map.createStaticLayer("Layer 1", tileset, 0, 0);
    this.layer1.setCollisionByProperty({ collides: true });

    this.layer2 = this.map.createStaticLayer("Layer 2", tileset, 0, 0);
    this.layer2.setCollisionByProperty({ collides: true });

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
    this.map.filterObjects("Objects", (value, index, array) => {
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
    this.physics.add.collider(player.sprite, this.layer2);

    this.physics.add.overlap(
      player.sprite,
      this.pills,
      (sprite, pill) => {
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
      .text(25, 595, "Score: " + player.score)
      .setFontFamily("Arial")
      .setFontSize(18)
      .setColor("#ffffff");
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

    player.setDirections(
      this.getDirection(this.map, this.layer1, player.sprite),
    );

    player.setTurningPoint(this.getTurningPoint(this.map, player.sprite));

    const cursors = this.cursors;
    if (cursors.left.isDown) {
      player.setTurn(Phaser.LEFT);
    } else if (cursors.right.isDown) {
      player.setTurn(Phaser.RIGHT);
    } else if (cursors.up.isDown) {
      player.setTurn(Phaser.UP);
    } else if (cursors.down.isDown) {
      player.setTurn(Phaser.DOWN);
    } else {
      player.setTurn(Phaser.NONE);
    }

    player.update();

    this.scoreText.setText("Score: " + player.score);

    for (let i = player.life; i < 3; i++) {
      let image = this.livesImage[i];
      if (image) {
        image.alpha = 0;
      }
    }

    if (player.active) {
      if (player.sprite.x < 0 - offset) {
        player.sprite.setPosition(width + offset, player.sprite.y);
      } else if (player.sprite.x > width + offset) {
        player.sprite.setPosition(0 - offset, player.sprite.y);
      }
    }

    //drawDebug();
  }

  drawDebug() {
    this.graphics.clear();
    this.player.drawDebug(this.graphics);
  }

  getDirection(map, layer, sprite) {
    let directions = [];
    let sx = Phaser.Math.FloorTo(sprite.x);
    let sy = Phaser.Math.FloorTo(sprite.y);
    let currentTile = this.map.getTileAtWorldXY(sx, sy, true);
    if (currentTile) {
      var x = currentTile.x;
      var y = currentTile.y;

      directions[Phaser.LEFT] = this.map.getTileAt(x - 1, y, true, layer);
      directions[Phaser.RIGHT] = this.map.getTileAt(x + 1, y, true, layer);
      directions[Phaser.UP] = this.map.getTileAt(x, y - 1, true, layer);
      directions[Phaser.DOWN] = this.map.getTileAt(x, y + 1, true, layer);
    }

    return directions;
  }

  getTurningPoint(map, sprite) {
    let turningPoint = new Phaser.Geom.Point();
    let sx = Phaser.Math.FloorTo(sprite.x);
    let sy = Phaser.Math.FloorTo(sprite.y);
    let currentTile = this.map.getTileAtWorldXY(sx, sy, true);
    if (currentTile) {
      turningPoint.x = currentTile.pixelX + offset;
      turningPoint.y = currentTile.pixelY + offset;
    }

    return turningPoint;
  }
}
