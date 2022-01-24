import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "./helpers";
import { Player } from "./objects";
import { PLAYER_KEY, PLAYER_SCALE, GYM_ROOM_SCENE } from "./shared";
import {
  GYM_ROOM_MAP,
  GYM_ROOM_TILESET_V2
} from "./assets";
import { createTextBox } from "./utils/text";
import { debugCollisonBounds } from "./utils/collision_debugger";
import {
  setMainRoomPlayerExitPos,
  getMainRoomPlayerExitPos,
  playerHasExitPos
} from "./Globals";

const debugCollisons = false;

const SceneConfig = {
  active: false,
  visible: false,
  key: GYM_ROOM_SCENE
};

const mapScale = 1;
const tileMapSizing = 32;

const miniGamesMapping = new Map([
  ['space_stretch', 'Space Mat'],
  ['fly_fit', 'Sky Mat'],
  ['chart_squats', 'Chart Squats Mat']
]);

let sceneToGoOnXclick = null;
const roboTextTimeouts = [];

export class GymRoomScene extends Phaser.Scene {
  constructor() {
    super(SceneConfig);
  }

  init = data => {
    this.selectedAvatar = data.selectedAvatar
    console.log('selectedAvatar', this.selectedAvatar);
  }

  create() {
    // basic props
    const width = getGameWidth(this);
    const height = getGameHeight(this);

    const adjustedWidth = width;
    const adjustedHeight = height;

    this.cameras.main.backgroundColor.setTo(179, 201, 217);
    // constrols
    this.input.keyboard.on(
      'keydown',
      event => {
        const code = event.keyCode
        if (sceneToGoOnXclick && code == Phaser.Input.Keyboard.KeyCodes.X) {
          roboTextTimeouts.forEach(t => clearTimeout(t));
          setMainRoomPlayerExitPos(
            this.player.x,
            this.player.y,
          )
          this.scene.start(sceneToGoOnXclick);
        }
      },
      this
    )
    // map
    const map = this.make.tilemap({
      key: GYM_ROOM_MAP,
      tileWidth: tileMapSizing,
      tileHeight: tileMapSizing
    });

    const tileset_main_v2 = map.addTilesetImage(
      GYM_ROOM_TILESET_V2, // ? filename ?? name of the tileset in json file
      GYM_ROOM_TILESET_V2, // key
      tileMapSizing,
      tileMapSizing
    );
    const groundLayer = map.createLayer(
      'floor',
      [
        tileset_main_v2,
      ],
    );

    const wallsLayer = map.createLayer(
      'walls',
      [
        tileset_main_v2
      ],
    );
    groundLayer.setScale(mapScale);
    wallsLayer.setScale(mapScale);
    wallsLayer.setCollisionByProperty({
      collides: true
    });

    const itemsLayer = map.createLayer(
      'items',
      [
        tileset_main_v2,
      ],
    );
    itemsLayer.setScale(mapScale);
    itemsLayer.setCollisionByProperty({
      collides: true
    });

    const resolvePlayerXY = () => {
      if (playerHasExitPos()) {
        return getMainRoomPlayerExitPos()
      }
      const playerObjLayer = map.getObjectLayer('player');
      return {
        x: playerObjLayer.objects[0].x * mapScale,
        y: playerObjLayer.objects[0].y * mapScale,
      }
    }
    this.player = new Player({
      scene: this,
      ...resolvePlayerXY(),
      key: PLAYER_KEY
    });
    this.player.setScale(PLAYER_SCALE);
    this.player.setDepth(1);
    // adjust collision box
    this.player.body.setSize(
      this.player.width * 0.5,
      this.player.height * 0.3);
    this.player.body.setOffset(
      this.player.width * 0.25, this.player.height * 0.6
    )
    this.cameras.main.startFollow(this.player);
    
    // world bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, false, true);
    this.player.body.setCollideWorldBounds(true);

    const player = this.player;

    // colliders
    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.player, itemsLayer);

    // text
    const hintTextBox = createTextBox(
      this,
      width / 2 + width / 4,
      height * 0.025,
      { wrapWidth: 280 }
    );

    hintTextBox.setDepth(1);
    hintTextBox.setScrollFactor(0, 0);
    hintTextBox.start('🤖', 50);

    if (!playerHasExitPos()) {
      roboTextTimeouts.push(
        setTimeout(() => {
          hintTextBox.start(
            "🤖 Welcome 👋\n" +
            "go to the MetaGym\n" +
            "and do some stretches 💪\n" +
            // "\n" +
            "hint...\n" +
            "look for the GLOWING MATS",
            30
          )
        }, 1000)
      );
    }

    const trainingMats = []
    const miniGamesLayer = map.getObjectLayer('mini_games');
    miniGamesLayer.objects.forEach(object => {
      const x = object.x * mapScale + adjustedWidth;
      const y = object.y * mapScale + adjustedHeight
      const objWidth = object.width * mapScale;
      const objHeight = object.height * mapScale;
      let trainingMatRect = this.add
        .rectangle(x, y, objWidth, objHeight,
      ).setName(object.name).setOrigin(0);
      this.physics.world.enable(
        trainingMatRect, Phaser.Physics.Arcade.STATIC_BODY
      );
      trainingMats.push(trainingMatRect);
    });

    const playerMatHandelOverlap = (player, matRectangle) => {
      const objName = matRectangle.name;
      if (player.body.touching.none && player.collidingTrainingMat != matRectangle) {
        player.collidingTrainingMat = matRectangle;
        matRectangle.setFillStyle(0x33dd33, 0.3);
        roboTextTimeouts.forEach(t => clearTimeout(t))
        sceneToGoOnXclick = objName
        hintTextBox.start(
          `🤖 press X to train on\n${miniGamesMapping.get(objName)} 🚀`,
          50
        );
      }
    }

    this.physics.add.overlap(this.player, trainingMats,
      playerMatHandelOverlap,
      null, this);
    this.player.on("overlapend", function () {
      if (player.collidingTrainingMat) {
        const mat = player.collidingTrainingMat;
        mat.setFillStyle(null, 0);
        player.collidingTrainingMat = null;
        roboTextTimeouts.push(
          setTimeout(() => hintTextBox.start('🤖', 50), 1000)
        );
      }
    });
    // debugging
    if (debugCollisons) {
      debugCollisonBounds(wallsLayer, this)
    }
  }

  update(time, delta) {
    // overlapend event
    const touching = !this.player.body.touching.none;
    const wasTouching = !this.player.body.wasTouching.none;
    // if (touching && !wasTouching) block.emit("overlapstart");
    if (!touching && wasTouching) this.player.emit("overlapend");

    // Every frame, we update the player
    this.player?.update();
  }
}
