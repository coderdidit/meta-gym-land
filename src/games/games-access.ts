import { debugLog } from "dev-utils/debug";
import {
  CHART_SQUATS,
  FLY_FIT_SCENE,
  GYM_SWAMPS_ACTUAL,
  INVADERS,
  RACE_TRACK_ACTUAL,
  RUNNER_ACTUAL,
  SPACE_STRETCH_SCENE,
} from ".";

export {
  updateMiniGamesPlayedInSession,
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
  // TODO: change OR to AND
  if (
    miniGamesPlayedInSession.includes(FLY_FIT_SCENE) ||
    miniGamesPlayedInSession.includes(CHART_SQUATS) ||
    miniGamesPlayedInSession.includes(SPACE_STRETCH_SCENE)
  ) {
    roomLocksState.set(waterRoomLockKey, false);
  }
  if (
    miniGamesPlayedInSession.includes(GYM_SWAMPS_ACTUAL) ||
    miniGamesPlayedInSession.includes(INVADERS)
  ) {
    roomLocksState.set(runnerRoomLockKey, false);
  }
  if (
    miniGamesPlayedInSession.includes(RUNNER_ACTUAL) ||
    miniGamesPlayedInSession.includes(RACE_TRACK_ACTUAL)
  ) {
    roomLocksState.set(mysteryRoomLockKey, false);
  }
};
