import { TestGymBuddiesContract } from "../../MglNftMetadata";

const AvaxTestnetChainID = "0xa869";
const PolygonTestnetChainID = "0x13881";

const AvaxTestChainCollections = [
  {
    name: "Initially Minted GymBuddies",
    addrs: TestGymBuddiesContract,
  },
];

const PolygonTestChainCollections = [
  {
    name: "Initially Minted GymBuddies",
    addrs: TestGymBuddiesContract,
  },
];

export const networkCollections = new Map([
  [AvaxTestnetChainID, AvaxTestChainCollections],
  [PolygonTestnetChainID, PolygonTestChainCollections],
]);

export const getCollectionsByChain = (chain) => networkCollections.get(chain);
