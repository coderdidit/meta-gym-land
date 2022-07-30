import { Modal } from "antd";
import { SnapChatLogo } from "../../Logos";
import QRCode from "qrcode";

export { showSnapchatModal };

const showSnapchatModal = async (snapARLink: any) => {
  if (snapARLink === "") {
    Modal.info({
      title: "Mint GymBuddy with Snap",
      centered: true,
      bodyStyle: {
        textAlign: "center",
      },
      okText: "close",
      icon: <SnapChatLogo />,
      content: (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div>
            <p>Your GymBuddy does not have a Snap Lens :(</p>
            <p>Go mint one in our mint Page :)</p>
          </div>
        </div>
      ),
    });
  } else {
    const qrCodeData = await QRCode.toDataURL(snapARLink);
    Modal.info({
      title: "Try me in Snapchat",
      centered: true,
      bodyStyle: {
        textAlign: "center",
      },
      okText: "close",
      icon: <SnapChatLogo />,
      content: (
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div>
            <p>Grab your phone</p>
            <p>and scan the QR code</p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img src={qrCodeData} />
          </div>
        </div>
      ),
    });
  }
};
