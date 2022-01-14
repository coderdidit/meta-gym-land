import { AllowedNftContracts } from "../../MglNftMetadata";

const AvaxTestnetChainID = "0xa869";
// const RinkebyTestnet = "0x4";

export const networkCollections = new Map([
  [AvaxTestnetChainID, [ // Avalanche Testnet
    {
      image: "https://ipfs.moralis.io:2053/ipfs/QmVF53rCjFiFSXyJd64NgeGioQG93gegdsymyMWtJLG9Ev/cover.gif",
      name: "Moralis Avalanche Hackaton 2021 Test Drop",
      addrs: AllowedNftContracts.get(AvaxTestnetChainID),
    },
  ]],
  // [RinkebyTestnet, [ // rinkeby
  //   {
  //     image: "https://ipfs.moralis.io:2053/ipfs/QmVF53rCjFiFSXyJd64NgeGioQG93gegdsymyMWtJLG9Ev/cover.gif",
  //     name: "Moralis Avalanche Hackaton 2021 Test Drop",
  //     addrs: AllowedNftContracts.get(RinkebyTestnet),
  //   },
  // ]]
]);

export const getCollectionsByChain = (chain) => networkCollections.get(chain);
