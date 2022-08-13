import Phaser from "phaser";
import { RACE_TRACK, RACE_TRACK_ACTUAL } from "../../shared";

export { RaceTrackPreloadScene };

const SceneConfig = {
  active: false,
  visible: false,
  key: RACE_TRACK,
};

class RaceTrackPreloadScene extends Phaser.Scene {
  constructor() {
    super(SceneConfig);
  }

  preload() {
    this.load.setBaseURL("/assets/minigames/race-track");
    this.load.image("race_track_bg", "bg.png");
  }

  create() {
    this.scene.start(RACE_TRACK_ACTUAL);
  }
}
