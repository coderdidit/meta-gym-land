/**
 * TODO: put to Supabase or Firebase
 */
export { levelsRepository };

const levelsRepository = () => {
  return {
    nameToId,
    IdToName,
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

const IdToName = new Map<number, string>([
  [0, trial],
  [1, beginner],
  [2, athlete],
  [3, seniorAthlete],
  [4, mysterySolver],
]);
