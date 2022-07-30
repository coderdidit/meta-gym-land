import Phaser from "phaser";
import {
  TextBox,
  BBCodeText,
  RoundRectangle,
} from "phaser3-rex-plugins/templates/ui/ui-components";
import { InGameFont } from "../../GlobalStyles";

export { createTextBox };

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;

const GetValue = Phaser.Utils.Objects.GetValue;

type createTextBoxParams = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  config: object;
  bg?: number;
  stroke?: number;
  align?: "left" | "center" | "right";
  txtColor?: string;
  padding?: number;
};

const createTextBox = function (params: createTextBoxParams) {
  const { scene, x, y, config, bg, stroke, align, txtColor, padding } = params;
  const wrapWidth = GetValue(config, "wrapWidth", 0);
  const fixedWidth = GetValue(config, "fixedWidth", 0);
  const fixedHeight = GetValue(config, "fixedHeight", 0);

  const tBoxCfg = {
    x: x,
    y: y,
    background: getRoundRectangle(
      scene,
      bg ?? COLOR_PRIMARY,
      stroke ?? COLOR_LIGHT,
    ),
    text: getBBcodeText(
      scene,
      wrapWidth,
      fixedWidth,
      fixedHeight,
      align ?? "center",
      txtColor ?? "white",
      padding ?? 10,
    ),
    // draggable: true,
    space: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10,
      icon: 0,
      text: 10,
    },
  };
  const textBox = new TextBox(scene, tBoxCfg);
  scene.add.existing(textBox);
  textBox.setOrigin(0).layout();
  return textBox;
};

const getRoundRectangle = function (
  scene: Phaser.Scene,
  bg: number,
  stroke: number,
) {
  const rect = new RoundRectangle(scene, 0, 0, 2, 2, 20, bg);
  rect.setStrokeStyle(4, stroke);
  scene.add.existing(rect);
  return rect;
};

const getBBcodeText = function (
  scene: Phaser.Scene,
  wrapWidth: number,
  fixedWidth: number,
  fixedHeight: number,
  align: "left" | "center" | "right",
  txtColor: null | string | number,
  padding: number,
) {
  const bbTextCfg: BBCodeText.TextStyle = {
    fixedWidth: fixedWidth,
    fixedHeight: fixedHeight,
    fontFamily: InGameFont,
    align: align,
    fontSize: "18px",
    lineSpacing: 5,
    wrap: {
      mode: "word",
      width: wrapWidth,
    },
    padding: {
      left: padding,
      right: padding,
      top: padding,
      bottom: padding,
    },
    color: txtColor,
    maxLines: 10,
  };
  const txt = new BBCodeText(scene, 0, 0, "", bbTextCfg);
  scene.add.existing(txt);
  return txt;
};
