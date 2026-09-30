import pageStyles from "./SnapArBtn.styles.module.css";
import { SnapChatLogo } from "../Logos";
import QRCode from "qrcode";

const SnapArBtn = ({ snapARLink }) => {
  const link = typeof snapARLink === "string" ? snapARLink.trim() : "";

  return (
    <div
      className={["snap-btn", pageStyles.snapButton].filter(Boolean).join(" ")}
      onClick={async () => {
        if (!link) {
          window.alert("Your GymBuddy does not have a Snap Lens.");
          return;
        }

        try {
          const qrCodeData = await QRCode.toDataURL(link);
          const popup = window.open("", "_blank", "width=420,height=520");
          if (!popup) {
            window.alert("Popup blocked. Please allow popups and try again.");
            return;
          }
          popup.document.write(`
            <html>
              <head><title>Try me in Snapchat</title></head>
              <body style="font-family:Arial,sans-serif;text-align:center;padding:16px;">
                <h3>Try me in Snapchat</h3>
                <p>Grab your phone and scan the QR code</p>
                <img alt="Snapchat QR code" src="${qrCodeData}" style="max-width:100%;height:auto;" />
              </body>
            </html>
          `);
          popup.document.close();
        } catch (_error) {
          window.alert(
            "Could not generate QR code for this Snap Lens link. Please try again later.",
          );
        }
      }}
    >
      <SnapChatLogo width={24} height={24} />
    </div>
  );
};

export default SnapArBtn;
