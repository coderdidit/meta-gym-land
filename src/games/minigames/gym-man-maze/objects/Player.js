import Phaser from "phaser";
import { PLAYER_KEY } from "games/shared";

export { Player };

class Player {
  constructor(scene, position, anim, dieCallback) {
    this.sprite = scene.physics.add
      .sprite(position.x, position.y, PLAYER_KEY)
      .setScale(0.4)
      .setOrigin(0.5);

    this.sprite.body.setSize(this.sprite.width * 0.8, this.sprite.height * 0.8);
    this.spawnPoint = position;
    this.anim = anim;
    this.speed = 95;
    this.moveTo = new Phaser.Geom.Point();
    this.sprite.angle = 0;

    this.score = 0;
    this.sprite.anims.play(this.anim.Stay, true);
  }

  moveLeft() {
    this.moveTo.x = -1;
    this.moveTo.y = 0;
    this.sprite.angle = -90;
  }

  moveRight() {
    this.moveTo.x = 1;
    this.moveTo.y = 0;
    this.sprite.angle = 90;
  }

  moveUp() {
    this.moveTo.x = 0;
    this.moveTo.y = -1;
    this.sprite.angle = 0;
  }

  moveDown() {
    this.moveTo.x = 0;
    this.moveTo.y = 1;
    this.sprite.angle = 180;
  }

  update() {
    this.sprite.setVelocity(
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

  drawDebug(graphics) {
    let thickness = 4;
    let alpha = 1;
    let color = 0x00ff00;

    for (var t = 0; t < 9; t++) {
      if (this.directions[t] === null || this.directions[t] === undefined) {
        continue;
      }

      if (this.directions[t].index !== -1) {
        color = 0xff0000;
      } else {
        color = 0x00ff00;
      }

      graphics.lineStyle(thickness, color, alpha);
      graphics.strokeRect(
        this.directions[t].pixelX,
        this.directions[t].pixelY,
        32,
        32,
      );
    }

    color = 0x00ff00;
    graphics.lineStyle(thickness, color, alpha);
    graphics.strokeRect(this.turningPoint.x, this.turningPoint.y, 1, 1);
  }
}
