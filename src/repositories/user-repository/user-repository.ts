import Moralis from "moralis/types";

export { userRepository };

const XP_COLUMN = "mbmtBalance";
const CURRENT_LEVEL_COLUMN = "current_level";
const COMPLETED_MINIGAMES_COLUMN = "completed_minigames";
const TOTAL_TIME_IN_MINIGAMES_COLUMN = "total_time_in_minigames";

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

  const updateUser = async (newUserData: UserInGame) => {
    moralisUser?.increment(XP_COLUMN, newUserData.xp);
    // resolve current level logic
    // resolve minigames
    moralisUser?.set(CURRENT_LEVEL_COLUMN, newUserData.currentLevel);
    moralisUser?.set(
      COMPLETED_MINIGAMES_COLUMN,
      newUserData.completedMinigames,
    );

    moralisUser?.increment(
      TOTAL_TIME_IN_MINIGAMES_COLUMN,
      newUserData.totalTimeInMinigames,
    );

    // TODO: if map changed reset
    moralisUser?.set(LAST_POSITION_X_COLUMN, newUserData.lastPositionX);
    moralisUser?.set(LAST_POSITION_Y_COLUMN, newUserData.lastPositionY);
    await moralisUser?.save();
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
  };
};
