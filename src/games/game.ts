import { GYM_ROOM_SCENE } from "./index";
import { SimpleUser } from "../types/user";
import Phaser from "phaser";
import { BootScene } from "./gym-room-boot/BootScene";
import { GymRoomScene } from "./gym-room/GymRoomScene";
import { SpaceStretchScene } from "./minigames/SpaceStretchScene";
import { FlyFitScene } from "./minigames/FlyFitScene";
import { ChartSquats } from "./minigames/ChartSquats";
import { MatrixScene } from "./minigames/MatrixScene";
import { RaceTrackPreloadScene } from "./minigames/race-track/RaceTrackPreloadScene";
import { RaceTrack } from "./minigames/race-track/RaceTrackScene";
import { InvadersScene } from "./minigames/invaders/InvadersScene";
import { RunnerPreloadScene } from "./minigames/runner/RunnerPreloadScene";
import { RunnerScene } from "./minigames/runner/RunnerScene";
import { GymSwampsPreloadScene } from "./minigames/gym-swamps/GymSwampsPreloadScene";
import { GymSwampsScene } from "./minigames/gym-swamps/GymSwampsScene";

export interface Game {
  scene: string;
  user: SimpleUser | null;
}

export const createGame = (): Game => {
  return {
    scene: GYM_ROOM_SCENE,
    user: null,
  };
};

export const getGameConfig = () => {
  const [width, height] = setWidthAndHeight();
  const Scenes = [
    BootScene,
    GymRoomScene,
    SpaceStretchScene,
    FlyFitScene,
    ChartSquats,
    MatrixScene,
    RaceTrackPreloadScene,
    RaceTrack,
    InvadersScene,
    RunnerPreloadScene,
    RunnerScene,
    GymSwampsPreloadScene,
    GymSwampsScene,
  ];

  return {
    type: Phaser.AUTO,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        // debug: true,
      },
    },
    scale: {
      mode: Phaser.Scale.NONE,
      width,
      height,
    },
    scene: Scenes,
    pixelArt: true,
    fps: {
      target: 60,
    },
  } as Phaser.Types.Core.GameConfig;
};

const setWidthAndHeight = () => {
  const width = window.innerWidth;
  // let height = width / 1.778;
  let height = window.innerHeight;

  if (height > window.innerHeight) {
    height = window.innerHeight;
    // keeping for reference
    // width = height * 1.778;
  }
  return [width, height];
};

type preBootParams = {
  game: Phaser.Game;
  avatar: any;
  setMinigame: React.Dispatch<React.SetStateAction<string>>;
  pickedMiniGame: string | null;
  user: SimpleUser | null;
};

export const preBoot = (params: preBootParams) => {
  const { game, avatar, setMinigame, pickedMiniGame, user } = params;
  game.registry.merge({
    avatar,
    setMinigame,
    pickedMiniGame,
    user,
  });
};
