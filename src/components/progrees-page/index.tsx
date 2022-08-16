import { descriptionStyle, pageTitleStyle } from "GlobalStyles";
import { Steps } from "antd";
import React from "react";

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
        flexFlow: "wrap",
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
  title: string;
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
        marginBottom: "4rem",
      }}
    >
      <section
        style={{
          ...pageTitleStyle,
          marginBottom: "2rem",
        }}
      >
        {title}
      </section>
      <section
        style={{
          ...descriptionStyle,
          marginBottom: "15rem",
          padding: "0 5rem",
          textAlign: "center",
        }}
      >
        {children}
      </section>
    </div>
  );
};

const ProgressPage: React.FC = () => {
  return (
    <PageWithTitle title="Your progress">
      <FlexCenteredDiv>
        <div>
          <Steps progressDot current={0} direction="vertical">
            <Step
              title="Beginner"
              description="This is a description. This is a description."
            />
            <Step
              title="Athlete"
              description="This is a description. This is a description."
            />
            <Step
              title="Senior Athlete"
              description="This is a description. This is a description."
            />
            <Step title="Mystery Solver" description="This is a description." />
          </Steps>
        </div>
      </FlexCenteredDiv>
    </PageWithTitle>
  );
};
