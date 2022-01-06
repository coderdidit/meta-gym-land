import Phaser from "phaser";
import { getGameWidth, getGameHeight, getRelative } from "./helpers";
import { Player } from "./objects";
import { PLAYER_KEY, PLAYER_SCALE, GYM_ROOM_SCENE } from "./shared";
import {
    BACK_ARROW,
    BG,
    GYM_ROOM_MAP,
    GYM_ROOM_TILES,
    GYM_ROOM_MAT_SKY,
    GYM_ROOM_MAT_SPACE,

    GYM_ROOM_DANGEON_MAP,
    GYM_ROOM_DANGEON_TILES,
} from "./assets";
import { createTextBox } from "./utils/text";

const SceneConfig = {
    active: false,
    visible: false,
    key: GYM_ROOM_SCENE,
};

const mapScale = 0.6;
const tileMapSizing = 36;


export class GymRoomScene extends Phaser.Scene {
    constructor() {
        super(SceneConfig);
    }

    init = (data) => {
        this.selectedAvatar = data.selectedAvatar;
        console.log('selectedAvatar', this.selectedAvatar);
    };

    create() {
        // Add layout
        const width = getGameWidth(this);
        const height = getGameHeight(this);

        // bg image
        this.add.image(width / 2, height / 2, BG)
            .setDisplaySize(width, height);

        // map
        const map = this.make.tilemap({
            key: GYM_ROOM_MAP,
            tileWidth: tileMapSizing,
            tileHeight: tileMapSizing,
        })

        const tileset_main = map.addTilesetImage(
            'gym_room_sqrs', // ? filename ?? name of the tileset in json file
            GYM_ROOM_TILES, // key
            tileMapSizing,
            tileMapSizing
        );
        const groundLayer = map
            .createLayer('floor', tileset_main,
                (width / 5), height * 0.02
            );

        const wallsLayer = map
            .createLayer('walls', tileset_main,
                (width / 5), height * 0.02
            );
        groundLayer.setScale(mapScale);

        // collide with all walls
        wallsLayer.setScale(mapScale);
        wallsLayer.setCollisionByExclusion([-1]);

        const mat_sky = map.addTilesetImage(
            'mat_sky', // ? filename ?? name of the tileset in json file
            GYM_ROOM_MAT_SKY, // key
            tileMapSizing,
            tileMapSizing
        );

        const mat_space = map.addTilesetImage(
            'mat_space', // ? filename ?? name of the tileset in json file
            GYM_ROOM_MAT_SPACE, // key
            tileMapSizing,
            tileMapSizing
        );

        const itemsLayer = map
            .createLayer('items', [tileset_main, mat_sky, mat_space],
                (width / 5), (height * 0.02)
            );
        itemsLayer.setScale(mapScale);
        // TODO check later
        // itemsLayer.forEachTile(t => {
        //     let spriteShadow = t
        //     let scaleY = t
        //     spriteShadow.y = spriteShadow.y + (spriteShadow.height * (1 - scaleY)) / 2;
        //     spriteShadow.scaleY = scaleY;
        //     spriteShadow.tint = 0x000000;
        //     spriteShadow.alpha = 0.5;
        //     spriteShadow.setPipeline("skewQuad");
        //     spriteShadow.pipeline.set1f("inHorizontalSkew", 0.2);
        // })
        // itemsLayer.setCollisionByExclusion([-1]);

        // back btn   
        // uncomment if you want to have sound on exit
        // this.back = this.sound.add(CLICK, { loop: false });
        this.createBackButton();

        // Add a player sprite that can be moved around.
        this.player = new Player({
            scene: this,
            x: width / 2,
            y: height / 2,
            key: PLAYER_KEY,
        });
        this.player.setScale(PLAYER_SCALE);
        // this.cameras.main.startFollow(this.player);

        // colliders
        this.physics.add.collider(this.player, wallsLayer);

        // texts
        const textBox = createTextBox(this, width - 500, 100, {
            wrapWidth: 200,
            // fixedWidth: 300,
        })
        textBox.start("clik me to play space stretch 🚀", 50);
    }

    createBackButton = () => {
        this.add
            .image(getRelative(10, this), getRelative(24, this), BACK_ARROW)
            .setOrigin(0)
            .setInteractive({ useHandCursor: true })
            .setDisplaySize(getRelative(54, this), getRelative(54, this))
            .on("pointerdown", () => {
                this.back?.play();
                window.history.back();
            });
    };

    update(time, delta) {
        // Every frame, we update the player
        this.player?.update();
    }
}
