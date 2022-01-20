import Phaser from "phaser";
import { getGameWidth, getGameHeight, getRelative } from "./helpers";
import { Player } from "./objects";
import { PLAYER_KEY, PLAYER_SCALE, GYM_ROOM_SCENE, COSMIC_CARDIO_SCENE } from "./shared";
import {
    PUMP_OPEN,
    PUMP_CLOSED,
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

const xOffsett = 50;
const yOffsett = 100;

const nonState = 0;
const wonState = 1;
const loseState = 2;

const bgColorRGB = [255, 255, 255];
const bgColorHEXNum = 0xedf2f2;
const chartTimeInterval = 1;
const playerScale = 0.3;

export class CosmicCardioScene extends Phaser.Scene {
    constructor() {
        super(SceneConfig);
    }

    init = (data) => {
        this.selectedAvatar = data.selectedAvatar;
        console.log('selectedAvatar', this.selectedAvatar);
    };

    drawGround(width, height) {
        const groundHeight = height * 0.05;
        const rect = new Phaser.Geom.Rectangle(0, height - groundHeight, width, groundHeight);
        this.graphics
            .fillStyle(0xB8ABB2, 1)
            .fillRectShape(rect);
        return rect;
    }

    create() {
        this.wonState = nonState;

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
        const rect = new Phaser.Geom.Rectangle(100, height * .08, 700, height / 1.1);
        this.graphics
            .lineStyle(2, 0x000000)
            .fillStyle(0xedf2f2, 1)
            .fillRectShape(rect)
            .strokeRectShape(rect);

        this.drawGround(width, height);

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
        this.player = new Player({ scene: this, x: 0, y: 0, key: PLAYER_KEY, });
        this.player.setScale(playerScale);
        this.player.x = width - width * .11;
        this.player.y = height * .74;
        this.player.setDepth(1);
        this.player.setOrigin(0.5);
        this.playerInitialY = this.player.y;

        // pump
        this.pump = this.add.sprite(0, 0, PUMP_OPEN)
        .setOrigin(0.5).setScale(playerScale);
        this.pump.x = this.player.x;
        this.pump.y = this.player.y * 1.2;
        this.pumpInitialY = this.pump.y;
        // this.player.y = this.pump.y;
        // this.playerInitialY = this.player.y;
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
        // const priceData = [
        //     { x: 50, y: 700 },
        //     { x: 100, y: 550 },
        //     { x: 150, y: 600 },
        //     { x: 290, y: 480 },
        //     { x: 350, y: 600 },
        //     { x: 450, y: 500 }
        // ];
        this.priceData = [
            { x: 50, y: 700 }
        ];
        const priceData = this.priceData;
        const volatility = 0.05;
        for (let i = 0, x = 55; x <= 500; x += chartTimeInterval, i++) {
            const rnd = Math.random();
            let change_percent = 2 * volatility * rnd;
            if (change_percent > volatility)
                change_percent -= (2 * volatility);
            let old_price = priceData[i].y;
            let change_amount = old_price * change_percent;
            let new_price = old_price + change_amount;
            priceData.push({
                x: x,
                y: new_price,
            });
        }

        // price setup
        this.curPrice = priceData[priceData.length - 1].y;
        this.startingPrice = this.curPrice;

        for (const p of this.priceData) {
            this.graphics.lineTo(xOffsett + p.x, p.y);
        }
    }

    drawFinalPlot(color) {
        const graphics = this.graphics;
        graphics.lineStyle(6, color);
        graphics.beginPath();
        for (const p of this.priceData) {
            this.graphics.lineTo(xOffsett + p.x, p.y);
        }
        graphics.lineTo(xOffsett + 505, this.curPrice);
        graphics.strokePath();
    }

    update(time, delta) {
        const width = getGameWidth(this);
        const height = getGameHeight(this);

        if (this.wonState == wonState || this.wonState == loseState) {
            this.player.y = this.playerInitialY;
            this.pump.y = this.pumpInitialY
            this.pump.setTexture(PUMP_OPEN);
            return;
        }

        // it may be counter intuitive but:
        // 0 is top, height positive value is bottom
        if (this.curPrice >= height - 50) {
            this.wonState = loseState;
            this.graphics.clear();
            this.drawGround(width, height);
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
            this.drawGround(width, height);
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
        const x1Pos = xOffsett + 500;
        const x2Pos = xOffsett + 505;

        const curPose = gstate.getPose();
        const player = this.player;
        if (player.cursorKeys?.down.isDown || curPose === gpose.BA_UP) {
            const distanceDown = 40;
            this.player.y = this.playerInitialY;
            player.y += distanceDown;
            this.pump.y = this.pumpInitialY;
            this.pump.setTexture(PUMP_CLOSED);
        } else {
            this.player.y = this.playerInitialY;
            this.pump.y = this.pumpInitialY
            this.pump.setTexture(PUMP_OPEN);
        }

        if (player.cursorKeys?.down.isDown || curPose === gpose.BA_UP) {
            this.curPrice -= changeFactor
            if (this.curPrice < this.startingPrice) {
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
            if (this.curPrice <= this.startingPrice) {
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
