import { StockOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import Moralis from "moralis/types";
import { UserProgress } from "./user-progress";

export { openUserProgressModal };

const openUserProgressModal = ({
  user,
}: {
  user: Moralis.User<Moralis.Attributes> | null;
}) => {
  Modal.info({
    title: (
      <>
        Your progress <StockOutlined />
      </>
    ),
    centered: true,
    style: {
      height: "100vh",
      width: "100vw",
      margin: 0,
      top: 0,
    },
    bodyStyle: {
      textAlign: "center",
      height: "calc(100vh - 110px)",
    },
    okText: "close",
    content: <UserProgress user={user} />,
  });
};
