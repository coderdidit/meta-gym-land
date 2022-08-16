import { descriptionStyle, pageTitleStyle } from "GlobalStyles";
import { Divider, Steps } from "antd";
import React from "react";

export { ProgressPage };

const { Step } = Steps;

const ProgressPage: React.FC = () => {
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
        Your progress
      </section>
      <section
        style={{
          ...descriptionStyle,
          marginBottom: "15rem",
          padding: "0 5rem",
          textAlign: "center",
        }}
      >
        <Steps progressDot current={1}>
          <Step title="Finished" description="This is a description." />
          <Step title="In Progress" description="This is a description." />
          <Step title="Waiting" description="This is a description." />
        </Steps>
        <Divider
          style={{
            marginBottom: "2rem",
            marginTop: "2rem",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0 5rem",
            alignItems: "center",
          }}
        >
          <div>
            <Steps progressDot current={1} direction="vertical">
              <Step
                title="Finished"
                description="This is a description. This is a description."
              />
              <Step
                title="Finished"
                description="This is a description. This is a description."
              />
              <Step
                title="In Progress"
                description="This is a description. This is a description."
              />
              <Step title="Waiting" description="This is a description." />
              <Step title="Waiting" description="This is a description." />
            </Steps>
          </div>
        </div>
      </section>
    </div>
  );
};
