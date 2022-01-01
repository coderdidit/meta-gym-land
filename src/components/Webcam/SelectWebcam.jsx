import React, { useState, useCallback, useEffect, useContext } from "react";
import { VideoCameraFilled } from "@ant-design/icons";
import { Select } from "antd";
import { WebcamCtx } from "index";

const { Option } = Select;

const SelectWebcam = () => {
    const [deviceId, setDeviceId] = useContext(WebcamCtx);
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

    const handleChange = (selecteDeviceId) => {
        console.log('selecteDeviceId', selecteDeviceId);
        setDeviceId(selecteDeviceId);
    };
    const defaultCamId = () => {
        if (!deviceId) {
            return devices?.[0]?.deviceId;
        }
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
                    width: "60%",
                    borderRadius: "1rem",
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
