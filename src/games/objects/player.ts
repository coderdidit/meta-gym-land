import Phaser from "phaser";
import * as gstate from "../../ai/gpose/state";
import * as gpose from "../../ai/gpose/pose";
import { PLAYER_KEY } from "..";

type playerConstructorParams = {
  scene: Phaser.Scene;
  x: number;
  y: number;
};
export class Player extends Phaser.Physics.Arcade.Sprite {
  cursorKeys;
  speed = 150;
  // TODO
  score = 0;

  constructor(params: playerConstructorParams) {
    const { scene, x, y } = params;
    super(scene, x, y, PLAYER_KEY);

    // this.add.co

    // sprite
    this.setOrigin(0, 0);
    // TODO Add animations
    // this.anims.create({
    //     key: 'idle',
    //     frames: this.anims.generateFrameNumbers(key || '', { start: 0, end: 1 }),
    //     frameRate: 2,
    //     repeat: -1,
    //   });

    // physics
    this.scene.physics.world.enable(this);
    // this.body.setCollideWorldBounds(true);

    // input
    this.cursorKeys = scene.input?.keyboard?.createCursorKeys();

    this.scene.add.existing(this);
  }

  update(allowSquats = false) {
    const curPose = gstate.getPose();
    // Every frame, we create a new velocity for the sprite based on what keys the player is holding down.
    const velocity = new Phaser.Math.Vector2(0, 0);
    // Horizontal movement
    let moving = false;
    switch (true) {
      case this.cursorKeys?.left.isDown || curPose === gpose.HTL:
        velocity.x -= 1;
        moving = true;
        // this.anims.play('left', true);
        break;
      case this.cursorKeys?.right.isDown || curPose === gpose.HTR:
        velocity.x += 1;
        moving = true;
        // this.anims.play('right', true);
        break;
      default:
      // do nothing
    }

    // Vertical movement
    switch (true) {
      case this.cursorKeys?.down.isDown ||
        curPose === gpose.LA_UP ||
        (allowSquats && curPose === gpose.NDWN):
        velocity.y += 1;
        moving = true;
        // this.anims.play('idle', false);
        break;
      case this.cursorKeys?.up.isDown ||
        curPose === gpose.RA_UP ||
        curPose === gpose.BA_UP:
        velocity.y -= 1;
        moving = true;
        // this.anims.play('up', true);
        break;
      default:
      // do nothing
    }

    // We normalize the velocity so that the player is always moving at the same speed, regardless of direction.
    const normalizedVelocity = velocity.normalize();
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(
      normalizedVelocity.x * this.speed,
      normalizedVelocity.y * this.speed,
    );

    return moving;
  }

  playerBody() {
    const body = this.body as Phaser.Physics.Arcade.Body;
    return body;
  }
}
