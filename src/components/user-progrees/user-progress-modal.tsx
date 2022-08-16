import { StockOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { UserProgress } from "./user-progress";

export { openUserProgressModal };

const openUserProgressModal = () => {
  Modal.info({
    title: (
      <>
        Your progress <StockOutlined />
      </>
    ),
    centered: true,
    bodyStyle: {
      textAlign: "center",
    },
    okText: "close",
    content: <UserProgress />,
  });
};
