/**
 * TODO: put to Supabase or Firebase
 */
export { levelsRepository };

const levelsRepository = () => {
  return { nameToId, IdToName };
};

const trial = "Trial";
const beginner = "Beginner";
const athlete = "Athlete";
const seniorAthlete = "Senior Athlete";
const mysterySolver = "Mystery Solver";

const nameToId = new Map<string, number>([
  [trial, 0],
  [beginner, 1],
  [athlete, 2],
  [seniorAthlete, 3],
  [mysterySolver, 4],
]);

const IdToName = new Map<number, string>([
  [0, trial],
  [1, beginner],
  [2, athlete],
  [3, seniorAthlete],
  [4, mysterySolver],
]);
