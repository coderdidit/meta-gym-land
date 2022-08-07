import Phaser from "phaser";
import { GYM_MAN_MAZE, GYM_MAN_MAZE_ACTUAL } from "../../shared";

export { GymManMazePreloadScene };

const SceneConfig = {
  active: false,
  visible: false,
  key: GYM_MAN_MAZE,
};

const gridSize = 32;

class GymManMazePreloadScene extends Phaser.Scene {
  constructor() {
    super(SceneConfig);
  }

  preload() {
    this.load.setBaseURL("/assets/minigames/gym-man-maze");
    this.load.spritesheet("pacman-spritesheet", "pacman-spritesheet.png", {
      frameWidth: gridSize,
      frameHeight: gridSize,
    });
    this.load.tilemapTiledJSON("map", "map.json");
    this.load.image("pacman-tiles", "pacman-tiles.png");
    this.load.image("pill", "pill.png");
    this.load.image("lifecounter", "lifecounter.png");
  }

  create() {
    this.scene.start(GYM_MAN_MAZE_ACTUAL);
  }
}
