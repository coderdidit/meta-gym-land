import React, { useContext, useRef, useEffect, Component } from "react";
import { WebcamCtx, PoseDetectorCtx } from "index";
import Webcam from "react-webcam";
import { drawPose } from "./pose-drawing";
import { updateGPoseState } from "../gpose/functions";
import { BgColorsOutlined } from "@ant-design/icons";
import { setWebcamBG, getWebcamBG } from "./state";

const blackBgClass = 'black-bg';
const grennClass = 'green-color';

class PoseDetWebcamInner extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        // fixing unnecessary webcam re-render
        const curDeviceId = this.props.videoConstraints?.deviceId;
        const nextDeviceId = nextProps.videoConstraints?.deviceId;
        if (!nextDeviceId) return false;
        if (curDeviceId === nextDeviceId) {
            return false;
        } else {
            return true;
        }
    }

    render() {

        const { sizeProps, styleProps, videoConstraints, webcamRef, canvasRef } = this.props;
        return (
            <div
                id={"pose-det-webcam-container"}
                style={{
                    display: "grid",
                    gridTemplateRows: "1fr",
                    gridTemplateColumns: "1fr",
                    gridTemplateAreas: "overlap",
                }} >
                <div
                    style={{
                        display: "grid",
                        gridTemplateRows: "1fr",
                        gridTemplateColumns: "1fr",
                        gridTemplateAreas: "overlap",
                    }}>
                    <Webcam
                        audio={false}
                        videoConstraints={videoConstraints}
                        imageSmoothing={true}
                        mirrored={true}
                        id={"pose-det-webcam"}
                        ref={webcamRef}
                        muted={true}
                        style={{
                            objectFit: "cover",
                            zIndex: 8,
                            // params
                            ...sizeProps,
                            ...styleProps,
                            // grid props
                            gridArea: "overlap",
                            alignSelf: "center",
                            justifySelf: "center",
                        }}
                    />
                    <canvas
                        ref={canvasRef}
                        id={"pose-det-webcam-canvas"}
                        className={getWebcamBG()}
                        style={{
                            objectFit: "cover",
                            zIndex: 9,
                            // params
                            ...sizeProps,
                            ...styleProps,
                            // grid props
                            gridArea: "overlap",
                            alignSelf: "center",
                            justifySelf: "center",
                        }}
                    />
                </div>
                <div
                    style={{
                        marginTop: "-25px",
                        marginLeft: "6%",
                        zIndex: 10,
                        cursor: "pointer",
                    }}>
                    <BgColorsOutlined
                        id={"pose-det-webcam-canvas-cam-toggle-icon"}
                        className={getWebcamBG() != "" ? grennClass : ""}
                        onClick={() => {
                            const icon = document.getElementById("pose-det-webcam-canvas-cam-toggle-icon");
                            const webCamCanvas = document.getElementById("pose-det-webcam-canvas");
                            if (webCamCanvas.className !== blackBgClass) {
                                webCamCanvas.className = blackBgClass;
                                icon.className = grennClass;
                            } else {
                                webCamCanvas.className = "";
                                icon.className = "";
                            }
                            setWebcamBG(webCamCanvas.className);
                        }}
                    />
                </div>
            </div>
        );
    }
};

const PoseDetWebcam = ({ sizeProps, styleProps }) => {
    const { webcamId, setWebcamId } = useContext(WebcamCtx);
    const { poseDetector } = useContext(PoseDetectorCtx);
    const canvasRef = useRef(null);
    const webcamRef = useRef(null);

    useEffect(() => {
        poseDetector.onResults(onResults);
        startPredictions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getDeviceId = () => {
        return webcamRef?.current?.stream?.getVideoTracks()?.[0]?.getSettings()?.deviceId;
    }

    useEffect(() => {
        const checkCurWebcamId = setInterval(() => {
            if (!webcamId) {
                const deviceId = getDeviceId();
                if (deviceId) {
                    setWebcamId(deviceId);
                    clearInterval(checkCurWebcamId);
                }
            }
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let then = Date.now();
    const fps = 15;
    const interval = 1000 / fps;
    let noCamError = true;
    let camErrCnt = 0;
    const startPredictions = async () => {
        requestAnimationFrame(() => {
            startPredictions();
        })
        if (webCamAndCanvasAreInit()) {
            const videoElement = webcamRef.current.video;
            const now = Date.now();
            const delta = now - then;
            const webcamSetupTime = now - window.webcamIdChangeTS;
            if (delta > interval && webcamSetupTime > 1000) {
                then = now - (delta % interval);
                try {
                    if (noCamError) await poseDetector
                        .send({ image: videoElement });
                } catch (error) {
                    poseDetector.reset();
                    noCamError = false;
                    camErrCnt += 1;
                    const wait = 500 * camErrCnt
                    console.error(
                        `error catched, resetting the AI 
                        and waiting for ${wait / 1000} seconds`,
                        error);
                    setTimeout(() => {
                        noCamError = true
                    }, wait)
                }
            }
        }
    };

    // HERE: handle game logic events driven by poses
    const onResults = (results) => {
        if (webCamAndCanvasAreInit()) {
            doPredictionsCanvasSetup();
            drawPose(canvasRef, results);
            const { poseLandmarks } = results
            if (poseLandmarks) {
                updateGPoseState(results);
            }
        }
    };

    const webCamAndCanvasAreInit = () => {
        return webcamRef &&
            webcamRef.current &&
            webcamRef.current.video.readyState === 4 &&
            canvasRef &&
            canvasRef.current;
    };

    const doPredictionsCanvasSetup = () => {
        // Get Video Properties
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
        // Set canvas height and width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
    };

    const getVideoConstraints = () => {
        // if it is the same device do not force re-render
        if (webcamId && webcamId === getDeviceId()) {
            return {}
        } else if (webcamId) {
            return { deviceId: webcamId }
        }
        return {}
    }
    const videoConstraints = getVideoConstraints();
    return (
        <PoseDetWebcamInner
            sizeProps={sizeProps}
            styleProps={styleProps}
            videoConstraints={videoConstraints}
            webcamRef={webcamRef}
            canvasRef={canvasRef}
        />
    );
}

export default PoseDetWebcam;
