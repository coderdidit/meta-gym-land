export const TestGymBuddiesContract = "0x0650c5faeaec2193f7d0744cf90993277f530b74";
export const AvaxMoralis2021HackatonNfts = "0xbba97ea3912c598a39ce0802d5cd67dd3d873457";
export const DemoNFT = "0xa27B2B17D60902C60397ae8D406Ec2B88c656e51";
export const AllowedNftContracts = new Map([
    ["0xa869", // AVAX fuji testnet
        [
            TestGymBuddiesContract,
            AvaxMoralis2021HackatonNfts,
            DemoNFT,
        ],
    ]
]);

export const DemoNFTContracts = new Map([
    ["0xa869", // AVAX fuji testnet
        DemoNFT
    ]
]);

export const MainChainID = "0xa869"; // AVAX fuji testnet
