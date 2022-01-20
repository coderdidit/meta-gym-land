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
import * as gstate from "../../gpose/state";
import * as gpose from "../../gpose/pose";


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
const bgColorHEXNum = 0xedf2f2;

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

        this.graphics = this.add.graphics();
        const graphics = this.graphics;
        // bg
        const rect = new Phaser.Geom.Rectangle(xOffsett, height * .3, 700, height / 2);
        this.graphics.fillStyle(0xedf2f2, 1)
            .fillRectShape(rect);

        // line
        graphics.lineStyle(2, 0x00ff00);
        graphics.beginPath();
        this.generateInitialPlot();
        graphics.strokePath();
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
            { wrapWidth: 280 },
            mainBgColorNum,
            highlightTextColorNum
        )
        hintTextBox.setDepth(1);
        hintTextBox.setScrollFactor(0, 0);
        hintTextBox.start(
            "🤖 your BTC position is having a long squeeze today\n" +
            "and price is going down\n" +
            "But, you can save it by doing squats!"
            , 20);

        // player
        this.player = new Player({
            scene: this,
            x: width - width * .1,
            y: height - height * .2,
            key: PLAYER_KEY,
        });
        this.player.setScale(PLAYER_SCALE);
        this.player.setDepth(1);
        this.playerInitialY = this.player.y;
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

    generateInitialPlot() {
        const priceData = [
            { x: 50, y: 700 },
            { x: 100, y: 550 },
            { x: 150, y: 600 },
            { x: 290, y: 480 },
            { x: 350, y: 600 },
            { x: 450, y: 500 }
        ];
        for (const p of priceData) {
            this.graphics.lineTo(xOffsett + p.x, p.y);
        }
    }

    drawFinalPlot(color) {
        const graphics = this.graphics;
        graphics.lineStyle(6, color);
        graphics.beginPath();
        this.generateInitialPlot();
        graphics.lineTo(xOffsett + 455, this.curPrice);
        graphics.strokePath();
    }

    update(time, delta) {
        const height = getGameHeight(this);

        if (this.wonState == wonState || this.wonState == loseState) {
            this.player.y = this.playerInitialY;
            return;
        }

        // it may be counter intuitive but:
        // 0 is top, height positive value is bottom
        if (this.curPrice >= height - 50) {
            this.wonState = loseState;
            this.graphics.clear();
            this.drawFinalPlot(0x000000);
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
            this.graphics.clear();
            this.cameras.main.backgroundColor.setTo(32, 191, 150);
            this.drawFinalPlot(0x00ff00);
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

        const curPose = gstate.getPose();
        const player = this.player;
        if (player.cursorKeys?.down.isDown || curPose === gpose.BA_UP) {
            this.player.y = this.playerInitialY;
            player.y += 100;
        } else {
            this.player.y = this.playerInitialY;
        }

        if (player.cursorKeys?.down.isDown || curPose === gpose.BA_UP) {
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
