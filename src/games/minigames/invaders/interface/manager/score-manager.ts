import { getGameWidth } from "games/helpers";
import { InGameFont } from "GlobalStyles";
import { PLAYER_KEY } from "games/shared";

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

    const scoreX = width * 0.06;
    this._scene.add.text(scoreX, 16, `SCORE`, normalTextConfig);
    this.scoreText = this._scene.add.text(scoreX, 32, "", normalTextConfig);

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

  setWinText() {
    this._setBigText("YOU WON!", "PRESS SPACE FOR NEW GAME");
  }

  setGameOverText() {
    this._setBigText("GAME OVER", "PRESS SPACE FOR NEW GAME");
  }

  hideText() {
    this._setBigText("", "");
  }

  private _setBigText(line1: string, line2: string) {
    this.line1Text.setText(line1);
    this.line2Text.setText(line2);
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

  increaseScore(step = 10) {
    this.score += step;
    this.print();
  }

  padding(num: number) {
    return `${num}`.padStart(4, "0");
  }
}
