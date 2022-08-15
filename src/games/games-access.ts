import { debugLog } from "dev-utils/debug";
import { debug } from "util";
import {
  CHART_SQUATS,
  FLY_FIT_SCENE,
  GYM_SWAMPS_ACTUAL,
  RUNNER_ACTUAL,
} from ".";

export { updateMiniGamesPlayedInSession, isRoomLocked, waterRoomLockKey };

const waterRoomLockKey = "water_room_lock";
const runnerRoomLock = "runner_room_lock";
const mysteryRoomLockKey = "mystery_room_lock";
const roomAccess = new Map();
const miniGamesPlayedInSession: string[] = [];

const isRoomLocked = ({ lockName }: { lockName: string }) => {
  return roomAccess.get(lockName) ?? true;
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
    miniGamesPlayedInSession.includes(FLY_FIT_SCENE) ||
    miniGamesPlayedInSession.includes(CHART_SQUATS)
  ) {
    roomAccess.set(waterRoomLockKey.toString(), false);
  }
  if (miniGamesPlayedInSession.includes(GYM_SWAMPS_ACTUAL)) {
    roomAccess.set(runnerRoomLock.toString(), false);
  }
  if (miniGamesPlayedInSession.includes(RUNNER_ACTUAL)) {
    roomAccess.set(mysteryRoomLockKey.toString(), false);
  }
};
