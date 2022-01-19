import Phaser from "phaser";
import { getGameWidth, getGameHeight, getRelative } from "./helpers";
import { Player } from "./objects";
import { PLAYER_KEY, PLAYER_SCALE, GYM_ROOM_SCENE, COSMIC_CARDIO_SCENE } from "./shared";
import {
    BACK_ARROW,
} from "./assets";
import { createTextBox } from "./utils/text";
import party from "party-js";
import {
    highlightTextColorNum,
    mainBgColorNum,
} from "../../../GlobalStyles";


const SceneConfig = {
    active: false,
    visible: false,
    key: COSMIC_CARDIO_SCENE,
};
const allowSquats = true;

const xOffsett = 100;
const yOffsett = 100;
const startingPrice = 500;

const nonState = 0;
const wonState = 1;
const loseState = 2;

const bgColorRGB = [255, 255, 255];
const bgColorHEXNum = 0xFFFFFF;

export class CosmicCardioScene extends Phaser.Scene {
    constructor() {
        super(SceneConfig);
    }

    init = (data) => {
        this.selectedAvatar = data.selectedAvatar;
        console.log('selectedAvatar', this.selectedAvatar);
    };

    create() {
        this.wonState = nonState;
        this.curPrice = startingPrice;
        this.cameras.main.backgroundColor.setTo(...bgColorRGB);
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
            x: width - width * .1,
            y: height - height * .3,
            key: PLAYER_KEY,
        });
        this.player.setScale(PLAYER_SCALE);
        this.player.setDepth(1);
    }

    youWoOrLosenMsg(msg) {
        const width = getGameWidth(this);
        const height = getGameHeight(this);

        const youWonText = createTextBox(this,
            width / 2,
            height / 2,
            { wrapWidth: 280 },
            mainBgColorNum,
            highlightTextColorNum
        )
        youWonText.setOrigin(0.5).setDepth(1).setScrollFactor(0, 0);
        youWonText.start(msg, 50);

        this.input.on("pointerdown", () => this.scene.start(COSMIC_CARDIO_SCENE));

        this.input.keyboard.on(
            'keydown',
            event => {
                const code = event.keyCode
                if (code == Phaser.Input.Keyboard.KeyCodes.X) {
                    this.scene.start(COSMIC_CARDIO_SCENE);
                }
            },
            this
        );
    }

    update(time, delta) {
        const height = getGameHeight(this);

        if (this.wonState == wonState || this.wonState == loseState) {
            return;
        }

        // it may be counter intuitive but:
        // 0 is top, height positive value is bottom
        if (this.curPrice >= height - 50) {
            this.wonState = loseState;
            this.cameras.main.backgroundColor.setTo(189, 35, 42);
            const msg = "You have been liquidated :(\n" +
                "BTC price had a MASSIVE dip" +
                "\n\n" +
                "Press X to 🎮 restart\n" +
                "Press ESC to exit";
            this.youWoOrLosenMsg(
                msg
            )
        }

        if (this.curPrice <= 0 + 50) {
            this.wonState = wonState;
            const canvasParent = document.querySelector('#phaser-app canvas');
            this.cameras.main.backgroundColor.setTo(32, 191, 150);
            if (canvasParent) party.confetti(canvasParent);
            const msg = "You saved the BTC price 🎉\n" +
                "it went to the MOOOON" +
                "\n\n" +
                "Press X to 🎮 restart\n" +
                "Press ESC to exit";
            this.youWoOrLosenMsg(
                msg
            )
        }

        let yDelta = 0;
        const changeFactor = 0.8
        const x1Pos = xOffsett + 450;
        const x2Pos = xOffsett + 455;

        if (this.player.cursorKeys?.up.isDown) {
            this.curPrice -= 2 * changeFactor
            if (this.curPrice < startingPrice) {
                this.graphics.lineStyle(3, 0x00ff00);
            } else {
                this.graphics.lineStyle(3, bgColorHEXNum);
                // clear previous line
                this.graphics.lineBetween(
                    x1Pos,
                    this.curPrice + 2 * changeFactor,
                    x2Pos,
                    this.curPrice + 2 * changeFactor);
            }
            this.graphics.lineBetween(
                x1Pos,
                this.curPrice,
                x2Pos,
                this.curPrice);
        } else {
            // falling
            if (this.curPrice <= startingPrice) {
                this.graphics.lineStyle(3, bgColorHEXNum);
                // clear previous line
                this.graphics.lineBetween(
                    x1Pos,
                    this.curPrice - changeFactor,
                    x2Pos,
                    this.curPrice - changeFactor);
            } else {
                this.graphics.lineStyle(3, 0xaa0000);
            }
            this.curPrice += changeFactor
            this.graphics.lineBetween(
                x1Pos,
                this.curPrice,
                x2Pos,
                this.curPrice);
        }
    }
}
