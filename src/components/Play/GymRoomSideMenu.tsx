import pageStyles from "./GymRoomSideMenu.styles.module.css";
import React, { useContext, useEffect } from "react";
import { AvatarCtx, MiniGameCtx } from "index";
import { MGLSmallLogo } from "Logos";
import { InfoCircleFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { Popover } from "antd";
import { MiniGameInstructions } from "./MiniGamesInstructions";
import { UserProgressModalWithIcon } from "components/user-progrees";
import { SelectWebcamModalWithIcon } from "components/Webcam/select-webcam-modal";
import { createMockUser } from "../../types/user";

const InfoCircleFilledIcon = InfoCircleFilled as any;

const miniGameInstructions = (minigame: string) => {
  const i = MiniGameInstructions.get(minigame);
  return (
    <>
      <Popover
        className={pageStyles.instructions}
        placement="topRight"
        title={i?.title}
        content={i?.content}
        trigger="click"
      >
        <div id={"howto-menu-ico"} className={pageStyles.instructionsTrigger}>
          <InfoCircleFilledIcon className={pageStyles.instructionsIcon} />
        </div>
        <div className={pageStyles.instructionsLabel}>how to</div>
      </Popover>
    </>
  );
};

const SideMenu = () => {
  const { minigame } = useContext(MiniGameCtx);
  const [avatar] = useContext(AvatarCtx);
  // Use mock user instead of Moralis user
  const user = createMockUser();

  useEffect(() => {
    const howToIco = document.getElementById("howto-menu-ico");
    if (howToIco && howToIco.click) {
      howToIco.click();
    }
  }, []);

  return (
    <div className={pageStyles.sidebar}>
      <div className={pageStyles.brand}>
        {/* home */}
        <Link to="/">
          <MGLSmallLogo width={43} height={23} viewBox={"0 0 53 43"} />
        </Link>
      </div>

      {/* settings */}
      <SelectWebcamModalWithIcon />
      {/* user progress */}
      <UserProgressModalWithIcon avatar={avatar} />
      {/* instructions */}
      <div className={pageStyles.instructionsWrap}>
        {miniGameInstructions(minigame)}
      </div>
    </div>
  );
};

export default SideMenu;
