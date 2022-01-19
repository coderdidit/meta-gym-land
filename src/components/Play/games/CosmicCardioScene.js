import Phaser from "phaser";
import { getGameWidth, getGameHeight, getRelative } from "./helpers";
import { Player } from "./objects";
import { PLAYER_KEY, PLAYER_SCALE, GYM_ROOM_SCENE, COSMIC_CARDIO_SCENE } from "./shared";
import {
    BACK_ARROW,
} from "./assets";
import { createTextBox } from "./utils/text";


const SceneConfig = {
    active: false,
    visible: false,
    key: COSMIC_CARDIO_SCENE,
};
const allowSquats = true;

let curPrice = 500;
const xOffsett = 100;
const yOffsett = 100;

export class CosmicCardioScene extends Phaser.Scene {
    constructor() {
        super(SceneConfig);
    }

    init = (data) => {
        this.selectedAvatar = data.selectedAvatar;
        console.log('selectedAvatar', this.selectedAvatar);
    };

    create() {
        this.cameras.main.backgroundColor.setTo(32, 191, 150);
        // constrols
        this.input.keyboard.on('keydown', (event) => {
            const code = event.keyCode;
            if (code == Phaser.Input.Keyboard.KeyCodes.ESC) {
                this.scene.start(GYM_ROOM_SCENE);
            }
        }, this);

        // Add layout
        const width = getGameWidth(this);
        const height = getGameHeight(this);

        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 } });
        const graphics = this.graphics
        graphics.beginPath();
        graphics.lineTo(xOffsett + 50, 700);
        graphics.lineTo(xOffsett + 100, 550);
        graphics.lineTo(xOffsett + 150, 600);
        graphics.lineTo(xOffsett + 190, 580);
        graphics.lineTo(xOffsett + 290, 480);
        graphics.lineTo(xOffsett + 350, 600);
        graphics.lineTo(xOffsett + 450, 500);
        graphics.lineStyle(2, 0x00ff00);
        graphics.strokePath()
        graphics.closePath();

        // Add the scoreboard
        this.scoreBoard = this.add.text(
            width * 0.05, height * 0.015,
            "SCORE: 0", {
            fill: '#000',
            font: '900 20px Orbitron',
        });
        this.add.text(
            width * 0.05, height * 0.04,
            "press ESC to go back", {
            fill: '#000',
            font: '900 17px Orbitron',
        });
        // const infoText = this.add.text(
        //     width / 2,
        //     (height / 2) - height * .2,
        //     `Comming Soon`,
        //     {
        //         font: 'bold 32px Orbitron',
        //         fill: '#FFF',
        //         backgroundColor: '#003861',
        //         padding: 30,
        //         align: 'center',
        //     }
        // )
        // infoText.setOrigin(0.5)
        // infoText.setShadow(3, 3, 'rgba(0,0,0,0.2)', 2);

        // back
        // this.createBackButton();

        // hint
        // hint
        const hintTextBox = createTextBox(this,
            (width / 2) + width / 4, height * 0.025,
            { wrapWidth: 280 })
        hintTextBox.setDepth(1);
        hintTextBox.setScrollFactor(0, 0);
        hintTextBox.start("🤖", 50);

        // player
        this.player = new Player({
            scene: this,
            x: width / 2,
            y: height / 2,
            key: PLAYER_KEY,
        });
        this.player.setScale(PLAYER_SCALE);
        this.player.setDepth(1);
    }

    update(time, delta) {

        let yDelta = 0;

        if (this.player.cursorKeys?.up.isDown) {
            curPrice -= 0.1
            this.graphics.lineStyle(3, 0x00ff00);
            this.graphics.lineBetween(xOffsett + 450, curPrice, xOffsett + 455, curPrice);
        } else {
            curPrice += 0.1
            this.graphics.lineStyle(3, 0xaa0000);
            this.graphics.lineBetween(xOffsett + 450, curPrice, xOffsett + 455, curPrice);
        }

        // Every frame, we update the player
        this.player?.update(allowSquats);
    }
}
