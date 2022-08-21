import React, { useContext, useEffect } from "react";
import { AvatarCtx, MiniGameCtx } from "index";
import { MGLSmallLogo } from "Logos";
import { InfoCircleFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { mainBgColor, mainFontColor } from "../../GlobalStyles";
import { Popover } from "antd";
import { MiniGameInstructions } from "./MiniGamesInstructions";
import { UserProgressModalWithIcon } from "components/user-progrees";
import { useMoralis } from "react-moralis";
import { SelectWebcamModalWithIcon } from "components/Webcam/select-webcam-modal";
import { MintRewardModalWithIcon } from "components/Rewards/mint-reward-modal";

const miniGameInstructions = (minigame: string) => {
  const i = MiniGameInstructions.get(minigame);
  return (
    <>
      <Popover
        style={{
          textAlign: "center",
          color: mainFontColor,
        }}
        placement="topRight"
        title={i?.title}
        content={i?.content}
        trigger="click"
      >
        <div
          id={"howto-menu-ico"}
          style={{
            textAlign: "center",
            cursor: "pointer",
            color: mainFontColor,
          }}
        >
          <InfoCircleFilled
            style={{
              fontSize: "20px",
              color: mainFontColor,
            }}
          />
        </div>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          how to
        </div>
      </Popover>
    </>
  );
};

const SideMenu = () => {
  const { minigame } = useContext(MiniGameCtx);
  const { user } = useMoralis();
  const [avatar] = useContext(AvatarCtx);

  useEffect(() => {
    const refreshUser = async () => {
      await user?.fetch();
    };
    refreshUser();
    const howToIco = document.getElementById("howto-menu-ico");
    if (howToIco && howToIco.click) {
      howToIco.click();
    }
  }, []);

  return (
    <div
      style={{
        width: "60px",
        padding: "1rem",
        height: "100%",
        position: "fixed",
        left: "0",
        top: "0",
        backgroundColor: mainBgColor,
      }}
    >
      <div
        style={{
          width: "inherit",
          marginLeft: "-9px",
          marginBottom: "1rem",
        }}
      >
        {/* home */}
        <Link to="/">
          <MGLSmallLogo width={43} height={23} viewBox={"0 0 53 43"} />
        </Link>
      </div>

      {/* settings */}
      <SelectWebcamModalWithIcon />
      {/* user progress */}
      <UserProgressModalWithIcon user={user} avatar={avatar} />
      {/* rewards */}
      <MintRewardModalWithIcon user={user} avatar={avatar} />
      {/* instructions */}
      <div
        style={{
          marginTop: "2rem",
        }}
      >
        {miniGameInstructions(minigame)}
      </div>
    </div>
  );
};

export default SideMenu;
