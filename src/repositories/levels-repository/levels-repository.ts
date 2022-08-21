/**
 * TODO: put to Supabase or Firebase
 */
export { levelsRepository, Levels };

const levelsRepository = () => {
  return {
    nameToId,
    idToName,
    trial,
    beginner,
    athlete,
    seniorAthlete,
    mysterySolver,
  };
};

const trial = "Trial";
const beginner = "Beginner";
const athlete = "Athlete";
const seniorAthlete = "Senior Athlete";
const mysterySolver = "Mystery Solver";

enum Levels {
  TRIAL = 0,
  BEGINNER = 1,
  ATHLETE = 2,
  SENIOR_ATHLETE = 3,
  MYSTERY_SOLVER = 4,
}

const _nameToId = new Map<string, number>([
  [trial, 0],
  [beginner, 1],
  [athlete, 2],
  [seniorAthlete, 3],
  [mysterySolver, 4],
]);

const nameToId = (name: string): number => {
  const levelId = _nameToId.get(name);
  if (!levelId) {
    throw Error(`[levels config error]: levelName: ${name}`);
  }
  return levelId;
};

const idToName = (id: number): string => {
  const levelName = _idToName.get(id);
  if (!levelName) {
    throw Error(`[levels config error]: id: ${id}`);
  }
  return levelName;
};

const _idToName = new Map<number, string>([
  [0, trial],
  [1, beginner],
  [2, athlete],
  [3, seniorAthlete],
  [4, mysterySolver],
]);
