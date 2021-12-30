import React, { useState, useEffect } from "react";
import Phaser from "phaser";
import GymRoomScene from "./GymRoomScene";
import { IonPhaser } from "@ion-phaser/react";

// const GymRoomID = "gym-room-canvas";

const getConfig = (scene) => {
    return {
        type: Phaser.AUTO,
        // parent: GymRoomID,
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
    // class GymRoomScene extends Phaser.Scene {
    //     constructor() {
    //         super({ key: 'gym-main-room' });
    //     }

    //     preload() { }

    //     create() { }

    //     update(time, delta) { }
    // }

    const [initialised, setInitialised] = useState(true);
    const [config, setConfig] = useState();

    const startGame = () => {
        setConfig({
            ...getConfig(GymRoomScene),
            callbacks: {
                preBoot: (game) => {
                    // Makes sure the game doesnt create another game on rerender
                    setInitialised(false);
                    // game.registry.merge({
                    //   selectedGotchi,
                    //   socket
                    // });
                },
            },
        });
    };

    useEffect(() => {
        startGame();
    }, []);

    // const config = getConfig(GymRoomScene);
    // new Phaser.Game(config);
    return <IonPhaser initialize={initialised} game={config} id="phaser-app" />;
};

export default GymRoom;
