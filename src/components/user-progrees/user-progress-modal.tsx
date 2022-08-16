import { StockOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import Moralis from "moralis/types";
import { useState } from "react";
import { UserProgress } from "./user-progress";

export { UserProgressModal, useUserProgressModal };

const useUserProgressModal = () => {
  const [visible, setVisible] = useState(false);
  return {
    visible,
    open: () => setVisible(true),
    close: () => setVisible(false),
  };
};

const UserProgressModal = ({
  user,
  visible,
  open,
  close,
}: {
  user: Moralis.User<Moralis.Attributes> | null;
  visible: boolean;
  open: () => void;
  close: () => void;
}) => {
  return (
    <Modal
      title={
        <>
          Your progress <StockOutlined />
        </>
      }
      centered
      visible={visible}
      onOk={() => open()}
      onCancel={() => close()}
      width={1000}
    >
      <UserProgress user={user} />
    </Modal>
  );
};
