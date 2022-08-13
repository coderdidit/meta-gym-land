import Phaser from "phaser";
import { PLAYER_KEY } from "games/shared";

export { Player };

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, PLAYER_KEY);
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setOrigin(0.5);

    this.body.setSize(this.width * 0.8, this.height * 0.8);
    this.spawnPoint = new Phaser.Geom.Point(x, y);
    this.speed = 95;
    this.moveTo = new Phaser.Geom.Point();
    this.angle = 0;

    this.score = 0;
  }

  moveLeft() {
    this.moveTo.x = -1;
    this.moveTo.y = 0;
    this.angle = -90;
  }

  moveRight() {
    this.moveTo.x = 1;
    this.moveTo.y = 0;
    this.angle = 90;
  }

  moveUp() {
    this.moveTo.x = 0;
    this.moveTo.y = -1;
    this.angle = 0;
  }

  moveDown() {
    this.moveTo.x = 0;
    this.moveTo.y = 1;
    this.angle = 180;
  }

  update() {
    this.body.setVelocity(
      this.moveTo.x * this.speed,
      this.moveTo.y * this.speed,
    );
  }

  setTurn(turnTo) {
    this.move(turnTo);
  }

  move(direction) {
    this.playing = true;
    this.current = direction;

    switch (direction) {
      case Phaser.LEFT:
        this.moveLeft();
        break;

      case Phaser.RIGHT:
        this.moveRight();
        break;

      case Phaser.UP:
        this.moveUp();
        break;

      case Phaser.DOWN:
        this.moveDown();
        break;
    }
  }
}
