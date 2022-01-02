import React, { useState, useCallback, useEffect, useContext } from "react";
import { VideoCameraFilled } from "@ant-design/icons";
import { Select } from "antd";
import { WebcamCtx, PoseDetectorCtx } from "index";

const { Option } = Select;

const SelectWebcam = ({ width = "auto" }) => {
    const {webcamId, setWebcamId} = useContext(WebcamCtx);
    const {poseDetector} = useContext(PoseDetectorCtx);
    const [videoDevices, setVideoDevices] = useState([]);

    const handleDevices = useCallback(
        mediaDevices =>
            setVideoDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
        [setVideoDevices]
    );

    useEffect(
        () => {
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
        },
        [handleDevices]
    );

    const handleChange = (selecteDeviceId) => {
        console.log('selecteDeviceId', selecteDeviceId);
        setWebcamId(selecteDeviceId);
        poseDetector.reset();
    };
    return videoDevices.length > 0 && (
        <>
            <VideoCameraFilled style={{
                fontSize: "1.2rem",
            }} />&nbsp;&nbsp;
            <Select
                defaultValue={webcamId}
                style={{
                    width: width,
                    borderRadius: "1rem",
                    overflow: "hidden",
                    color: "black",
                }}

                onChange={handleChange}>
                {videoDevices.map((device, key) => (
                    <Option key={key} value={device.deviceId}>
                        <div style={{
                            width: "185px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}>
                            {device.label || `Device ${key + 1}`}
                        </div>
                    </Option>
                ))}
            </Select>
        </>
    );
};

export default SelectWebcam;
