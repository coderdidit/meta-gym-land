import { DollarOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { mainFontColor, pageTitle2Style } from "GlobalStyles";
import Moralis from "moralis/types";
import { useState } from "react";
import { MintReward } from "./mint-reward";

export { MintRewardModalWithIcon };

const MintRewardModalWithIcon = ({
  user,
  avatar,
}: {
  user: Moralis.User<Moralis.Attributes> | null;
  avatar: any;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
          cursor: "pointer",
          color: mainFontColor,
        }}
        onClick={() => setVisible(true)}
      >
        <DollarOutlined
          style={{
            fontSize: "20px",
            color: mainFontColor,
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        rewards
      </div>
      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              ...pageTitle2Style,
              color: mainFontColor,
            }}
          >
            <h3>
              Rewards <DollarOutlined />
            </h3>
          </div>
        }
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1100}
      >
        <MintReward user={user} avatar={avatar} />
      </Modal>
    </>
  );
};
