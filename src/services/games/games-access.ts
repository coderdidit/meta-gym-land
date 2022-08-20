import { debugLog } from "dev-utils/debug";
import {
  CHART_SQUATS,
  FLY_FIT_SCENE,
  GYM_SWAMPS_ACTUAL,
  INVADERS,
  RACE_TRACK_ACTUAL,
  RUNNER_ACTUAL,
  SPACE_STRETCH_SCENE,
} from "@games/index";
import { UserStats } from "repositories/user-repository/user-repository";
import { levelsRepository } from "repositories";
import { Levels } from "repositories/levels-repository/levels-repository";

export {
  updateMiniGamesPlayedInSession,
  updateMiniGamesAccess,
  isRoomLocked,
  waterRoomLockKey,
  runnerRoomLockKey,
  mysteryRoomLockKey,
};

const waterRoomLockKey = "water_room_lock";
const runnerRoomLockKey = "runner_room_lock";
const mysteryRoomLockKey = "mystery_room_lock";

const roomLocksState = new Map<string, boolean>();
const miniGamesPlayedInSession: string[] = [];

const isRoomLocked = ({ lockName }: { lockName: string }) => {
  return roomLocksState.get(lockName) ?? true;
  // set to false for debug
  // return false;
};

const updateMiniGamesPlayedInSession = (data: {
  selectedAvatar: any;
  prevScene?: string;
  prevSceneScore?: number;
  prevSceneTimeSpentMillis?: number;
}) => {
  debugLog("[updateMiniGamesPlayedInSession]", data);
  if (data?.prevScene) {
    miniGamesPlayedInSession.push(data?.prevScene);
  }
  if (
    miniGamesPlayedInSession.includes(FLY_FIT_SCENE) &&
    miniGamesPlayedInSession.includes(CHART_SQUATS) &&
    miniGamesPlayedInSession.includes(SPACE_STRETCH_SCENE)
  ) {
    roomLocksState.set(waterRoomLockKey, false);
  }
  if (
    miniGamesPlayedInSession.includes(GYM_SWAMPS_ACTUAL) &&
    miniGamesPlayedInSession.includes(INVADERS)
  ) {
    roomLocksState.set(runnerRoomLockKey, false);
  }
  if (miniGamesPlayedInSession.includes(RUNNER_ACTUAL)) {
    roomLocksState.set(mysteryRoomLockKey, false);
  }
};

const updateMiniGamesAccess = (userStats: UserStats | undefined) => {
  if (!userStats) {
    roomLocksState.set(waterRoomLockKey, true);
    roomLocksState.set(runnerRoomLockKey, true);
    roomLocksState.set(mysteryRoomLockKey, true);
    return;
  }
  const userLevel = userStats.level;
  // consider to do this logic based on NFT ownership
  // this logic will tell if you are eligable
  switch (userLevel) {
    case Levels.TRIAL:
      roomLocksState.set(waterRoomLockKey, true);
      roomLocksState.set(runnerRoomLockKey, true);
      roomLocksState.set(mysteryRoomLockKey, true);
      break;
    case Levels.BEGINNER:
      roomLocksState.set(waterRoomLockKey, true);
      roomLocksState.set(runnerRoomLockKey, true);
      roomLocksState.set(mysteryRoomLockKey, true);
      break;
    case Levels.ATHLETE:
      roomLocksState.set(waterRoomLockKey, false);
      roomLocksState.set(runnerRoomLockKey, true);
      roomLocksState.set(mysteryRoomLockKey, true);
      break;
    case Levels.SENIOR_ATHLETE:
      roomLocksState.set(waterRoomLockKey, false);
      roomLocksState.set(runnerRoomLockKey, false);
      roomLocksState.set(mysteryRoomLockKey, true);
      break;
    case Levels.MYSTERY_SOLVER:
      roomLocksState.set(waterRoomLockKey, false);
      roomLocksState.set(runnerRoomLockKey, false);
      roomLocksState.set(mysteryRoomLockKey, false);
      break;
  }
};
