import {
  FLY_FIT_SCENE,
  CHART_SQUATS,
  SPACE_STRETCH_SCENE,
  GYM_SWAMPS_ACTUAL,
  INVADERS,
  RUNNER_ACTUAL,
  RACE_TRACK_ACTUAL,
} from "@games/index";
import { levelsRepository, minigamesRepository } from "repositories";

export { gamesService };

const gamesService = () => {
  return { resolveLevel };
};

// if no GymBuddy is owned by the user, no user context is passed to the game
// so this function will not be called and user level will be 0
const resolveLevel = (userPlayedMinigames: number[]): number => {
  const gamesRepo = minigamesRepository();
  const levelsRepo = levelsRepository();

  const userPlayedGamesNames = userPlayedMinigames
    .map((gameId) => {
      return gamesRepo.IdToName.get(gameId) ?? "";
    })
    .filter((gameName) => gameName !== "");

  let level = levelsRepo.nameToId(levelsRepo.beginner);
  if (
    userPlayedGamesNames.includes(FLY_FIT_SCENE) &&
    userPlayedGamesNames.includes(CHART_SQUATS) &&
    userPlayedGamesNames.includes(SPACE_STRETCH_SCENE)
  ) {
    level = levelsRepo.nameToId(levelsRepo.athlete);
  }
  if (
    userPlayedGamesNames.includes(GYM_SWAMPS_ACTUAL) &&
    userPlayedGamesNames.includes(INVADERS)
  ) {
    level = levelsRepo.nameToId(levelsRepo.seniorAthlete);
  }
  if (userPlayedGamesNames.includes(RUNNER_ACTUAL)) {
    level = levelsRepo.nameToId(levelsRepo.mysterySolver);
  }
  return level;
};
