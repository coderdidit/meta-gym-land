import React, { useState, useCallback, useEffect } from "react";
import { VideoCameraFilled } from "@ant-design/icons";
import { Select } from "antd";

const { Option } = Select;

const SelectWebcam = () => {
    const [deviceId, setDeviceId] = useState({});
    const [devices, setDevices] = useState([]);

    const handleDevices = useCallback(
        mediaDevices =>
            setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
        [setDevices]
    );

    useEffect(
        () => {
            navigator.mediaDevices.enumerateDevices().then(handleDevices);
        },
        [handleDevices]
    );

    const handleChange = () => {

    }
    const defaultCamId = () => {
        const deviceId = devices?.[0]?.deviceId;
        return deviceId;
    };

    return devices.length > 0 && (
        <>
            <VideoCameraFilled style={{
                fontSize: "1.2rem",
            }} />&nbsp;&nbsp;
            <Select
                defaultValue={defaultCamId()}
                style={{
                    width: "250px",
                    borderRadius: "0.2rem",
                    overflow: "hidden",
                    color: "black",
                }}

                onChange={handleChange}>
                {devices.map((device, key) => (
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
