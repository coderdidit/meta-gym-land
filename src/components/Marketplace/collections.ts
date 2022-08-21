import { GymBuddiesContract } from "../../MglNftMetadata";

const AvaxTestnetChainID = "0xa869";
const PolygonTestnetChainID = "0x13881";

const AvaxTestChainCollections = [
  {
    name: "Initially Minted GymBuddies",
    addrs: GymBuddiesContract,
  },
];

const PolygonTestChainCollections = [
  {
    name: "Initially Minted GymBuddies",
    addrs: GymBuddiesContract,
  },
];

export const networkCollections = new Map([
  [AvaxTestnetChainID, AvaxTestChainCollections],
  [PolygonTestnetChainID, PolygonTestChainCollections],
]);

export const getCollectionsByChain = (chain: string) =>
  networkCollections.get(chain);
