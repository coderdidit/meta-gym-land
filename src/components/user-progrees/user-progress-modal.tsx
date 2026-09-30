import pageStyles from "./user-progress-modal.styles.module.css";
import { StockOutlined } from "@ant-design/icons";
import { Modal } from "antd";

import { useState } from "react";
import { UserProgress } from "./user-progress";
import { createMockUser } from "../../types/user";

export { UserProgressModalWithIcon };
const StockOutlinedIcon = StockOutlined as any;

const UserProgressModalWithIcon = ({ avatar }: { avatar: any }) => {
  const [visible, setVisible] = useState(false);
  // Use mock user instead of Moralis user
  const user = createMockUser();

  return (
    <>
      <div className={pageStyles.trigger} onClick={() => setVisible(true)}>
        <StockOutlinedIcon />
      </div>
      <div className={pageStyles.label}>level</div>
      <Modal
        title={
          <div className={pageStyles.title}>
            <h3>
              Your progress <StockOutlinedIcon />
            </h3>
          </div>
        }
        centered
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1100}
      >
        <UserProgress user={user} avatar={avatar} />
      </Modal>
    </>
  );
};
