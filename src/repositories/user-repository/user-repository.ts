import Moralis from "moralis/types";

/**
 * TODO: replace with Supabase or Firebase
 */
export { userRepository };

const XP_COLUMN = "mbmtBalance";
const CURRENT_LEVEL_COLUMN = "current_level";
const COMPLETED_MINIGAMES_COLUMN = "completed_minigames";

const LAST_POSITION_X_COLUMN = "last_position_x";
const LAST_POSITION_Y_COLUMN = "last_position_y";

interface UserInGame {
  xp: number;
  currentLevel: number;
  completedMinigames: number[];
  totalTimeInMinigames: number;
  lastPositionX: number;
  lastPositionY: number;
}

type userRepositoryParams = {
  moralisUser: Moralis.User<Moralis.Attributes> | null;
};
const userRepository = ({ moralisUser }: userRepositoryParams) => {
  const getXp = () => {
    const hasXpColumn =
      moralisUser && moralisUser.get && moralisUser.get(XP_COLUMN);
    const rawXP = hasXpColumn ? moralisUser.get(XP_COLUMN) : 0;
    return rawXP.toFixed(4);
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

  const updateUser = async (newUserData: UserInGame) => {
    const freshUser = await refresh();
    freshUser?.increment(XP_COLUMN, newUserData.xp);
    // resolve minigames
    const completedMinigamesSoFar =
      (await freshUser?.get(COMPLETED_MINIGAMES_COLUMN)) ?? ([] as number[]);

    const updatedMinigames = Array.from(
      new Set(completedMinigamesSoFar.concat(newUserData.completedMinigames)),
    );
    freshUser?.set(COMPLETED_MINIGAMES_COLUMN, updatedMinigames);
    // resolve current level logic base on minigames
    freshUser?.set(CURRENT_LEVEL_COLUMN, newUserData.currentLevel);

    // TODO: if map changed reset
    if (newUserData.lastPositionX > 0 && newUserData.lastPositionY > 0) {
      freshUser?.set(LAST_POSITION_X_COLUMN, newUserData.lastPositionX);
      freshUser?.set(LAST_POSITION_Y_COLUMN, newUserData.lastPositionY);
    }
    await freshUser?.save();
  };

  const updateXP = async (minigmeSocre: number) => {
    if (moralisUser && moralisUser.set && moralisUser.get) {
      const xpSoFar = moralisUser.get(XP_COLUMN) || 0;
      const inMiniGameXP = minigmeSocre * 0.1;
      const newXP = xpSoFar + inMiniGameXP;
      moralisUser.set(XP_COLUMN, newXP);
      await moralisUser.save();
    }
  };

  return {
    getXp,
    updateXP,
    updateUser,
    refresh,
  };
};
