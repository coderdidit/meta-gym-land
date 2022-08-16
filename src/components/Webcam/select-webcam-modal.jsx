import { SettingFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { pageTitle2Style, mainFontColor } from "GlobalStyles";
import { useState } from "react";
import { SelectWebcam } from "./SelectWebcam";

export { SelectWebcamModalWithIcon };

const SelectWebcamModalWithIcon = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
          cursor: "pointer",
          color: mainFontColor,
        }}
        onClick={() => setVisible(true)}
      >
        <SettingFilled
          style={{
            fontSize: "22px",
            color: mainFontColor,
          }}
        />
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
            <h4>
              Select webcam <SettingFilled />
            </h4>
          </div>
        }
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "1rem",
            paddingBottom: "1rem",
            textAlign: "center",
          }}
        >
          <SelectWebcam width={"15rem"} />
        </div>
      </Modal>
    </>
  );
};
