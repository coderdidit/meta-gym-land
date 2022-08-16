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
import {
  waterRoomLockKey,
  runnerRoomLockKey,
  mysteryRoomLockKey,
} from "./games-access";

export { gamesService };

const gamesService = () => {
  return { resolveLevel };
};

const resolveLevel = (userPlayedMinigames: number[]): number => {
  const gamesRepo = minigamesRepository();
  const levelsRepo = levelsRepository();

  const userPlayedGamesNames = userPlayedMinigames
    .map((gameId) => {
      return gamesRepo.IdToName.get(gameId) ?? "";
    })
    .filter((gameName) => gameName !== "");

  // TODO: change OR to AND
  if (
    userPlayedGamesNames.includes(FLY_FIT_SCENE) ||
    userPlayedGamesNames.includes(CHART_SQUATS) ||
    userPlayedGamesNames.includes(SPACE_STRETCH_SCENE)
  ) {
    return levelsRepo.nameToId(levelsRepo.athlete);
  }
  if (
    userPlayedGamesNames.includes(GYM_SWAMPS_ACTUAL) ||
    userPlayedGamesNames.includes(INVADERS)
  ) {
    return levelsRepo.nameToId(levelsRepo.seniorAthlete);
  }
  if (
    userPlayedGamesNames.includes(RUNNER_ACTUAL) ||
    userPlayedGamesNames.includes(RACE_TRACK_ACTUAL)
  ) {
    return levelsRepo.nameToId(levelsRepo.mysterySolver);
  }
  // check if user has GymBuddy
  // if not then it is trial
  return levelsRepo.nameToId(levelsRepo.beginner);
};
