import { getGameHeight, getGameWidth } from "games/helpers";
import { InGameFont } from "GlobalStyles";
import Phaser from "phaser";
import { RACE_TRACK, RACE_TRACK_ACTUAL } from "../..";

export { RaceTrackPreloadScene };

const SceneConfig = {
  active: false,
  visible: false,
  key: RACE_TRACK,
};

interface FileToLoad {
  key: string;
  file: string;
}

class RaceTrackPreloadScene extends Phaser.Scene {
  progressBarContainer!: Phaser.GameObjects.Rectangle;
  progressBar!: Phaser.GameObjects.Rectangle;
  loadingText!: Phaser.GameObjects.Text;
  loadIndex = 0;

  constructor() {
    super(SceneConfig);
  }

  preload() {
    this.createProgressBar();

    this.load.setBaseURL("/assets/minigames/race-track");
    const imagesToLoad = [
      {
        key: "race_track_bg",
        file: "bg.png",
      },
    ];

    for (const f of imagesToLoad) {
      this.load.image(f.key, f.file);
    }

    this.load.on(
      "filecomplete",
      (key: string) => {
        this.loadNextFile(this.loadIndex, imagesToLoad);
      },
      this,
    );
    this.loadNextFile(0, imagesToLoad);
  }

  create() {
    this.scene.start(RACE_TRACK_ACTUAL);
  }

  private loadNextFile(fileIndex: number, files: FileToLoad[]) {
    this.loadIndex++;
    if (this.loadingText && this.progressBar && this.progressBarContainer) {
      this.loadingText.setText("Loading...");
      this.progressBar.width =
        (this.progressBarContainer.width / files.length) * fileIndex;
    }
  }

  /**
   * Renders UI component to display loading progress
   */
  private createProgressBar = () => {
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
}
