import { StockOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { mainFontColor } from "GlobalStyles";
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
          fontSize: "20px",
          cursor: "pointer",
          color: mainFontColor,
        }}
        onClick={() => setVisible(true)}
      >
        <StockOutlined />
      </div>
      <Modal
        title={
          <>
            Your progress <StockOutlined />
          </>
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
