import Phaser from "phaser";
import { assets } from "./assets";
import { GYM_ROOM_SCENE, PLAYER_KEY, MINI_GAMES } from "..";
import { getGameWidth, getGameHeight } from "../helpers";
import { InGameFont } from "../../GlobalStyles";

const sceneConfig = {
  active: false,
  visible: false,
  key: "Boot",
};

/**
 * The initial scene that loads all necessary assets to the game.
 */
export class BootScene extends Phaser.Scene {
  assetsLoaded!: boolean;
  selectedAvatar!: { uri: any };
  loadIndex;
  progressBarContainer!: Phaser.GameObjects.Rectangle;
  progressBar!: Phaser.GameObjects.Rectangle;
  loadingText!: Phaser.GameObjects.Text;
  pickedMiniGame!: string;

  constructor() {
    super(sceneConfig);
    this.loadIndex = 0;
  }

  preload = () => {
    // Construct progress bar
    this.createProgressBar();

    // Construct avatar game object from registry
    this.selectedAvatar = this.game.registry.values.avatar;
    this.pickedMiniGame = this.game.registry.values.pickedMiniGame;

    // Listener that triggers when an asset has loaded
    // TODO investigate, this is called twice
    this.load.on(
      "filecomplete",
      (key: string) => {
        console.log("load_asset", key);
        // As the spritesheet is the last asset to load in, we can attempt to start the game
        if (key === PLAYER_KEY) {
          console.log("PLAYER_LOADED_!!!", key);
          this.assetsLoaded = true;
          this.loadingText?.setText(`Loading Player Avatar...`);
          console.log("pickedMiniGame", this.pickedMiniGame);
          this.startGame(this.pickedMiniGame);
        }
        if (this.loadIndex === assets.length && this.selectedAvatar) {
          console.log("selectedAvatar", this.selectedAvatar);
          const uri = this.selectedAvatar.uri;
          console.log("loading NFT avatar into game", this.selectedAvatar);
          this.textures.addBase64(PLAYER_KEY, uri);
          this.add.image(100, 100, PLAYER_KEY);
          // tmp fixes
          this.assetsLoaded = true;
          this.loadingText?.setText(`Loading Player Avatar...`);
          this.startGame(this.pickedMiniGame);

          // previous
          // this.load.image(PLAYER_KEY, uri);
        } else {
          this.loadNextFile(this.loadIndex);
        }
      },
      this,
    );
    this.loadNextFile(0);
  };

  /**
   * If all the assets are loaded in, start game
   */
  startGame = (miniGameId: string) => {
    if (this.assetsLoaded) {
      const resolveMiniGame = () => {
        if (MINI_GAMES.includes(miniGameId)) {
          return miniGameId;
        }
        return GYM_ROOM_SCENE;
      };
      const miniGame = resolveMiniGame();
      this.scene.start(miniGame, { selectedAvatar: this.selectedAvatar });
    }
  };

  /**
   * Renders UI component to display loading progress
   */
  createProgressBar = () => {
    const width = getGameWidth(this) * 0.5;
    const height = 12;
    this.progressBarContainer = this.add
      .rectangle(
        getGameWidth(this) / 2,
        getGameHeight(this) / 2,
        width,
        height,
        0x12032e,
      )
      .setOrigin(0.5);

    this.progressBar = this.add
      .rectangle(
        (getGameWidth(this) - width) / 2,
        getGameHeight(this) / 2,
        0,
        height,
        0x6d18f8,
      )
      .setOrigin(0, 0.5);

    this.loadingText = this.add
      .text(
        getGameWidth(this) / 2,
        getGameHeight(this) / 2 - 32,
        "Loading...",
        { fontFamily: InGameFont },
      )
      .setFontSize(24)
      .setOrigin(0.5);
  };

  /**
   * Iterates through each file in the assets array
   */
  loadNextFile = (index: number) => {
    const file = assets[index];
    this.loadIndex++;

    if (this.loadingText && this.progressBar && this.progressBarContainer) {
      // this.loadingText.setText(`Loading: ${file.key}`);
      this.loadingText.setText("Loading...");
      this.progressBar.width =
        (this.progressBarContainer.width / assets.length) * index;
    }

    switch (file.type) {
      case "IMAGE":
        this.load.image(file.key, file.src);
        break;
      case "SVG":
        this.load.svg(file.key, file.src);
        break;
      case "AUDIO":
        this.load.audio(file.key, file.src);
        break;
      case "SPRITESHEET":
        this.load.spritesheet(file.key, file.src, file.data);
        break;
      case "TILEMAP_TILES":
        this.load.image(file.key, file.src);
        break;
      case "TILEMAP_MAP":
        this.load.tilemapTiledJSON(file.key, file.src);
        break;
      default:
        break;
    }
  };

  // TODO, keeping for reference
  /**
   * Constructs and loads in the Aavegotchi spritesheet, you can use customiseSVG() to create custom poses and animations
   */
  // loadInGotchiSpritesheet = async (
  //     gotchiObject: AavegotchiGameObject
  // ) => {
  //     const svg = gotchiObject.svg;
  //     const spriteMatrix = [
  //         // Front
  //         [
  //             customiseSvg(svg[0], { removeBg: true }),
  //             customiseSvg(svg[0], {
  //                 armsUp: true,
  //                 eyes: "happy",
  //                 float: true,
  //                 removeBg: true,
  //             }),
  //         ],
  //         // Left
  //         [
  //             customiseSvg(svg[1], { removeBg: true }),
  //         ],
  //         // Right
  //         [
  //             customiseSvg(svg[2], { removeBg: true }),
  //         ],
  //         // Right
  //         [
  //             customiseSvg(svg[3], { removeBg: true }),
  //         ]
  //     ];
  //     const { src, dimensions } = await constructSpritesheet(spriteMatrix);
  //     this.load.spritesheet(gotchiObject.spritesheetKey, src, {
  //         frameWidth: dimensions.width / dimensions.x,
  //         frameHeight: dimensions.height / dimensions.y,
  //     });
  //     this.load.start();
  // };
}
