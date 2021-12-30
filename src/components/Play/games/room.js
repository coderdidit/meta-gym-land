import Phaser from "phaser";

class GymRoom extends Phaser.Scene {
    constructor() {
        super({ key: 'gym-main-room' });
    }

    preload() { }

    create() { }

    update(time, delta) { }
}

const config = {
    type: Phaser.AUTO,
    parent: 'gym-room-canvas',
    // width: scaleDownSketch ? window.innerWidth / 1.2 : window.innerWidth,
    // height: scaleDownSketch ? window.innerHeight / 1.3 : window.innerHeight / 1.2,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_VERTICALLY,
    scene: [GymRoom],
    audio: {
        noAudio: true
    },
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: debug
        },
    },
    fps: 30
}

const game = new Phaser.Game(config);
