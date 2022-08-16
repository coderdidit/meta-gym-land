import React, { useContext, useEffect } from "react";
import { MiniGameCtx } from "index";
import { MGLSmallLogo } from "Logos";
import { SettingFilled, InfoCircleFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { mainBgColor, mainFontColor } from "../../GlobalStyles";
import { Popover } from "antd";
import { MiniGameInstructions } from "./MiniGamesInstructions";
import { StockOutlined } from "@ant-design/icons";
import { openUserProgressModal } from "components/user-progrees";
import { useMoralis } from "react-moralis";

const SideMenu = () => {
  const { minigame } = useContext(MiniGameCtx);
  const { user } = useMoralis();

  useEffect(() => {
    const howToIco = document.getElementById("howto-menu-ico");
    if (howToIco && howToIco.click) {
      howToIco.click();
    }
  }, []);

  const miniGameInstructions = () => {
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
            how to
          </div>
        </Popover>
      </>
    );
  };

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
      <div
        style={{
          textAlign: "center",
        }}
      >
        {/* settings */}
        <Link to="/play-setup">
          <SettingFilled
            style={{
              fontSize: "22px",
              color: mainFontColor,
            }}
          />
        </Link>
      </div>
      {/* user progress */}
      <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
          fontSize: "20px",
          cursor: "pointer",
          color: mainFontColor,
        }}
        onClick={() =>
          openUserProgressModal({
            user,
          })
        }
      >
        <StockOutlined />
      </div>
      {/* instructions */}
      <div
        style={{
          marginTop: "2rem",
        }}
      >
        {miniGameInstructions()}
      </div>
    </div>
  );
};

export default SideMenu;
