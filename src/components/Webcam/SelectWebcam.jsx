import React, { useState, useCallback, useEffect, useContext } from "react";
import { VideoCameraFilled } from "@ant-design/icons";
import { Select } from "antd";
import { WebcamCtx } from "index";
import { isInDebug } from "../../dev-utils/debug";

const { Option } = Select;

const SelectWebcam = ({ width = "auto" }) => {
  const { webcamId, setWebcamId } = useContext(WebcamCtx);
  const [videoDevices, setVideoDevices] = useState([]);

  const handleDevices = useCallback(
    (mediaDevices) => {
      const videoDevices = mediaDevices.filter(
        ({ kind }) => kind === "videoinput",
      );
      setVideoDevices(videoDevices);
    },
    [setVideoDevices],
  );

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      // eslint-disable-next-line no-unused-vars
      .then((_s) => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
      });
  }, [handleDevices]);

  const handleChange = (selecteDeviceId) => {
    const cancelAllAnimationFrames = () => {
      let id = window.requestAnimationFrame(() => {
        if (isInDebug()) {
          console.log(
            "[SelectWebcam] cancelAllAnimationFrames on camera change",
          );
        }
      });
      while (id--) {
        window.cancelAnimationFrame(id);
      }
    };
    // this is super important to do
    // cancelAllAnimationFrames on webcamId change
    // otherwise ML model will sart crashing
    // from corrupted data form not ready webcam
    cancelAllAnimationFrames();
    setWebcamId(selecteDeviceId);
  };

  return (
    videoDevices.length > 0 && (
      <>
        <VideoCameraFilled
          style={{
            fontSize: "1.2rem",
          }}
        />
        &nbsp;&nbsp;
        <Select
          value={webcamId}
          style={{
            width: width,
            overflow: "hidden",
            color: "black",
          }}
          onChange={handleChange}
        >
          {videoDevices.map((device, key) => (
            <Option key={key} value={device.deviceId}>
              <div
                style={{
                  width: "185px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {device.label || `Device ${key + 1}`}
              </div>
            </Option>
          ))}
        </Select>
      </>
    )
  );
};

export default SelectWebcam;
