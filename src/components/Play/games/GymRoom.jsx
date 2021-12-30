import Phaser from "phaser";
import GymRoomScene from "./GymRoomScene";

const GymRoomID = "gym-room-canvas";

const getConfig = (scene) => {
    return {
        type: Phaser.AUTO,
        parent: GymRoomID,
        width: 800,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_VERTICALLY,
        scene: [scene],
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
                debug: "debug"
            },
        },
        fps: 30
    }
}

const GymRoom = () => {
    // run game
    const config = getConfig(GymRoomScene);
    new Phaser.Game(config);
    return (
        <div id={GymRoomID} />
    )
};

export default GymRoom;
