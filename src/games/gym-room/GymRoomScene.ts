import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "../helpers";
import { Player } from "../objects";
import { PLAYER_SCALE, GYM_ROOM_SCENE, FLY_FIT_SCENE } from "..";
import {
  GYM_ROOM_MAP,
  GYM_ROOM_TILESET,
  GYM_ROOM_BG,
  STEP_SOUND,
  BLOP_SOUND,
} from "../gym-room-boot/assets";
import { createTextBox } from "../utils/text";
import { debugCollisonBounds } from "../utils/collision_debugger";
import {
  setMainRoomPlayerExitPos,
  getMainRoomPlayerExitPos,
  playerHasExitPos,
} from "../utils/Globals";
import {
  highlightTextColorNum,
  mainBgColorNum,
  MMT_TICKER,
} from "../../GlobalStyles";
import { EarnableScene } from "../base-scenes/EarnableScene";
import { showSnapchatModal } from "./snapchat";
import { commingSoonModal } from "./comming-soon";
import { TextBox } from "phaser3-rex-plugins/templates/ui/ui-components";

const roomDevelopmentYOffset = 1800; // 1800
const debugCollisons = false;

const roomAccess = new Map([["water_room_lock", true]]);

const miniGamesPlayedInSession: string[] = [];

const SceneConfig = {
  active: false,
  visible: false,
  key: GYM_ROOM_SCENE,
};

const mapScale = 1;
const tileMapSizing = 32;

const miniGamesMapping = new Map([
  ["space_stretch", "Space Mat"],
  ["fly_fit", "Sky Mat"],
  ["snap", "Snapchat"],
  ["chart_squats", "Chart Squats Mat"],
  ["matrix", "Mystery Mat"],
  ["gym_canals", "Gym Canals"],
  ["invaders", "Octopus Invaders"],
  ["kayaks", "Kayaks"],
  ["runner", "Runner"],
  ["race_track", "Race Track"],
]);

const commingSoon = ["kayaks"];

let sceneToGoOnXclick: string;
const roboTextTimeouts: NodeJS.Timeout[] = [];

export class GymRoomScene extends EarnableScene {
  selectedAvatar: any;
  player!: Player;
  collidingTrainingMat!: any;
  walkSound!: Phaser.Sound.BaseSound;
  blopSound!: Phaser.Sound.BaseSound;
  lastWalksSoundPlayed = Date.now();
  matHovered = false;
  playMinigameText!: TextBox;

  constructor() {
    super(SceneConfig);
  }

  init = (data: {
    selectedAvatar: any;
    prevScene?: string;
    prevSceneScore?: number;
    prevSceneTimeSpentMillis?: number;
  }) => {
    if (data?.prevScene) {
      miniGamesPlayedInSession.push(data?.prevScene);
    }
    this.selectedAvatar = data.selectedAvatar;
  };

  create() {
    // basic props
    const width = getGameWidth(this);
    const height = getGameHeight(this);

    // sound
    this.walkSound = this.sound.add(STEP_SOUND, { volume: 0.5 });
    this.blopSound = this.sound.add(BLOP_SOUND, { volume: 0.5 });

    // this.cameras.main.backgroundColor.setTo(179, 201, 217);
    // constrols
    this.input.keyboard.on(
      "keydown",
      (event: { keyCode: any }) => {
        const code = event.keyCode;
        if (sceneToGoOnXclick && code === Phaser.Input.Keyboard.KeyCodes.X) {
          roboTextTimeouts.forEach((t) => clearTimeout(t));
          setMainRoomPlayerExitPos(this.player.x, this.player.y);
          if (commingSoon.includes(sceneToGoOnXclick)) {
            commingSoonModal(miniGamesMapping.get(sceneToGoOnXclick) ?? "");
          } else if (sceneToGoOnXclick === "snap") {
            showSnapchatModal(this.selectedAvatar.snapARLink);
          } else {
            this.game.registry.values?.setMinigame(sceneToGoOnXclick);
            this.scene.start(sceneToGoOnXclick);
          }
        }
      },
      this,
    );
    // map
    const map = this.make.tilemap({
      key: GYM_ROOM_MAP,
      tileWidth: tileMapSizing,
      tileHeight: tileMapSizing,
    });

    const bg = this.add.image(
      map.widthInPixels / 2,
      map.heightInPixels / 2,
      GYM_ROOM_BG,
    );
    bg.setDisplaySize(map.widthInPixels * 1.5, map.heightInPixels * 1.5);

    const tileset_main_v2 = map.addTilesetImage(
      GYM_ROOM_TILESET, // ? filename ?? name of the tileset in json file
      GYM_ROOM_TILESET, // key
      tileMapSizing,
      tileMapSizing,
    );
    const groundLayer = map.createLayer("floor", [tileset_main_v2]);
    groundLayer.setScale(mapScale);

    const wallsLayer = map.createLayer("walls", [tileset_main_v2]);
    wallsLayer.setScale(mapScale);
    wallsLayer.setCollisionByProperty({
      collides: true,
    });

    const itemsLayer = map.createLayer("items", [tileset_main_v2]);
    itemsLayer.setScale(mapScale);
    itemsLayer.setCollisionByProperty({
      collides: true,
    });

    const trainingMatsLayer = map.createLayer("training_mats", [
      tileset_main_v2,
    ]);
    trainingMatsLayer.setScale(mapScale);

    this.tweens.add({
      targets: trainingMatsLayer,
      x: "-=10",
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      duration: 500,
    });

    const primaryColor = Phaser.Display.Color.ValueToColor(0xffffff)
      .gray(255)
      .lighten(100)
      .brighten(100)
      .saturate(10);

    const secondaryColor =
      Phaser.Display.Color.ValueToColor(0xffffff).gray(200);

    this.tweens.addCounter({
      from: 0,
      to: 100,
      duration: 500,
      ease: Phaser.Math.Easing.Sine.InOut,
      repeat: -1,
      yoyo: true,
      onUpdate: (tween) => {
        const value = tween.getValue();
        const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
          primaryColor,
          secondaryColor,
          100,
          value,
        );
        const { r, g, b } = colorObject;
        const color = Phaser.Display.Color.GetColor(r, g, b);
        trainingMatsLayer.culledTiles.forEach((t) => {
          t.tint = color;
        });
      },
    });

