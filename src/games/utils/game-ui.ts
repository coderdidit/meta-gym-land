import Phaser from "phaser";
import { createTextBox } from "./text";
import {
  mainBgColorNum,
  highlightTextColorNum,
  highlightTextColor,
  InGameFont,
} from "../../GlobalStyles";

export class GameUI {
  static createEscHint(
    scene: Phaser.Scene,
    width: number,
    height: number,
    speed = 10,
  ) {
    return createTextBox({
      scene,
      x: width * 0.05,
      y: height * 0.015,
      config: { wrapWidth: 280 },
      bg: mainBgColorNum,
      stroke: highlightTextColorNum,
    }).start("press ESC to go back", speed);
  }

  static createScoreBoard(
    scene: Phaser.Scene,
    width: number,
    height: number,
    initialScore = 0,
  ) {
    return scene.add.text(
      width * 0.05,
      height * 0.04,
      `SCORE: ${initialScore}`,
      {
        color: highlightTextColor,
        font: `500 20px ${InGameFont}`,
      },
    );
  }

  static createHintTextBox(
    scene: Phaser.Scene,
    width: number,
    height: number,
    message: string,
    speed = 50,
  ) {
    const hintTextBox = createTextBox({
      scene,
      x: width / 2 + width / 4,
      y: height * 0.015,
      config: { wrapWidth: 280 },
      bg: 0xfffefe,
      stroke: 0x00ff00,
      align: "center",
      txtColor: "#212125",
    });
    hintTextBox.setDepth(1);
    hintTextBox.setScrollFactor(0, 0);
    hintTextBox.start(message, speed);
    return hintTextBox;
  }

  static createCenteredTextBox(
    scene: Phaser.Scene,
    width: number,
    height: number,
    message: string,
    speed = 50,
  ) {
    return createTextBox({
      scene,
      x: width / 2,
      y: height / 2,
      config: { wrapWidth: 280 },
      bg: mainBgColorNum,
      stroke: highlightTextColorNum,
    })
      .setOrigin(0.5)
      .setDepth(1)
      .setScrollFactor(0, 0)
      .start(message, speed);
  }
}
