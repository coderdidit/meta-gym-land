import Moralis from "moralis/types";

export { userRepository };

const XP_COLUMN = "mbmtBalance";
const CURRENT_LEVEL_COLUMN = "current_level";
const COMPLETED_MINIGAMES_COLUMN = "completed_minigames";
const TOTAL_TIME_IN_MINIGAMES_COLUMN = "total_time_in_minigames";

const LAST_POSITION_X_COLUMN = "last_position_x";
const LAST_POSITION_Y_COLUMN = "last_position_y";

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
  };
};
