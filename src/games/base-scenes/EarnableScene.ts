import { debugLog } from "dev-utils/debug";
import Moralis from "moralis/types";
import Phaser from "phaser";
import { userRepository } from "repositories";

export class EarnableScene extends Phaser.Scene {
  score = 0;

  gameUser(): Moralis.User<Moralis.Attributes> | null {
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
}
