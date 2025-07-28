import { EarnableScene } from "./EarnableScene";
import { GYM_ROOM_SCENE } from "..";
import Key from "ts-key-namespace";
import { userRepository } from "repositories";
import { debugLog } from "dev-utils/debug";
import { SimpleUser } from "../../types/user";

type handleExitParams = {
  thisSceneKey: string;
  callbackOnExit?: () => void;
};

export class SceneInMetaGymRoom extends EarnableScene {
  selectedAvatar: any;
  startTime!: number;

  init = (data: any) => {
    this.selectedAvatar = data.selectedAvatar;
    this.startTime = Date.now();
  };

  async exit(thisSceneKey: string) {
    this.game.registry.values?.setMinigame(GYM_ROOM_SCENE);
    const userStats = {
      minigameCompleted: this.minigameCompleted(),
      minigameKey: thisSceneKey,
      timeSpent: Date.now() - this.startTime,
    };
    const moralisUser = this.gameUser();
    const userRepo = userRepository({
      moralisUser,
      avatar: this.selectedAvatar,
    });
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

  private minigameCompleted() {
    // TODO: make minScore higher in the future
    const minScore = 1;
    return this.score >= minScore;
  }

  handleExit({ thisSceneKey, callbackOnExit }: handleExitParams) {
    // controls
    this.input?.keyboard?.on(
      "keydown",
      async (event: KeyboardEvent) => {
        const userStats = {
          minigameCompleted: this.minigameCompleted(),
          minigameKey: thisSceneKey,
          timeSpent: Date.now() - this.startTime,
        };
        const moralisUser = this.gameUser();
        const userRepo = userRepository({
          moralisUser,
          avatar: this.selectedAvatar,
        });

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

  gameUser(): SimpleUser | null {
    const moralisUserPassedToRegistry = this.game.registry.values?.user;
    const avatarHasUser = this.game.registry.values?.avatar;

    debugLog(
      "[moralisUserPassedToRegistry] attributes",
      moralisUserPassedToRegistry?.attributes,
    );
    return avatarHasUser ? moralisUserPassedToRegistry : null;
  }

  updateUserStats(newUserData: any) {
    const moralisUser = this.gameUser();
    debugLog("[SceneInMetaGymRoom] updateUserStats", moralisUser);
    if (moralisUser) {
      // Update user stats logic here
      console.log("Updating user stats:", newUserData);
    }
  }
}
