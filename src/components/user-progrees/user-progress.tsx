import React from "react";
import Moralis from "moralis/types";
import { Steps } from "antd";
import { descriptionStyle } from "GlobalStyles";
const { Step } = Steps;

export { UserProgress };

const UserProgress: React.FC<{
  user: Moralis.User<Moralis.Attributes> | null;
}> = ({ user }: { user: Moralis.User<Moralis.Attributes> | null }) => {
  const currentLevel = 0;
  const xpColName = "mbmtBalance";
  const moralisUser = user as Moralis.User<Moralis.Attributes> | null;
  const rawXP =
    moralisUser && moralisUser.get && moralisUser.get(xpColName)
      ? moralisUser.get(xpColName)
      : 0;
  const currentXP = rawXP.toFixed(4);

  return (
    <div>
      <div
        style={{
          textAlign: "left",
          padding: "2rem 0",
          ...descriptionStyle,
        }}
      >
        <p>
          Current $XP : <b>{currentXP}</b>
        </p>
      </div>
      <Steps current={currentLevel}>
        <Step title="Trial" />
        <Step title="Beginner" />
        <Step title="Athlete" />
        <Step title="Senior Athlete" />
        <Step title="Mystery Solver" />
      </Steps>
      <br />
      <FlexCenteredDiv>
        <div>
          <Steps progressDot current={currentLevel} direction="vertical">
            <Step
              title="Trial"
              description={
                <>
                  <p>Enter the MetaGymLand with Demo GymBuddy</p>
                  <p>To progress from Trial you need to mint GymBuddy NFT</p>
                </>
              }
            />
            <Step
              title="Beginner"
              description={
                <div>
                  <h4>How to enter</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Mint GymBuddy NFT</li>
                  </ul>
                  <h4>How to complete</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Complete all Minigames in the Beginner Room</li>
                  </ul>
                  <h4>Current progress</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Minigames Completed: 0</li>
                  </ul>
                  <h4>Rewards</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Beginner NFT Badge</li>
                    <li>Access to Athlete Room</li>
                  </ul>
                </div>
              }
            />
            <Step
              title="Athlete"
              description={
                <div>
                  <h4>How to enter</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Earn Beginner NFT Badge</li>
                  </ul>
                  <h4>How to complete</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Complete all Minigames in the Athlete Room</li>
                  </ul>
                  <h4>Current progress</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Minigames Completed: 0</li>
                  </ul>
                  <h4>Rewards</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Athlete NFT Badge</li>
                    <li>Access to Senior Athlete Room</li>
                  </ul>
                </div>
              }
            />
            <Step
              title="Senior Athlete"
              description={
                <div>
                  <h4>How to enter</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Earn Athlete NFT Badge</li>
                  </ul>
                  <h4>How to complete</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Complete all Minigames in the Senior Athlete Room</li>
                  </ul>
                  <h4>Current progress</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Minigames Completed: 0</li>
                  </ul>
                  <h4>Rewards</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Senior Athlete NFT Badge</li>
                    <li>Access to Mystery Solver Room</li>
                  </ul>
                </div>
              }
            />
            <Step
              title="Mystery Solver"
              description={
                <div>
                  <h4>How to enter</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Earn Senior Athlete NFT Badge</li>
                  </ul>
                  <h4>How to complete</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Find Mystery Mat</li>
                  </ul>
                  <h4>Current progress in Mystery Solver Room</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Minigames Completed: 0</li>
                  </ul>
                  <h4>Rewards</h4>
                  <ul style={{ listStyle: "none" }}>
                    <li>Mystery Solver NFT Badge</li>
                  </ul>
                </div>
              }
            />
          </Steps>
        </div>
      </FlexCenteredDiv>
    </div>
  );
};

type FlexCenterDivProps = {
  children: JSX.Element;
};
const FlexCenteredDiv: React.FC<FlexCenterDivProps> = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        padding: "0 5rem",
        alignItems: "center",
        ...descriptionStyle,
      }}
    >
      {children}
    </div>
  );
};
