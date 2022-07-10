export const TestGymBuddiesContract =
  "0xaf442b8249278126cc04038079a43f1721f48e1e";
export const TestGymBuddiesWithSnapLensContract =
  "0xaf442b8249278126cc04038079a43f1721f48e1e";
export const AvaxMoralis2021HackatonNfts =
  "0xbba97ea3912c598a39ce0802d5cd67dd3d873457";
export const DemoNFT = "0x55bccbaf3d0cfd33b634c9c0df09ba2c14cc7c2a";
export const AllowedNftContracts = new Map([
  [
    "0xa869", // AVAX fuji testnet
    [TestGymBuddiesContract, TestGymBuddiesWithSnapLensContract],
  ],
]);

export const DemoNFTContracts = new Map([
  [
    "0xa869", // AVAX fuji testnet
    DemoNFT,
  ],
]);

export const MainChainID = "0xa869"; // AVAX fuji testnet
