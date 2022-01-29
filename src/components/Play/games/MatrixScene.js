import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "./helpers";
import { Player } from "./objects";
import { PLAYER_KEY, PLAYER_SCALE, GYM_ROOM_SCENE, MATRIX } from "./shared";
import {
    BTC,
    AIRPLANE,
} from "./assets";
import { createTextBox } from "./utils/text";
import party from "party-js";
import * as gstate from "../../gpose/state";
import * as gpose from "../../gpose/pose";
import {
    mainBgColor,
} from "../../../GlobalStyles";
import { EarnableScene } from './EarnableScene';


const SceneConfig = {
    active: false,
    visible: false,
    key: MATRIX,
};

export class MatrixScene extends EarnableScene {
    constructor() {
        super(SceneConfig);
    }

    init = (data) => {
        this.selectedAvatar = data.selectedAvatar;
    };

    create() {
        // basic props
        const width = getGameWidth(this);
        const height = getGameHeight(this);

        // constrols
        this.input.keyboard.on('keydown', async (event) => {
            const code = event.keyCode;
            if (code === Phaser.Input.Keyboard.KeyCodes.ESC ||
                code === Phaser.Input.Keyboard.KeyCodes.X) {
                await this.updateXP();
            }
            if (code === Phaser.Input.Keyboard.KeyCodes.X) {
                this.scene.start(MATRIX);
            }
            if (code === Phaser.Input.Keyboard.KeyCodes.ESC) {
                this.game.registry.values?.setMinigame(GYM_ROOM_SCENE);
                this.scene.start(GYM_ROOM_SCENE);
            }
        }, this);


         // player
         this.player = new Player({
            scene: this,
            x: Phaser.Math.Between(width * 0.1,
                this.physics.world.bounds.width - 80),
            y: this.physics.world.bounds.height,
            key: PLAYER_KEY,
        });
        this.player.setScale(PLAYER_SCALE);
        this.player.setDepth(1);
        this.player.body.setCollideWorldBounds(true);

    }

    update(time, delta) {
        this.player?.update();
    }
}
