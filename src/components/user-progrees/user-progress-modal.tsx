import { StockOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { pageTitle2Style, mainFontColor } from "GlobalStyles";
import { useState } from "react";
import { UserProgress } from "./user-progress";
import { createMockUser } from "../../types/user";

export { UserProgressModalWithIcon };

const UserProgressModalWithIcon = ({ avatar }: { avatar: any }) => {
  const [visible, setVisible] = useState(false);
  // Use mock user instead of Moralis user
  const user = createMockUser();

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
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        level
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
        <UserProgress user={user} avatar={avatar} />
      </Modal>
    </>
  );
};
