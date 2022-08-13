import { EarnableScene } from "./EarnableScene";
import Phaser from "phaser";
import { GYM_ROOM_SCENE } from "..";
import Key from "ts-key-namespace";

type handleExitParams = {
  thisSceneKey: string;
  callbackOnExit?: () => void;
};

export class SceneInMetaGymRoom extends EarnableScene {
  selectedAvatar: any;

  init = (data: any) => {
    this.selectedAvatar = data.selectedAvatar;
  };

  exit() {
    this.game.registry.values?.setMinigame(GYM_ROOM_SCENE);
    this.scene.start(GYM_ROOM_SCENE);
  }

  handleExit({ thisSceneKey, callbackOnExit }: handleExitParams) {
    // constrols
    this.input.keyboard.on(
      "keydown",
      async (event: KeyboardEvent) => {
        const key = event.key;
        if (key === Key.Escape) {
          if (callbackOnExit) {
            callbackOnExit();
          }
          await this.updateXP();
          this.exit();
        }
        if (key === "x") {
          this.scene.start(thisSceneKey);
        }
      },
      this,
    );
  }
}
