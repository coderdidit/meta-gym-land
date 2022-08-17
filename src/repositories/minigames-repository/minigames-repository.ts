import { CHART_SQUATS } from "@games/index";
import { INVADERS } from "@games/index";
import { RACE_TRACK } from "@games/index";
import { MATRIX } from "@games/index";
import { RUNNER } from "@games/index";
import { GYM_SWAMPS_ACTUAL } from "@games/index";
import { FLY_FIT_SCENE } from "@games/index";
import { SPACE_STRETCH_SCENE } from "@games/index";

/**
 * TODO: put to Supabase or Firebase
 */
export { minigamesRepository };

const minigamesRepository = () => {
  return { nameToId, IdToName };
};

const _nameToId = new Map<string, number>([
  [SPACE_STRETCH_SCENE, 0],
  [FLY_FIT_SCENE, 1],
  [CHART_SQUATS, 2],
  [GYM_SWAMPS_ACTUAL, 3],
  [INVADERS, 4],
  [RUNNER, 5],
  [RACE_TRACK, 6],
  [MATRIX, 7],
]);

const nameToId = (name: string): number => {
  const id = _nameToId.get(name);
  if (!id) {
    throw Error(`[bad minigames repo settings]: ${name}`);
  }
  return id;
};

const IdToName = new Map<number, string>([
  [0, SPACE_STRETCH_SCENE],
  [1, FLY_FIT_SCENE],
  [2, CHART_SQUATS],
  [3, GYM_SWAMPS_ACTUAL],
  [4, INVADERS],
  [5, RUNNER],
  [6, RACE_TRACK],
  [7, MATRIX],
]);
