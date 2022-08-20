import Phaser from "phaser";
import { GYM_SWAMPS, GYM_SWAMPS_ACTUAL } from "../..";

export { GymSwampsPreloadScene };

const SceneConfig = {
  active: false,
  visible: false,
  key: GYM_SWAMPS,
};

const gridSize = 32;

class GymSwampsPreloadScene extends Phaser.Scene {
  constructor() {
    super(SceneConfig);
  }

  preload() {
    this.load.setBaseURL("/assets/minigames/gym-swamps");
    this.load.tilemapTiledJSON("swamp-map", "swamp-map.json");
    this.load.image("swamp-tiles", "swamp-tiles.png");
    this.load.image("bottle", "bottle.png");
    this.load.image("fish", "fish.png");
  }

  create() {
    this.scene.start(GYM_SWAMPS_ACTUAL);
  }
}
