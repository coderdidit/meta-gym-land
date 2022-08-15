import { FLY_FIT_SCENE } from ".";

export { updateMiniGamesPlayedInSession, isRoomLocked };

const waterRoomLockKey = "water_room_lock";
const locked = true;
const roomAccess = new Map([[waterRoomLockKey, locked]]);
const miniGamesPlayedInSession: string[] = [];

const isRoomLocked = ({ lockName }: { lockName: string }) => {
  return roomAccess.get(lockName) ?? false;
};

const updateMiniGamesPlayedInSession = (data: {
  selectedAvatar: any;
  prevScene?: string;
  prevSceneScore?: number;
  prevSceneTimeSpentMillis?: number;
}) => {
  if (data?.prevScene) {
    miniGamesPlayedInSession.push(data?.prevScene);
  }
  if (miniGamesPlayedInSession.includes(FLY_FIT_SCENE)) {
    roomAccess.set(waterRoomLockKey.toString(), false);
  }
};
