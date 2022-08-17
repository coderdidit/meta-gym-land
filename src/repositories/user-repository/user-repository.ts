import { gamesService } from "@services/index";
import Moralis from "moralis/types";
import { minigamesRepository } from "repositories/minigames-repository/minigames-repository";

/**
 * TODO: replace with Supabase or Firebase
 */
export { userRepository };
export type { UserStats };

const XP_COLUMN = "xp";
const CURRENT_LEVEL_COLUMN = "current_level";
const COMPLETED_MINIGAMES_COLUMN = "completed_minigames";

const LAST_POSITION_X_COLUMN = "last_position_x";
const LAST_POSITION_Y_COLUMN = "last_position_y";

const TOTAL_TIME_IN_MINIGAMES_COLUMN = "total_time_in_minigames";

interface MinigameUserStats {
  lastPositionInRoomX: number;
  lastPositionInRoomY: number;
  minigameCompleted: boolean;
  minigameKey: string;
  timeSpent: number;
}

interface UserStats {
  xp: number;
  completedMinigamesCount: number;
  fromattedTimeSpentInMinigames: string;
  lastRoomPosition: {
    x: number;
    y: number;
  };
  level: number;
}

type userRepositoryParams = {
  moralisUser: Moralis.User<Moralis.Attributes> | null;
};
const userRepository = ({ moralisUser }: userRepositoryParams) => {
  const getXp = (): number => {
    const hasXpColumn =
      moralisUser && moralisUser.get && moralisUser.get(XP_COLUMN);
    const rawXP = hasXpColumn ? moralisUser.get(XP_COLUMN) : 0;
    return rawXP.toFixed(4);
  };

  const getStats = (): UserStats => {
    if (!moralisUser) {
      return {
        xp: 0,
        completedMinigamesCount: 0,
        fromattedTimeSpentInMinigames: "",
        lastRoomPosition: {
          x: -1,
          y: -1,
        },
        level: 0,
      };
    }
    const minigames: number[] =
      moralisUser?.get(COMPLETED_MINIGAMES_COLUMN) ?? ([] as number[]);
    const timeSpent = moralisUser?.get(TOTAL_TIME_IN_MINIGAMES_COLUMN) ?? 0;
    return {
      xp: moralisUser?.get(XP_COLUMN) ?? 0,
      completedMinigamesCount: minigames.length,
      fromattedTimeSpentInMinigames: msToHMS(timeSpent),
      lastRoomPosition: {
        x: moralisUser?.get(LAST_POSITION_X_COLUMN) ?? -1,
        y: moralisUser?.get(LAST_POSITION_Y_COLUMN) ?? -1,
      },
      level: moralisUser?.get(CURRENT_LEVEL_COLUMN) ?? 0,
    };
  };

  const refresh = async (): Promise<
    Moralis.User<Moralis.Attributes> | undefined
  > => {
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

  const updateUser = async (newUserData: MinigameUserStats) => {
    const freshUser = await refresh(); // check if this is necessary

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

    if (
      newUserData.lastPositionInRoomX > 0 &&
      newUserData.lastPositionInRoomY > 0
    ) {
      freshUser?.set(LAST_POSITION_X_COLUMN, newUserData.lastPositionInRoomX);
      freshUser?.set(LAST_POSITION_Y_COLUMN, newUserData.lastPositionInRoomY);
    }
    await freshUser?.save();
  };

  return {
    getXp,
    updateUser,
    refresh,
    getStats,
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
