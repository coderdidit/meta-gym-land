import Phaser from "phaser";
import GymRoomScene from "./GymRoomScene";

const GymRoomID = "gym-room-canvas";

const config = {
    type: Phaser.AUTO,
    parent: GymRoomID,
    width: window.innerWidth,
    height: window.innerHeight,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_VERTICALLY,
    scene: [GymRoomScene],
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

const GymRoom = () => {
    // run game
    new Phaser.Game(config);
    return (
        <div id={GymRoomID} />
    )
};

export default GymRoom;
