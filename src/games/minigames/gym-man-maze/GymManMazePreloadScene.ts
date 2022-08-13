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
    this.load.tilemapTiledJSON("swamp-map", "swamp-map.json");
    this.load.image("swamp-tiles", "swamp-tiles.png");
    this.load.image("seed", "seed.png");
  }

  create() {
    this.scene.start(GYM_MAN_MAZE_ACTUAL);
  }
}
