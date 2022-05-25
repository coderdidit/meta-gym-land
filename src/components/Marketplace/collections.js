import gymBuddiesCollectionGif from "../assets/marketplace/gym_buddies_collection.gif";

const AvaxTestnetChainID = "0xa869";

const AvaxTestChainColelctions = [
  {
    image: gymBuddiesCollectionGif,
    name: "GymBuddies 2022 Test Drop",
    addrs: "0x31c9a4d361fD82C291486B18715e8eAB26D2Bef9",
  },
  {
    image: "https://ipfs.moralis.io:2053/ipfs/QmVF53rCjFiFSXyJd64NgeGioQG93gegdsymyMWtJLG9Ev/cover.gif",
    name: "Moralis Avalanche 2021 Hackaton Test Avatars",
    addrs: "0xbba97ea3912c598a39ce0802d5cd67dd3d873457",
  },
];

export const networkCollections = new Map([
  [AvaxTestnetChainID, AvaxTestChainColelctions]
]);

export const getCollectionsByChain = (chain) => networkCollections.get(chain);
