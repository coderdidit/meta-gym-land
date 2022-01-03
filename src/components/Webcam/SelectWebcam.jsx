import React, { useState, useCallback, useEffect, useContext, useReducer } from "react";
import { VideoCameraFilled } from "@ant-design/icons";
import { Select } from "antd";
import { WebcamCtx } from "index";

const { Option } = Select;

const SelectWebcam = ({ width = "auto" }) => {
    const { webcamId, setWebcamId } = useContext(WebcamCtx);
    const [videoDevices, setVideoDevices] = useState([]);
    // eslint-disable-next-line no-unused-vars
    // const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    console.log('SelectWebcam webcamId', webcamId);
    // const [selected, setSelected] = useState(webcamId);

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

    // useEffect(
    //     () => {
    //         console.log('SelectWebcam webcamId updated forceUpdate');
    //         forceUpdate();
    //     },
    //     [webcamId]
    // );

    const handleChange = (selecteDeviceId) => {
        console.log('selecteDeviceId', selecteDeviceId);
        setWebcamId(selecteDeviceId);
    };

    return videoDevices.length > 0 && (
        <>
            {/* <p style={{
                display: "none",
            }}>{webcamId}</p>
            <p style={{
                display: "none",
            }}>{ignored}</p> */}
            <VideoCameraFilled style={{
                fontSize: "1.2rem",
            }} />&nbsp;&nbsp;
            <Select
                value={webcamId}
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
