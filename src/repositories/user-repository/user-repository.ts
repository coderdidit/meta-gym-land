import { gamesService } from "@services/index";
import { debugLog } from "dev-utils/debug";
import { minigamesRepository } from "repositories/minigames-repository/minigames-repository";
import { SimpleUser } from "../../types/user";

/**
 * TODO: replace with Supabase or Firebase
 */
export { userRepository };
export type { UserStats, UserRepository };

const XP_COLUMN = "xp";
const CURRENT_LEVEL_COLUMN = "current_level";
const COMPLETED_MINIGAMES_COLUMN = "completed_minigames";
const TOTAL_TIME_IN_MINIGAMES_COLUMN = "total_time_in_minigames";
const GYM_BUDDY_MAGE_MINTED_COLUMN = "gym_buddy_mage_minted";

interface MinigameUserStats {
  minigameCompleted: boolean;
  minigameKey: string;
  timeSpent: number;
}

interface UserStats {
  xp: number;
  completedMinigamesCount: number;
  fromattedTimeSpentInMinigames: string;
  level: number;
  gymBuddyMageMinted: boolean;
}

type UserRepository = {
  updateUser: (newUserData: MinigameUserStats) => Promise<void>;
  refresh: () => Promise<SimpleUser | undefined>;
  getStats: () => UserStats | undefined;
  updateRewardsStatus: () => Promise<void>;
};

type userRepositoryParams = {
  moralisUser: SimpleUser | null;
  avatar: any;
};

const userRepository = ({
  moralisUser,
  avatar,
}: userRepositoryParams): UserRepository => {
  const getStats = (): UserStats | undefined => {
    debugLog("[userRepository] getStats", { moralisUser, avatar });
    if (!moralisUser) {
      return undefined;
    }
    if (!avatar) {
      return undefined;
    }
    if (avatar && avatar.name && avatar.name === "demo buddy") {
      return undefined;
    }

    const defaultLevelForUserWithMintedAvatar = 1;

    const minigames: number[] =
      moralisUser?.get(COMPLETED_MINIGAMES_COLUMN) ?? ([] as number[]);
    const timeSpent = moralisUser?.get(TOTAL_TIME_IN_MINIGAMES_COLUMN) ?? 0;
    return {
      xp: moralisUser?.get(XP_COLUMN) ?? 0,
      completedMinigamesCount: minigames.length,
      fromattedTimeSpentInMinigames: msToHMS(timeSpent),
      level:
        moralisUser?.get(CURRENT_LEVEL_COLUMN) ??
        defaultLevelForUserWithMintedAvatar,
      gymBuddyMageMinted:
        moralisUser?.get(GYM_BUDDY_MAGE_MINTED_COLUMN) ?? false,
    };
  };

  const refresh = async (): Promise<SimpleUser | undefined> => {
    return moralisUser?.fetch().then(
      (usr) => {
        return usr;
      },
      (error) => {
        console.error(error);
        return undefined;
      },
    );
  };

  const updateRewardsStatus = async () => {
    const freshUser = await refresh();
    freshUser?.set(GYM_BUDDY_MAGE_MINTED_COLUMN, true);
    try {
      await freshUser?.save();
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = async (newUserData: MinigameUserStats) => {
    const freshUser = await refresh(); // check if this is necessary

    debugLog("[userRepo] updateUser", newUserData);

    // update time spent
    freshUser?.increment(TOTAL_TIME_IN_MINIGAMES_COLUMN, newUserData.timeSpent);
    // update xp
    if (newUserData.minigameCompleted) {
      freshUser?.increment(XP_COLUMN, 0.5);
    }
    // resolve minigames and level
    if (newUserData.minigameCompleted) {
      const completedMinigamesSoFar: number[] =
        (await freshUser?.get(COMPLETED_MINIGAMES_COLUMN)) ?? ([] as number[]);

      const minigamesRepo = minigamesRepository();
      const curMinigameKey = newUserData.minigameKey;
      const completedMinigameId = minigamesRepo.nameToId(curMinigameKey);

      const updatedMinigames = Array.from(
        new Set(completedMinigamesSoFar.concat(completedMinigameId)),
      );
      freshUser?.set(COMPLETED_MINIGAMES_COLUMN, updatedMinigames);
      const gamesSvc = gamesService();
      freshUser?.set(
        CURRENT_LEVEL_COLUMN,
        gamesSvc.resolveLevel(updatedMinigames),
      );
    }

    try {
      await freshUser?.save();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    updateUser,
    refresh,
    getStats,
    updateRewardsStatus,
  };
};

const msToHMS = (ms: number) => {
  // 1- Convert to seconds:
  let seconds = ms / 1000;
  // 2- Extract hours:
  const hours = seconds / 3600; // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  // 3- Extract minutes:
  const minutes = seconds / 60; // 60 seconds in 1 minute
  // 4- Keep only seconds not extracted to minutes:
  seconds = seconds % 60;

  const { round } = Math;
  return round(hours) + ":" + round(minutes) + ":" + round(seconds);
};
