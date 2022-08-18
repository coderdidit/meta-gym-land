import { descriptionStyle, pageTitleStyle } from "GlobalStyles";
import React, { useContext, useEffect } from "react";
import { StockOutlined } from "@ant-design/icons";
import { UserProgress } from "./user-progress";
import { useMoralis } from "react-moralis";
import { AvatarCtx } from "index";

export { ProgressPage };

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

const ProgressPage: React.FC = () => {
  const { user } = useMoralis();
  const [avatar] = useContext(AvatarCtx);

  useEffect(() => {
    const refreshUser = async () => {
      await user?.fetch();
    };
    refreshUser();
  }, []);

  return (
    <PageWithTitle
      title={
        <>
          Your progress <StockOutlined />
        </>
      }
    >
      <UserProgress user={user} avatar={avatar} />
    </PageWithTitle>
  );
};
