import Phaser from "phaser";
import { getGameWidth, getGameHeight } from "../../helpers";
import { PlayerWithName } from "../../objects";
import { INVADERS } from "../../shared";
import { createTextBox } from "../../utils/text";
import { mainBgColorNum, highlightTextColorNum } from "../../../GlobalStyles";
import { SceneInMetaGymRoom } from "../../base-scenes/ts/scene-in-metagym-room";

const SceneConfig = {
  active: false,
  visible: false,
  key: INVADERS,
};

export class InvadersScene extends SceneInMetaGymRoom {
  player: any; // TODO define type

  constructor() {
    super(SceneConfig);
  }

  create() {
    // basic props
    const width = getGameWidth(this);
    const height = getGameHeight(this);

    // basics
    this.handleExit({
      thisSceneKey: INVADERS,
    });

    createTextBox({
      scene: this,
      x: width * 0.05,
      y: height * 0.015,
      config: { wrapWidth: 280 },
      bg: mainBgColorNum,
      stroke: highlightTextColorNum,
    }).start("press ESC to go back", 10);

    const hintTextBox = createTextBox({
      scene: this,
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
    hintTextBox.start("🤖 Welcome in MetaGymLand Invaders", 50);

    // player
    this.player = new PlayerWithName({
      scene: this,
      x: Phaser.Math.Between(width * 0.1, this.physics.world.bounds.width - 80),
      y: this.physics.world.bounds.height,
      name: this.selectedAvatar?.name,
    });

    this.player.setDepth(1);
    this.player.body.setCollideWorldBounds(true);
  }

  // eslint-disable-next-line no-unused-vars
  update(time: number, delta: number) {
    this.player?.update();
  }
}
