import { Modal } from "antd";

export { commingSoonModal };

const commingSoonModal = (title: string) => {
  Modal.info({
    title: "Comming soon",
    centered: true,
    bodyStyle: {
      textAlign: "center",
    },
    okText: "close",
    content: (
      <div
        style={{
          textAlign: "center",
        }}
      >
        <div>
          <p>
            <b>{title}</b> minigame is in development
          </p>
          <p>Stay tuned :)</p>
        </div>
      </div>
    ),
  });
};
