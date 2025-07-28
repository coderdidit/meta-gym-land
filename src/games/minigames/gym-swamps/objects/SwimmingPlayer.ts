import Phaser from "phaser";
import { PLAYER_KEY } from "games";

export { Player };

type playerConstructorParams = {
  scene: Phaser.Scene;
  x: number;
  y: number;
};
class Player extends Phaser.Physics.Arcade.Sprite {
  spawnPoint: Phaser.Geom.Point;
  speed = 95;
  moveTo = new Phaser.Geom.Point();
  score = 0;
  current = Phaser.UP;
  angle = 0;

  constructor(params: playerConstructorParams) {
    const { scene, x, y } = params;
    super(scene, x, y, PLAYER_KEY);

    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setOrigin(0.5);

    const collisionDimm = 0.5;

    if (this.body) {
      this.body.setSize(
        this.width * collisionDimm,
        this.height * collisionDimm,
      );
    }
    this.spawnPoint = new Phaser.Geom.Point(x, y);
  }

  moveLeft() {
    // this.moveTo.x = -1;
    // this.moveTo.y = 0;
    this.angle -= 90;
  }

  moveRight() {
    // this.moveTo.x = 1;
    // this.moveTo.y = 0;
    this.angle += 90;
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
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(this.moveTo.x * this.speed, this.moveTo.y * this.speed);
  }

  setTurn(turnTo: number) {
    this.move(turnTo);
  }

  move(direction: number) {
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
