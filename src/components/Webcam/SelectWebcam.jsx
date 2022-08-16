import React, { useState, useCallback, useEffect, useContext } from "react";
import { VideoCameraFilled } from "@ant-design/icons";
import { Select } from "antd";
import { WebcamCtx } from "index";
import { mainFontColor } from "../../GlobalStyles";

const { Option } = Select;

export { SelectWebcam, SelectWebcamStateless };

const SelectWebcam = ({ width = "auto" }) => {
  const { webcamId, setWebcamId } = useContext(WebcamCtx);
  return (
    <SelectWebcamStateless
      width={width}
      webcamId={webcamId}
      setWebcamId={setWebcamId}
    />
  );
};

const SelectWebcamStateless = ({ width = "auto", webcamId, setWebcamId }) => {
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
            color: mainFontColor,
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
