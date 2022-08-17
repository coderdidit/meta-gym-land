import { EarnableScene } from "./EarnableScene";
import Phaser from "phaser";
import { GYM_ROOM_SCENE } from "..";
import Key from "ts-key-namespace";
import { getMainRoomPlayerExitPos } from "@games/utils/Globals";
import { userRepository } from "repositories";

type handleExitParams = {
  thisSceneKey: string;
  callbackOnExit?: () => void;
};

export class SceneInMetaGymRoom extends EarnableScene {
  selectedAvatar: any;
  startTime = Date.now();

  init = (data: any) => {
    this.selectedAvatar = data.selectedAvatar;
  };

  exit(thisSceneKey?: string) {
    this.game.registry.values?.setMinigame(GYM_ROOM_SCENE);
    this.scene.start(GYM_ROOM_SCENE, {
      prevScene: thisSceneKey,
      prevSceneScore: this.score,
      prevSceneTimeSpentMillis: Date.now() - this.startTime,
    });
  }

  handleExit({ thisSceneKey, callbackOnExit }: handleExitParams) {
    const lastExitPositions = getMainRoomPlayerExitPos();
    const minScore = 5;
    const isGameCompleted = this.score > minScore;
    const userStats = {
      lastPositionInRoomX: lastExitPositions.x,
      lastPositionInRoomY: lastExitPositions.y,
      minigameCompleted: isGameCompleted ? true : false,
      minigameKey: thisSceneKey,
      timeSpent: Date.now() - this.startTime,
    };
    const moralisUser = this.gameUser();
    const userRepo = userRepository({ moralisUser });
    // constrols
    this.input.keyboard.on(
      "keydown",
      async (event: KeyboardEvent) => {
        const key = event.key;
        if (key === Key.Escape) {
          if (callbackOnExit) {
            callbackOnExit();
          }
          if (moralisUser) {
            await userRepo.updateUser(userStats);
          }
          this.exit(thisSceneKey);
        }
        if (key === "x") {
          if (moralisUser) {
            await userRepo.updateUser(userStats);
          }
          this.scene.start(thisSceneKey);
        }
      },
      this,
    );
  }
}
