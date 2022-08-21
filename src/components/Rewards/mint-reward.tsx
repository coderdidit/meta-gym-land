import { Button } from "antd";
import { BtnPrimary, descriptionStyle } from "GlobalStyles";
import Moralis from "moralis/types";
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
        <p>Your level is {levelsRepo.idToName(currentLevel)}</p>
        <p>Your xp is {currentXP}</p>
        <br />

        <Button
          type="primary"
          style={{
            ...BtnPrimary,
          }}
          onClick={() => alert("Comming soon!")}
        >
          click to mint you reward
        </Button>
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
