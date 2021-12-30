import React, { useState, useEffect } from "react";
import Phaser from "phaser";
// import GymRoomScene from "./GymRoomScene";
import { IonPhaser } from "@ion-phaser/react";

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

const GymRoom = ({ avatar }) => {
    console.log('GymRoom avatar', avatar);
    // run game
    class GymRoomScene extends Phaser.Scene {
        constructor() {
            super({ key: 'gym-main-room' });
        }

        preload() {
            this.load.image('avatar', avatar.uri);
        }

        create() {
            const player = this.physics.add.image(200, 300, 'avatar');
        }

        update(time, delta) {

        }
    }

    const [initialised, setInitialised] = useState(true);
    const [config, setConfig] = useState();

    const startGame = () => {
        setConfig({
            ...getConfig(GymRoomScene),
            callbacks: {
                preBoot: (game) => {
                    // Makes sure the game doesnt create another game on rerender
                    setInitialised(false);
                    game.registry.merge({
                        avatar,
                    });
                },
            },
        });
    };

    useEffect(() => {
        startGame();
    }, []);

    return <IonPhaser initialize={initialised} game={config} id="phaser-app" />;
};

export default GymRoom;
