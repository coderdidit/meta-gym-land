import pageStyles from "./SelectWebcam.styles.module.css";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { VideoCameraFilled } from "@ant-design/icons";
import { Select } from "antd";
import { WebcamCtx } from "index";
import { mainFontColor } from "../../GlobalStyles";

const STORAGE_KEY = "webcamId";

const { Option } = Select;

export { SelectWebcam };

const enumerateVideoDevices = () =>
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => devices.filter((d) => d.kind === "videoinput"));

const SelectWebcam = ({ width = "auto" }) => {
  const { webcamId, setWebcamId } = useContext(WebcamCtx);
  const [videoDevices, setVideoDevices] = useState([]);

  const refreshDevices = useCallback((needPermission = true) => {
    if (needPermission) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          stream.getTracks().forEach((t) => t.stop());
          return enumerateVideoDevices();
        })
        .then(setVideoDevices)
        .catch(() => setVideoDevices([]));
    } else {
      enumerateVideoDevices().then(setVideoDevices);
    }
  }, []);

  useEffect(() => {
    refreshDevices(true);
  }, [refreshDevices]);

  useEffect(() => {
    if (videoDevices.length === 0) return;
    const ids = videoDevices.map((d) => d.deviceId);
    const savedId = window.localStorage.getItem(STORAGE_KEY);
    if (webcamId && !ids.includes(webcamId)) {
      setWebcamId(null);
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch (_) {
        // ignore
      }
    } else if (!webcamId && savedId && ids.includes(savedId)) {
      setWebcamId(savedId);
    }
  }, [videoDevices, webcamId, setWebcamId]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") refreshDevices(false);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [refreshDevices]);

  const handleChange = (selectedDeviceId) => {
    setWebcamId(selectedDeviceId);
    try {
      window.localStorage.setItem(STORAGE_KEY, selectedDeviceId);
    } catch (e) {
      console.warn("Failed to save webcam preference", e);
    }
  };

  return (
    videoDevices.length > 0 && (
      <>
        <VideoCameraFilled className={pageStyles.cameraIcon} />
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
              <div className={pageStyles.deviceLabel}>
                {device.label || `Device ${key + 1}`}
              </div>
            </Option>
          ))}
        </Select>
      </>
    )
  );
};
