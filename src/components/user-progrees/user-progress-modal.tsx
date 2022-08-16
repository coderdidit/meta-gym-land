import { StockOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { pageTitle2Style, mainFontColor } from "GlobalStyles";
import Moralis from "moralis/types";
import { useState } from "react";
import { UserProgress } from "./user-progress";

export { UserProgressModalWithIcon };

const UserProgressModalWithIcon = ({
  user,
}: {
  user: Moralis.User<Moralis.Attributes> | null;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
          cursor: "pointer",
          fontSize: "20px",
          color: mainFontColor,
        }}
        onClick={() => setVisible(true)}
      >
        <StockOutlined />
      </div>
      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              ...pageTitle2Style,
            }}
          >
            <h3>
              Your progress <StockOutlined />
            </h3>
          </div>
        }
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1100}
      >
        <UserProgress user={user} />
      </Modal>
    </>
  );
};
