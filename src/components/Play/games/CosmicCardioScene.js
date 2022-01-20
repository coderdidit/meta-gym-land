import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "./helpers";
import { Player } from "./objects";
import { PLAYER_KEY, PLAYER_SCALE, GYM_ROOM_SCENE, COSMIC_CARDIO_SCENE } from "./shared";
import {
    PUMP_OPEN,
    PUMP_CLOSED,
    BTC
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


const nonState = 0;
const wonState = 1;
const loseState = 2;

const bgColorRGB = [255, 255, 255];
const bgColorHEXNum = 0xedf2f2;
const chartTimeInterval = 1;
const playerScale = PLAYER_SCALE * 2;

const chartLineWidth = 4;


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

    create(data) {
        this.createTime = Date.now();
        this.wonState = nonState;
        this.score = data.score || 0;
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
        const ground = this.drawGround(width, height);

        // line
        this.generateFakeStocksData();
        graphics.lineStyle(chartLineWidth, 0x00ff00);
        graphics.beginPath();
        this.drawChart();
        graphics.strokePath();
        graphics.closePath();

        // Add the scoreboard
        this.scoreBoard = this.add.text(
            width * 0.05, height * 0.015,
            `SCORE: ${this.score}`, {
            fill: '#000',
            font: '900 20px Orbitron',
        });
        this.add.text(
            width * 0.05, height * 0.04,
            "press ESC to go back", {
            fill: '#000',
            font: '900 17px Orbitron',
        });

        // BTC
        this.btc = this.add.image(width * .1, height * .9, BTC).setScale(0.4);

        const playerPumpX = width - (width * .2);
        // pump
        this.pump = this.add.sprite(0, 0, PUMP_OPEN)
            .setOrigin(0.5, 0)
            .setScale(playerScale);
        this.pump.x = playerPumpX;
        this.pump.y = ground.y - this.pump.height * playerScale;

        // player
        this.player = new Player({ scene: this, x: 0, y: 0, key: PLAYER_KEY, })
            .setDepth(2).setOrigin(0.5, 1).setScale(playerScale);
        this.player.x = playerPumpX;
        this.player.y = this.pump.y;
        this.playerInitialY = this.player.y;

        // hint
        this.hintTextBox = createTextBox(this,
            (width / 2) + width / 4, height * 0.025,
            { wrapWidth: 280 },
            mainBgColorNum,
            highlightTextColorNum
        )
        const hintTextBox = this.hintTextBox;
        hintTextBox.setDepth(1);
        hintTextBox.setScrollFactor(0, 0);
        hintTextBox.start(
            "🤖 BTC price is going down\n\n" +
            "But, you can save it by doing squats!\n\n" +
            "Don't let the price hit the ground"
            , 10);
    }

    youWonOrLosenMsg(msg, bgcolor = mainBgColorNum) {
        const width = getGameWidth(this);
        const height = getGameHeight(this);

        const youWonText = createTextBox(this,
            width / 2,
            height / 2,
            { wrapWidth: 280 },
            bgcolor,
            highlightTextColorNum
        )
        youWonText.setOrigin(0.5).setDepth(1).setScrollFactor(0, 0);
        youWonText.start(msg, 10);

        // this.input.on("pointerdown", () => this.scene.start(COSMIC_CARDIO_SCENE));

        this.input.keyboard.on(
            'keydown',
            event => {
                const code = event.keyCode
                if (code == Phaser.Input.Keyboard.KeyCodes.X) {
                    this.scene.start(COSMIC_CARDIO_SCENE, {
                        score: this.score
                    });
                }
            },
            this
        );
    }

    generateFakeStocksData() {
        const width = getGameWidth(this);
        const height = getGameHeight(this);
        const chartStartX = width * .008
        this.chartStopX = width / 2
        const chartStopX = this.chartStopX
        this.priceData = [
            { x: chartStartX, y: height / 2 }
        ];
        const priceData = this.priceData;
        const volatility = 0.02;
        for (let i = 0, x = (chartStartX) + chartTimeInterval; x <= chartStopX; x += chartTimeInterval, i++) {
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

        const lastX = priceData[priceData.length - 1].x
        this.avgPrice = priceData.map(p => p.y).reduce((a, b) => a + b, 0) / priceData.length;
        priceData.push({ x: lastX + chartTimeInterval, y: this.avgPrice });
        this.curPrice = this.avgPrice
        this.startingPrice = this.curPrice;
    }

    drawChart() {
        const height = getGameHeight(this);
        for (const p of this.priceData) {
            this.graphics.lineTo(p.x, p.y);
        }
    }

    drawFinalPlot(color) {
        const graphics = this.graphics;
        graphics.lineStyle(chartLineWidth, color);
        graphics.beginPath();
        this.drawChart();
        graphics.lineTo(this.chartStopX + 4, this.curPrice);
        graphics.strokePath();
    }

    update(time, delta) {
        if (Date.now() - this.createTime > 2000) {

            const width = getGameWidth(this);
            const height = getGameHeight(this);

            if (this.wonState == wonState || this.wonState == loseState) {
                this.player.y = this.playerInitialY;
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
                this.btc.setTint(0x3d3d3d);
                this.cameras.main.backgroundColor.setTo(189, 35, 42);
                const msg = "You have been liquidated 😢\n\n" +
                    "BTC price had a MASSIVE dip" +
                    "\n\n" +
                    "Press X to 🎮 restart\n" +
                    "Press ESC to exit";
                this.hintTextBox.start("🤖", 50);
                this.youWonOrLosenMsg(msg, 0x1c0707);
                return;
            }

            if (this.curPrice <= 0 + 50) {
                this.wonState = wonState;
                const canvasParent = document.querySelector('#phaser-app canvas');
                this.graphics.clear();
                this.drawGround(width, height);
                this.cameras.main.backgroundColor.setTo(32, 191, 150);
                this.drawFinalPlot(0x00ff00);
                this.score += 1;
                this.scoreBoard.setText(`SCORE: ${this.score}`);
                if (canvasParent) party.confetti(canvasParent);
                const msg = "You saved the BTC price 🎉\n" +
                    "It went to the MOOOON" +
                    "\n\n" +
                    "Press X to 🎮 restart\n" +
                    "Press ESC to exit";
                this.hintTextBox.start("🤖", 50);
                this.youWonOrLosenMsg(msg, 0x0048ff);
                return;
            }

            const curPose = gstate.getPose();
            const player = this.player;

            if (player.cursorKeys?.down.isDown || curPose === gpose.BA_UP) {
                this.player.y = this.playerInitialY;
                player.y += 40;
                this.pump.setTexture(PUMP_CLOSED);
            } else {
                this.player.y = this.playerInitialY;
                this.pump.setTexture(PUMP_OPEN);
            }

            const changeFactor = 0.8
            const x1Pos = this.chartStopX + 4;
            const x2Pos = this.chartStopX + 4 + chartLineWidth + 6;
            const longColor = 0x00ff00;
            const shortColor = 0xaa0000;
            if (player.cursorKeys?.down.isDown || curPose === gpose.BA_UP) {
                // pump price
                this.curPrice -= 2 * changeFactor
                if (this.curPrice < this.startingPrice) {
                    this.graphics.lineStyle(chartLineWidth, longColor);
                } else {
                    this.graphics.lineStyle(chartLineWidth, bgColorHEXNum);
                }
                this.graphics.lineBetween(
                    x1Pos,
                    this.curPrice,
                    x2Pos,
                    this.curPrice);
            } else {
                if (this.curPrice <= this.startingPrice) {
                    this.graphics.lineStyle(chartLineWidth, bgColorHEXNum);
                } else {
                    this.graphics.lineStyle(chartLineWidth, shortColor);
                }
                // falling price on player idle
                this.curPrice += changeFactor
            }
            this.graphics.lineBetween(
                x1Pos,
                this.curPrice,
                x2Pos,
                this.curPrice);
        }
    }
}
