import React, { useState, useEffect } from "react";
import Phaser from "phaser";
// import GymRoomScene from "./GymRoomScene";
import { IonPhaser } from "@ion-phaser/react";

const getConfig = (scene) => {
    let width = window.innerWidth;
    let height = width / 1.778;

    if (height > window.innerHeight) {
        height = window.innerHeight;
        width = height * 1.778;
    }

    const Scenes = [scene];

    return {
        type: Phaser.AUTO,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: "debug"
            },
        },
        scale: {
            mode: Phaser.Scale.NONE,
            width,
            height,
        },
        scene: Scenes,
        audio: {
            noAudio: true
        },
        render: {
            pixelArt: true
        },
        fps: {
            target: 30,
        },
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
