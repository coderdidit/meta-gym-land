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
    bodyStyle: {
      textAlign: "center",
    },
    okText: "close",
    content: <UserProgress user={user} />,
  });
};
