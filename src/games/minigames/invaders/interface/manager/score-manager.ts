import { getGameHeight, getGameWidth } from "games/helpers";
import {
  highlightTextColorNum,
  InGameFont,
  mainBgColorNum,
} from "GlobalStyles";
import { PLAYER_KEY } from "games";
import { createTextBox } from "@games/utils/text";

export class ScoreManager {
  scoreText!: Phaser.GameObjects.Text;
  line1Text!: Phaser.GameObjects.Text;
  line2Text!: Phaser.GameObjects.Text;
  lives!: Phaser.Physics.Arcade.Group;

  get noMoreLives() {
    return this.lives.countActive(true) === 0;
  }

  highScore = 0;
  score = 0;

  constructor(private _scene: Phaser.Scene) {
    this._init();
    this.print();
  }

  private _init() {
    const textConfig = {
      fontFamily: InGameFont,
      fill: "#ffffff",
    };
    const normalTextConfig = {
      ...textConfig,
      fontSize: "16px",
    };

    const bigTextConfig = {
      ...textConfig,
      fontSize: "36px",
    };

    // basic props
    const width = getGameWidth(this._scene);

    const scoreX = width - 100;
    this._scene.add.text(scoreX, 88, `SCORE`, normalTextConfig);
    this.scoreText = this._scene.add.text(scoreX, 104, "", normalTextConfig);

    // ending text
    this.line1Text = this._scene.add
      .text(width / 2, 320, "", bigTextConfig)
      .setOrigin(0.5);

    this.line2Text = this._scene.add
      .text(width / 2, 400, "", bigTextConfig)
      .setOrigin(0.5);

    // lives text
    this._setLivesText(width, normalTextConfig);
  }

  private _setLivesText(
    SIZE_X: number,
    textConfig: { fontSize: string; fontFamily: string; fill: string },
  ) {
    this._scene.add.text(SIZE_X - 100, 16, `LIVES`, textConfig);
    this.lives = this._scene.physics.add.group({
      maxSize: 3,
      runChildUpdate: true,
    });
    this.resetLives();
  }

  resetLives() {
    const SIZE_X = getGameWidth(this._scene);
    this.lives.clear(true, true);
    for (let i = 0; i < 3; i++) {
      const ship: Phaser.GameObjects.Sprite = this.lives.create(
        SIZE_X - 125 + 45 * i,
        60,
        PLAYER_KEY,
      );
      ship.setScale(0.5);
      ship.setOrigin(0.5, 0.5);
      // ship.setAngle(90);
      ship.setAlpha(0.6);
    }
  }

  setWinText({ scene }: { scene: Phaser.Scene }) {
    const width = getGameWidth(scene);
    const height = getGameHeight(scene);
    const youWonText = createTextBox({
      scene,
      x: width / 2,
      y: height / 2,
      config: { wrapWidth: 280 },
      bg: mainBgColorNum,
      stroke: highlightTextColorNum,
    });
    youWonText.setOrigin(0.5).setDepth(3).setScrollFactor(0, 0);
    youWonText.start("YOU WON!" + "\n" + "PRESS X FOR NEW GAME", 30);
  }

  setGameOverText({ scene }: { scene: Phaser.Scene }) {
    const width = getGameWidth(scene);
    const height = getGameHeight(scene);
    const gameOverText = createTextBox({
      scene,
      x: width / 2,
      y: height / 2,
      config: { wrapWidth: 280 },
      bg: mainBgColorNum,
      stroke: highlightTextColorNum,
    });
    gameOverText.setOrigin(0.5).setDepth(3).setScrollFactor(0, 0);
    gameOverText.start("GAME OVER!" + "\n" + "PRESS X FOR NEW GAME", 30);
  }

  hideText() {
    this.line1Text.setText("").setPadding(0).setDepth(0);
    this.line2Text.setText("").setPadding(0).setDepth(0);
  }

  setHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    this.score = 0;
    this.print();
  }

  print() {
    this.scoreText.setText(`${this.padding(this.score)}`);
  }

  increaseScore(step = 1) {
    this.score += step;
    this.print();
  }

  padding(num: number) {
    return `${num}`.padStart(4, "0");
  }
}
