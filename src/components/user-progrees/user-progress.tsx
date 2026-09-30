import pageStyles from "./user-progress.styles.module.css";
import React from "react";
import { Steps } from "antd";

import { userRepository } from "repositories";
import { SimpleUser } from "../../types/user";

export { UserProgress };

const UserProgress: React.FC<{
  user: SimpleUser | null;
  avatar: any;
}> = ({ user, avatar }: { user: SimpleUser | null; avatar: any }) => {
  const userRepo = userRepository({ moralisUser: user, avatar });
  const userStats = userRepo.getStats();

  const currentLevel = userStats?.level ?? 0;
  const currentXP = userStats?.xp ?? 0;
  const completedMinigamesCount = userStats?.completedMinigamesCount ?? 0;
  const fromattedTimeSpentInMinigames =
    userStats?.fromattedTimeSpentInMinigames ?? "";
  const levelItems = [
    { title: "Trial" },
    { title: "Beginner" },
    { title: "Athlete" },
    { title: "Senior Athlete" },
    { title: "Mystery Solver" },
  ];
  const progressItems = [
    {
      title: "Trial",
      description: (
        <>
          <p>Enter the MetaGymLand with Demo GymBuddy</p>
          <p>To progress from Trial you need to mint GymBuddy NFT</p>
        </>
      ),
    },
    {
      title: "Beginner",
      description: (
        <div>
          <h4>How to enter</h4>
          <ul className={pageStyles.stats}>
            <li>Mint GymBuddy NFT</li>
          </ul>
          <h4>How to complete</h4>
          <ul className={pageStyles.stats}>
            <li>Complete all Minigames in the Beginner Room</li>
          </ul>
          <h4>Rewards</h4>
          <ul className={pageStyles.stats}>
            <li>Access to Athlete Room</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Athlete",
      description: (
        <div>
          <h4>How to enter</h4>
          <ul className={pageStyles.stats}>
            <li>Complete all Minigames in the Beginner Room</li>
          </ul>
          <h4>How to complete</h4>
          <ul className={pageStyles.stats}>
            <li>Complete all Minigames in the Athlete Room</li>
          </ul>
          <h4>Rewards</h4>
          <ul className={pageStyles.stats}>
            <li>Access to Senior Athlete Room</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Senior Athlete",
      description: (
        <div>
          <h4>How to enter</h4>
          <ul className={pageStyles.stats}>
            <li>Complete all Minigames in the Athlete Room</li>
          </ul>
          <h4>How to complete</h4>
          <ul className={pageStyles.stats}>
            <li>Complete all Minigames in the Senior Athlete Room</li>
          </ul>
          <h4>Rewards</h4>
          <ul className={pageStyles.stats}>
            <li>Access to Mystery Solver Room</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Mystery Solver",
      description: (
        <div>
          <h4>How to enter</h4>
          <ul className={pageStyles.stats}>
            <li>Complete all Minigames in the Senior Athlete Room</li>
          </ul>
          <h4>How to complete</h4>
          <ul className={pageStyles.stats}>
            <li>Find Mystery Mat</li>
          </ul>
          <h4>Rewards</h4>
          <ul className={pageStyles.stats}>
            <li>Find out</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className={pageStyles.progress}>
        <p>
          Current $XP&nbsp;:&nbsp;<b>{currentXP.toFixed(4)}</b>
        </p>
        <p>
          Total minigames completed&nbsp;:&nbsp;
          <b>{completedMinigamesCount}</b>
        </p>
        <p>
          Time spent in minigames&nbsp;:&nbsp;
          <b>{fromattedTimeSpentInMinigames}</b>
        </p>
      </div>
      <Steps current={currentLevel} items={levelItems} />
      <br />
      <FlexCenteredDiv>
        <div>
          <Steps
            progressDot
            current={currentLevel}
            direction="vertical"
            items={progressItems}
          />
        </div>
      </FlexCenteredDiv>
    </div>
  );
};

type FlexCenterDivProps = {
  children: React.ReactNode;
};
const FlexCenteredDiv: React.FC<FlexCenterDivProps> = ({ children }) => {
  return <div className={pageStyles.centered}>{children}</div>;
};
