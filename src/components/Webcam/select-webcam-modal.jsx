import pageStyles from "./select-webcam-modal.styles.module.css";
import { SettingFilled } from "@ant-design/icons";
import { Modal } from "antd";

import { useState } from "react";
import { SelectWebcam } from "./SelectWebcam";

export { SelectWebcamModalWithIcon };

const SelectWebcamModalWithIcon = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <div className={pageStyles.trigger} onClick={() => setVisible(true)}>
        <SettingFilled className={pageStyles.settingsIcon} />
      </div>
      <Modal
        title={
          <div className={pageStyles.title}>
            <h4>
              Select webcam <SettingFilled />
            </h4>
          </div>
        }
        centered
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <div className={pageStyles.selector}>
          <SelectWebcam width={"15rem"} />
        </div>
      </Modal>
    </>
  );
};
