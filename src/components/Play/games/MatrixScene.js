import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "./helpers";
import { Player } from "./objects";
import { PLAYER_KEY, PLAYER_SCALE, GYM_ROOM_SCENE, MATRIX } from "./shared";
import {
    FONT,
} from "./assets";
import { createTextBox } from "./utils/text";
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

        // matrix
        const codeRain = {
            width: 50,
            height: 40,
            cellWidth: 32,
            cellHeight: 32,
            getPoints: function (quantity) {
                var cols = (new Array(codeRain.width)).fill(0);
                var lastCol = cols.length - 1;
                var Between = Phaser.Math.Between;
                var RND = Phaser.Math.RND;
                var points = [];

                for (var i = 0; i < quantity; i++) {
                    var col = Between(0, lastCol);
                    var row = (cols[col] += 1);

                    if (RND.frac() < 0.01) {
                        row *= RND.frac();
                    }

                    row %= codeRain.height;
                    row |= 0;

                    points[i] = new Phaser.Math.Vector2(32 * col, 32 * row);
                }

                return points;
            }
        };

        this.add.particles(FONT).createEmitter({
            alpha: { start: 1, end: 0.25, ease: 'Expo.easeOut' },
            angle: 0,
            blendMode: 'ADD',
            emitZone: { source: codeRain, type: 'edge', quantity: 2000 },
            frame: Phaser.Utils.Array.NumberArray(8, 58),
            frequency: 100,
            lifespan: 6000,
            quantity: 25,
            scale: -0.5,
            tint: 0x0066ff00
        });


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
