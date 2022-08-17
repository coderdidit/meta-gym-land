import { EarnableScene } from "./EarnableScene";
import Phaser from "phaser";
import { GYM_ROOM_SCENE } from "..";
import Key from "ts-key-namespace";
import { getMainRoomPlayerExitPos } from "@games/utils/Globals";
import { userRepository } from "repositories";
import { debugLog } from "dev-utils/debug";

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

  async exit(thisSceneKey: string) {
    this.game.registry.values?.setMinigame(GYM_ROOM_SCENE);

    const lastExitPositions = getMainRoomPlayerExitPos();
    const minScore = 1;
    const userStats = {
      lastPositionInRoomX: lastExitPositions.x,
      lastPositionInRoomY: lastExitPositions.y,
      minigameCompleted: this.score >= minScore,
      minigameKey: thisSceneKey,
      timeSpent: Date.now() - this.startTime,
    };
    const moralisUser = this.gameUser();
    const userRepo = userRepository({ moralisUser });
    if (moralisUser) {
      debugLog("[exit] will update user stats", {
        ...userStats,
        score: this.score,
      });
      await userRepo.updateUser(userStats);
    }

    this.scene.start(GYM_ROOM_SCENE, {
      prevScene: thisSceneKey,
      prevSceneScore: this.score,
      prevSceneTimeSpentMillis: Date.now() - this.startTime,
    });
  }

  handleExit({ thisSceneKey, callbackOnExit }: handleExitParams) {
    // constrols
    this.input.keyboard.on(
      "keydown",
      async (event: KeyboardEvent) => {
        const lastExitPositions = getMainRoomPlayerExitPos();
        const minScore = 1;
        const userStats = {
          lastPositionInRoomX: lastExitPositions.x,
          lastPositionInRoomY: lastExitPositions.y,
          minigameCompleted: this.score >= minScore,
          minigameKey: thisSceneKey,
          timeSpent: Date.now() - this.startTime,
        };
        const moralisUser = this.gameUser();
        const userRepo = userRepository({ moralisUser });

        const key = event.key;
        if (key === Key.Escape) {
          if (callbackOnExit) {
            callbackOnExit();
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