    const resolvePlayerXY = () => {
      if (playerHasExitPos()) {
        return getMainRoomPlayerExitPos();
      }
      const playerObjLayer = map.getObjectLayer("player");
      const obj = playerObjLayer.objects[0];
      if (!obj.x || !obj.y) {
        throw Error(
          `player object x or y are undefined ${JSON.stringify(obj)}`,
        );
      }
      return {
        x: obj.x * mapScale,
        y: obj.y * mapScale - roomDevelopmentYOffset,
      };
    };
    this.player = new Player({
      scene: this,
      ...resolvePlayerXY(),
    });
    this.player.setScale(PLAYER_SCALE);
    this.player.setDepth(1);
    // adjust collision box
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.3);
    this.player.body.setOffset(
      this.player.width * 0.25,
      this.player.height * 0.6,
    );

    this.cameras.main.startFollow(this.player);

    // world bounds
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.physics.world.setBoundsCollision(true, true, true, true);
    this.player.playerBody().setCollideWorldBounds(true);

    // colliders
    this.physics.add.collider(this.player, wallsLayer);
    this.physics.add.collider(this.player, itemsLayer);

    // text
    const hintTextBox = createTextBox({
      scene: this,
      x: width / 2 + width / 4,
      y: height * 0.015,
      config: { wrapWidth: 280 },
    })
      .setDepth(1)
      .setScrollFactor(0, 0)
      .start("🤖", 50);

    if (!playerHasExitPos()) {
      roboTextTimeouts.push(
        setTimeout(() => {
          if (!hintTextBox) return;
          hintTextBox.start(
            "🤖 Welcome 👋\n" +
              "Enter MetaGymLand\n" +
              "And do some stretches 💪\n" +
              "\n" +
              "Hint...\n" +
              "Stand on the GLOWING MATS",
            30,
          );
        }, 1000),
      );
    }

    // add colliders to unlocked rooms
    const playerHandelCollideWithLock = (player: any, lock: any) => {
      const objName = lock.name;
      console.log("collide with ", objName);
    };
    const roomLocksLayer = map.getObjectLayer("room_locks");
    for (const roomLock of roomLocksLayer.objects) {
      if (
        !roomLock.name ||
        !roomLock.x ||
        !roomLock.y ||
        !roomLock.width ||
        !roomLock.height
      ) {
        throw Error(
          `roomLock object has undefined values (name, x, y, width, height) ${JSON.stringify(
            roomLock,
          )}`,
        );
      }

      const { name, x, y, width, height } = roomLock;

      if (miniGamesPlayedInSession.includes(FLY_FIT_SCENE)) {
        roomAccess.set("water_room_lock", false);
      }

      const isRoomLocked = roomAccess.get(name) ?? false;

      if (isRoomLocked) {
        const roomLockRect = this.add
          .rectangle(
            x * mapScale,
            y * mapScale,
            width * mapScale,
            height * mapScale,
          )
          .setName(name)
          .setOrigin(0);
        this.physics.world.enable(
          roomLockRect,
          Phaser.Physics.Arcade.STATIC_BODY,
        );
        this.physics.add.collider(
          this.player,
          roomLockRect,
          playerHandelCollideWithLock,
          undefined,
          this,
        );
      }
    }

    const trainingMats: Phaser.GameObjects.Rectangle[] = [];
    const miniGamesLayer = map.getObjectLayer("mini_games");
    miniGamesLayer.objects.forEach((object) => {
      if (!object.x || !object.y || !object.width || !object.height) {
        throw Error(
          `player object has undefined values (x, y, width, height) ${JSON.stringify(
            object,
          )}`,
        );
      }
      const x = object.x * mapScale;
      const y = object.y * mapScale;
      const objWidth = object.width * mapScale;
      const objHeight = object.height * mapScale;
      const trainingMatRect = this.add
        .rectangle(x, y, objWidth, objHeight)
        .setName(object.name)
        .setOrigin(0);
      this.physics.world.enable(
        trainingMatRect,
        Phaser.Physics.Arcade.STATIC_BODY,
      );
      trainingMats.push(trainingMatRect);
    });

    const playerMatHandelOverlap = (player: any, matRectangle: any) => {
      const objName = matRectangle.name;
      if (
        player.body.touching.none &&
        this.collidingTrainingMat !== matRectangle
      ) {
        this.collidingTrainingMat = matRectangle;
        matRectangle.setFillStyle(0x33dd33, 0.3);
        roboTextTimeouts.forEach((t) => clearTimeout(t));
        sceneToGoOnXclick = objName;
        let msg = "";
        if (objName === "snap") {
          msg = `🤖 press X to let your GymBuddy enter Snapchat 🚀`;
        } else {
          msg = `🤖 press X to train on\n${miniGamesMapping.get(objName)} 🚀`;
        }

        this.playMinigameText = createTextBox({
          scene: this,
          x: width / 2 + this.player.width / 2,
          y: height / 2 - this.player.height,
          config: { wrapWidth: 280 },
          bg: mainBgColorNum,
          stroke: highlightTextColorNum,
        })
          .setOrigin(0.5)
          .setDepth(1)
          .setScrollFactor(0, 0)
          .start(msg, 20);

        // play sound
        if (!this.matHovered && !this.blopSound.isPlaying) {
          this.blopSound.play();
        }
        this.matHovered = true;
      }
    };

    this.physics.add.overlap(
      this.player,
      trainingMats,
      playerMatHandelOverlap,
      undefined,
      this,
    );
    const overlapendCallback = () => {
      if (this.collidingTrainingMat) {
        this.playMinigameText.destroy();
        this.matHovered = false;
        const mat = this.collidingTrainingMat;
        mat.setFillStyle(null, 0);
        this.collidingTrainingMat = null;
        roboTextTimeouts.push(
          setTimeout(() => {
            if (!hintTextBox) return;
            hintTextBox.start("🤖", 50);
          }, 1000),
        );
      }
    };

    this.player.on("overlapend", overlapendCallback);

    // MBMT inventory
    const mbmtEarnedInventory = createTextBox({
      scene: this,
      x: width * 0.05,
      y: height * 0.015,
      config: { wrapWidth: 280 },
      bg: 0xffd7d7,
      stroke: 0xffffff,
      align: "center",
      txtColor: "#FD377E",
    });
    mbmtEarnedInventory.setScrollFactor(0, 0);
    const formattedBalance = () => {
      if (this.currentXPBalance()) return this.currentXPBalance().toFixed(4);
      return 0;
    };
    mbmtEarnedInventory.start(`${MMT_TICKER}: ${formattedBalance()}`, 10);
    // debugging
    if (debugCollisons) {
      debugCollisonBounds(wallsLayer, this);
    }
  }

  // eslint-disable-next-line no-unused-vars
  update(_time: any, _delta: any) {
    // overlapend event
    const touching = !this.player.body.touching.none;
    const wasTouching = !this.player.body.wasTouching.none;
    // if (touching && !wasTouching) block.emit("overlapstart");
    if (!touching && wasTouching) this.player.emit("overlapend");
    const now = Date.now();
    const walkSoundPlayedTimeElasped = now - this.lastWalksSoundPlayed;

    // Every frame, we update the player
    const moving = this.player?.update();
    // play walk sound tiwh throttling
    if (
      moving &&
      !this.walkSound.isPlaying &&
      walkSoundPlayedTimeElasped > 500
    ) {
      this.lastWalksSoundPlayed = Date.now();
      this.walkSound.play();
    }
  }
}
