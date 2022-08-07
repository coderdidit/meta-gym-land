import Phaser from "phaser";
import { SpaceStretchScene } from "./minigames/SpaceStretchScene";
import { FlyFitScene } from "./minigames/FlyFitScene";
import { ChartSquats } from "./minigames/ChartSquats";
import { BootScene } from "./gym-room-boot/BootScene";
import { MatrixScene } from "./minigames/MatrixScene";
import { RushScene } from "./minigames/RushScene";
import { InvadersScene } from "./minigames/invaders/InvadersScene";
import { RunnerScene } from "./minigames/runner/RunnerScene";
import { RunnerPreloadScene } from "./minigames/runner/RunnerPreloadScene";
import {
  GymManMazePreloadScene,
  GymManMazeScene,
} from "./minigames/gym-man-maze";

import { GymRoomScene } from "./gym-room/GymRoomScene";

import Moralis from "moralis/types";

export { getGameConfig, preBoot };

const getGameConfig = () => {
  const [width, height] = setWidthAndHeight();
  const Scenes = [
    BootScene,
    GymRoomScene,
    SpaceStretchScene,
    FlyFitScene,
    ChartSquats,
    MatrixScene,
    RushScene,
    InvadersScene,
    RunnerPreloadScene,
    RunnerScene,
    GymManMazePreloadScene,
    GymManMazeScene,
  ];

  return {
    type: Phaser.AUTO,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: true,
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
  user: Moralis.User<Moralis.Attributes> | null;
};
const preBoot = (params: preBootParams) => {
  const { game, avatar, setMinigame, pickedMiniGame, user } = params;
  game.registry.merge({
    avatar,
    setMinigame,
    pickedMiniGame,
    user,
  });
};
