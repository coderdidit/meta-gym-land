import { Button, Modal } from "antd";
import Loader from "components/Loader";
import { BtnPrimary, descriptionStyle } from "GlobalStyles";
import { GymBuddyMagesContract, MainChainID } from "MglNftMetadata";
import Moralis from "moralis/types";
import { useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { userRepository, levelsRepository } from "repositories";

export { MintReward };

const MintReward: React.FC<{
  user: Moralis.User<Moralis.Attributes> | null;
  avatar: any;
}> = ({
  user,
  avatar,
}: {
  user: Moralis.User<Moralis.Attributes> | null;
  avatar: any;
}) => {
  const userRepo = userRepository({ moralisUser: user, avatar });
  const levelsRepo = levelsRepository();
  const userStats = userRepo.getStats();

  const currentLevel = userStats?.level ?? 0;
  const currentXP = userStats?.xp ?? 0;

  if (currentLevel >= 4 && currentXP > 10) {
    return (
      <div
        style={{
          ...descriptionStyle,
          textAlign: "center",
        }}
      >
        <h4>Congrats!</h4>
        <p>
          Your level is <b>{levelsRepo.idToName(currentLevel)}</b>
        </p>
        <p>
          Your xp is <b>{currentXP}</b>
        </p>
        <br />
        <MintBtn />
      </div>
    );
  }

  return (
    <div
      style={{
        ...descriptionStyle,
        textAlign: "center",
      }}
    >
      <p>
        Your Level is <b>{levelsRepo.idToName(currentLevel)}</b>
      </p>
      <p>
        Your XP is <b>{currentXP}</b>
      </p>
      <br />
      <h3>To be eligible for rewards&nbsp;👇</h3>
      <br />
      <ul
        style={{
          padding: "1rem",
        }}
      >
        <li>You need to try all Training Mats in MetaGymLand</li>
        <li>
          be at Level <b>{levelsRepo.mysterySolver}</b>
        </li>
        <li>
          And have XP greater then <b>10</b>
        </li>
      </ul>
    </div>
  );
};

const mintPrice = 0.001;

const MintBtn = () => {
  const { chainId, isAuthenticated, Moralis } = useMoralis();
  const [loading, setLoading] = useState(false);
  const [minted, setMinted] = useState(false);
  const userChainId = chainId;
  const contractProcessor = useWeb3ExecuteFunction();
  const mintContractAddress = GymBuddyMagesContract;

  const handleMintClick = async () => {
    if (!isAuthenticated) {
      alert(`
            You need to connect your wallet\n
            to be able to buy NFTs
            `);
      return;
    } else if (userChainId !== MainChainID) {
      alert(`
            Please switch to\n
            Polygon Mumbai testnet\n
            to be able to buy NFTs
            `);
      return;
    }
    setLoading(true);
    const ops = {
      contractAddress: mintContractAddress,
      functionName: "requestNft",
      abi: [
        {
          inputs: [],
          name: "requestNft",
          outputs: [
            {
              internalType: "uint256",
              name: "requestId",
              type: "uint256",
            },
          ],
          stateMutability: "payable",
          type: "function",
        },
      ],
      msgValue: Moralis.Units.ETH(mintPrice),
    };
    await contractProcessor.fetch({
      params: ops,
      onSuccess: async () => {
        setLoading(false);
        setMinted(true);
        Modal.success({
          title: "Success",
          content: (
            <div>
              <p>You minted your GymBuddy Mage&nbsp;🎉</p>
              <br />
              <p>Check your GymBuddies tab</p>
              <p>you will get either</p>
              <p>A Gold or Silver GymBuddy Mage</p>
              <p>Bear in mind it may take a few minutes</p>
              <p>until your newly minted reward appear</p>
            </div>
          ),
        });
      },
      onError: (error) => {
        console.error(error);
        setLoading(false);
        Modal.error({
          title: "Oops, something went worng",
          content: <div>{error.message}</div>,
        });
      },
    });
  };

  if (loading) {
    return <Loader />;
  } else if (minted) {
    return null;
  } else {
    return (
      <Button
        type="primary"
        style={{
          ...BtnPrimary,
        }}
        onClick={handleMintClick}
      >
        Mint you reward
      </Button>
    );
  }
};
