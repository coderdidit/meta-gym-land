import Phaser from "phaser";
import { getGameWidth, getGameHeight, getRelative } from "./helpers";
import { Player } from "./objects";
import { PLAYER_KEY, PLAYER_SCALE, GYM_ROOM_SCENE, FLY_FIT_SCENE } from "./shared";
import {
    BACK_ARROW,
} from "./assets";
import { createTextBox } from "./utils/text";


const SceneConfig = {
    active: false,
    visible: false,
    key: FLY_FIT_SCENE,
};

export class FlyFitScene extends Phaser.Scene {
    constructor() {
        super(SceneConfig);
    }

    init = (data) => {
        this.selectedAvatar = data.selectedAvatar;
        console.log('selectedAvatar', this.selectedAvatar);
    };

    create() {
        // basic props
        const width = getGameWidth(this);
        const height = getGameHeight(this);

        this.graphics = this.add.graphics();
        this.graphics.clear();
        const rect = new Phaser.Geom.Rectangle(0, 0, width, height);
        this.graphics.fillGradientStyle(0xdce7fc, 0x82b1ff, 0x4281ff, 0x4287f5, 1)
            .fillRectShape(rect);

        // constrols
        this.input.keyboard.on('keydown', (event) => {
            const code = event.keyCode;
            if (code == Phaser.Input.Keyboard.KeyCodes.ESC) {
                this.scene.start(GYM_ROOM_SCENE);
            }
        }, this);

        // text
        this.add.text(
            width * 0.05, height * 0.015,
            "SCORE: 0", {
            fill: '#000000',
            font: '900 20px Orbitron',
        });
        this.add.text(
            width * 0.05, height * 0.04,
            "press ESC to go back", {
            fill: '#000000',
            font: '900 17px Orbitron',
        });

        const infoText = this.add.text(
            width / 2,
            (height / 2) - height * .2,
            `Comming Soon`,
            {
                font: 'bold 32px Orbitron',
                fill: '#FFF',
                backgroundColor: '#0098A7',
                padding: 30,
                align: 'center',
            }
        )
        infoText.setOrigin(0.5)
        // infoText.setShadow(3, 3, 'rgba(0,0,0,0.2)', 2);

        // back
        // this.createBackButton();

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
        // Every frame, we update the player
        this.player?.update();
    }
}
