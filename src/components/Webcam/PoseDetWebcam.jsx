import React, { useContext, useRef, useEffect } from "react";
import { WebcamCtx, PoseDetectorCtx } from "index";
import Webcam from "react-webcam";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {
    POSE_CONNECTIONS, POSE_LANDMARKS_LEFT,
    POSE_LANDMARKS_RIGHT, POSE_LANDMARKS_NEUTRAL
} from '@mediapipe/pose';

const IDLE_POSE_LANDMARKS_COLOR = "#FF0000";
const IDLE_POSE_LINES_COLOR = "#00FF00";


const PoseDetWebcam = ({ sizeProps, styleProps }) => {
    const { webcamId, setWebcamId } = useContext(WebcamCtx);
    const { poseDetector } = useContext(PoseDetectorCtx);
    const canvasRef = useRef(null);
    const webcamRef = useRef(null);

    console.log('poseDetector PoseDetWebcam', poseDetector);
    console.log('PoseDetWebcam webcamRef', webcamRef);
    console.log('PoseDetWebcam webcamId', webcamId);

    useEffect(async () => {
        poseDetector.onResults(onResults);
        startPredictions()
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
            if (delta > interval) {
                then = now - (delta % interval);
                try {
                    if (noCamError) await poseDetector
                        .send({ image: videoElement });
                } catch (error) {
                    poseDetector.reset();
                    noCamError = false;
                    camErrCnt += 1;
                    const wait = 1000 * camErrCnt
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
            drawPose(results);
        }
    };

    const drawPose = (results) => {
        doPredictionsCanvasSetup();
        // Get Canvas
        const canvasCtx = canvasRef.current.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Only overwrite existing pixels.
        canvasCtx.globalCompositeOperation = 'source-in';
        canvasCtx.fillStyle = '#00FF00';
        canvasCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop';

        // Draw testing circle
        canvasCtx.fillStyle = '#04AA6D';
        canvasCtx.strokeStyle = '#04AA6D';
        canvasCtx.beginPath();
        canvasCtx.arc(50, 50, 20, 0, 2 * Math.PI);
        canvasCtx.stroke();
        canvasCtx.fill();

        // Draw Pose mesh
        canvasCtx.globalCompositeOperation = 'source-over';
        if (results.poseLandmarks) {
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                { color: IDLE_POSE_LINES_COLOR, lineWidth: 4, visibilityMin: 0.5 });

            // left
            console.log('POSE_LANDMARKS_RIGHT', POSE_LANDMARKS_RIGHT)
            drawLandmarks(canvasCtx, Object.values(POSE_LANDMARKS_LEFT)
                .map(index => results.poseLandmarks[index]),
                {
                    color: IDLE_POSE_LANDMARKS_COLOR,
                    lineWidth: 4,
                    visibilityMin: 0.5
                });
            // right
            drawLandmarks(canvasCtx, Object.values(POSE_LANDMARKS_RIGHT)
                .map(index => results.poseLandmarks[index]),
                {
                    color: 'rgb(0,217,231)',
                    lineWidth: 4,
                    visibilityMin: 0.5
                });
            // neutral
            drawLandmarks(canvasCtx, Object.values(POSE_LANDMARKS_NEUTRAL)
                .map(index => results.poseLandmarks[index]),
                {
                    color: 'white', fillColor: 'rgb(0,217,231)',
                    lineWidth: 4,
                    visibilityMin: 0.5
                });

            const le = {
                // LEFT_EYE_INNER: 1, 
                LEFT_EYE: 2,
                LEFT_EYE_OUTER: 3
            }

            drawLandmarks(canvasCtx, Object.values(le)
                .map(index => results.poseLandmarks[index]),
                {
                    color: 'white', fillColor: 'black',
                    lineWidth: 4,
                    visibilityMin: 0.5
                });

            const re = {
                // RIGHT_EYE_INNER: 4, 
                RIGHT_EYE: 5, RIGHT_EYE_OUTER: 6
            }

            drawLandmarks(canvasCtx, Object.values(re)
                .map(index => results.poseLandmarks[index]),
                {
                    color: 'white', fillColor: 'black',
                    lineWidth: 4,
                    visibilityMin: 0.5
                });
        }
        canvasCtx.restore();
    };

    const webCamAndCanvasAreInit = () => {
        return webcamRef &&
            webcamRef.current &&
            webcamRef.current.video.readyState === 4 &&
            (webcamRef.current.video.webkitDecodedFrameCount
                || webcamRef.current.video.mozDecodedFrames) &&
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
        if (webcamId) {
            return { deviceId: webcamId }
        }
        return {}
    }

    return (
        <>
            <Webcam
                audio={false}
                videoConstraints={getVideoConstraints()}
                mirrored={true}
                className={"webcam"}
                id={"webcam"}
                ref={webcamRef}
                muted={true}
                style={{
                    objectFit: "cover",
                    borderRadius: "1rem",
                    position: "absolute",
                    height: "auto",
                    zindex: 9,
                    // params
                    ...sizeProps,
                    ...styleProps,
                }}
            />
            <canvas
                ref={canvasRef}
                className={"webcam-canvas"}
                style={{
                    objectFit: "cover",
                    borderRadius: "1rem",
                    position: "absolute",
                    height: "auto",
                    zindex: 8,
                    // params
                    ...sizeProps,
                }}
            />
        </>
    );
}

export default PoseDetWebcam;
