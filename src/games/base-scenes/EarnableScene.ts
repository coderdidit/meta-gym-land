import { debugLog } from "dev-utils/debug";
import { SimpleUser } from "../../types/user";
import { userRepository } from "repositories";

export abstract class EarnableScene extends Phaser.Scene {
  score = 0;

  gameUser(): SimpleUser | null {
    // add refresh data logic
    // same in rewards page
    const avatarUserProp = this.game.registry.values?.avatar?.user;
    const avatarHasUser = Boolean(avatarUserProp);
    const moralisUserPassedToRegistry = this.game.registry.values?.user;
    // if avatar.user is null
    // it means we are using Demo GymBuddy
    debugLog(
      "[moralisUserPassedToRegistry] attributes",
      moralisUserPassedToRegistry?.attributes,
    );
    return avatarHasUser ? moralisUserPassedToRegistry : null;
  }

  currentXPBalance() {
    const moralisUser = this.gameUser();
    const userRepo = userRepository({
      moralisUser,
      avatar: this.game.registry.values?.avatar,
    });
    return userRepo.getStats()?.xp ?? 0;
  }

  updateUserStats(newUserData: any) {
    const moralisUser = this.gameUser();
    debugLog("[EarnableScene] updateUserStats", moralisUser);
    if (moralisUser) {
      // Update user stats logic here
      console.log("Updating user stats:", newUserData);
    }
  }
}
