import Phaser from "phaser";
import * as gstate from "../../../gpose/state";
import * as gpose from "../../../gpose/pose";

export class Player extends Phaser.GameObjects.Sprite {
    cursorKeys;
    speed = 90;

    constructor({ scene, x, y, key }) {
        super(scene, x, y, key);

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
        this.cursorKeys = scene.input.keyboard.createCursorKeys();

        this.scene.add.existing(this);
    }

    update() {
        const curPose = gstate.getPose();
        // Every frame, we create a new velocity for the sprite based on what keys the player is holding down.
        const velocity = new Phaser.Math.Vector2(0, 0);
        // Horizontal movement
        switch (true) {
            case this.cursorKeys?.left.isDown || curPose === gpose.HTL:
                velocity.x -= 1;
                // this.anims.play('left', true);
                break;
            case this.cursorKeys?.right.isDown || curPose === gpose.HTR:
                velocity.x += 1;
                // this.anims.play('right', true);
                break;
            default:
            // do nothing
        }

        // Vertical movement
        switch (true) {
            case this.cursorKeys?.down.isDown || curPose === gpose.RA_UP:
                velocity.y += 1;
                // this.anims.play('idle', false);
                break;
            case this.cursorKeys?.up.isDown || curPose === gpose.LA_UP
                || curPose === gpose.BA_UP:
                velocity.y -= 1;
                // this.anims.play('up', true);
                break;
            default:
            // do nothing
        }

        // We normalize the velocity so that the player is always moving at the same speed, regardless of direction.
        const normalizedVelocity = velocity.normalize();
        this.body
            .setVelocity(normalizedVelocity.x * this.speed,
                normalizedVelocity.y * this.speed);
    }
}
