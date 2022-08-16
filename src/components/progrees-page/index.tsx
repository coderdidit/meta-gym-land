import { descriptionStyle, pageTitleStyle } from "GlobalStyles";
import { Steps } from "antd";
import React from "react";
import { StockOutlined } from "@ant-design/icons";

export { ProgressPage };

const { Step } = Steps;
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
      }}
    >
      {children}
    </div>
  );
};
type FlexCenterDivPropsWithTitle = {
  title: string | JSX.Element;
  children: JSX.Element;
};
const PageWithTitle: React.FC<FlexCenterDivPropsWithTitle> = ({
  title,
  children,
}) => {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "3rem",
        marginBottom: "15rem",
      }}
    >
      <section
        style={{
          ...pageTitleStyle,
          marginBottom: "1rem",
        }}
      >
        {title}
      </section>
      <section
        style={{
          ...descriptionStyle,
          padding: "0 5rem",
          textAlign: "center",
        }}
      >
        {children}
      </section>
    </div>
  );
};

const ProgressPage: React.FC = ({
  currentLevel,
  currentXP,
}: {
  currentLevel?: number;
  currentXP?: number;
}) => {
  const _currentLevel = currentLevel ?? 0;
  const _currentXP = currentXP ?? 0;
  return (
    <PageWithTitle
      title={
        <>
          Your progress <StockOutlined />
        </>
      }
    >
      <div>
        <div
          style={{
            textAlign: "left",
            padding: "2rem 0",
          }}
        >
          <p>
            Current $XP : <b>{_currentXP}</b>
          </p>
        </div>
        <Steps current={_currentLevel}>
          <Step title="Trial" />
          <Step title="Beginner" />
          <Step title="Athlete" />
          <Step title="Senior Athlete" />
          <Step title="Mystery Solver" />
        </Steps>
        <br />
        <FlexCenteredDiv>
          <div>
            <Steps progressDot current={_currentLevel} direction="vertical">
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
    </PageWithTitle>
  );
};
