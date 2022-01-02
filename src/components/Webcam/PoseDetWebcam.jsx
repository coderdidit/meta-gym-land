import React, { useContext, useRef, useEffect } from "react";
import { WebcamCtx, PoseDetectorCtx } from "index";
import Webcam from "react-webcam";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { POSE_CONNECTIONS } from "@mediapipe/pose";
import { DrawUtils } from "./drawing_utils";


const PoseDetWebcam = ({ styleProps }) => {
    const { webcamId, setWebcamId, webcamRef } = useContext(WebcamCtx);
    const canvasRef = useRef(null);
    const { poseDetector } = useContext(PoseDetectorCtx);

    const fps = 5;
    let then = Date.now();
    const interval = 1000 / fps;

    // runs on each frame
    const startPredictions = async () => {
        requestAnimationFrame(() => {
            startPredictions();
        })
        if (webCamAndCanvasAreInit()) {
            doPredictionsCanvasSetup();
            const now = Date.now();
            const delta = now - then;
            if (delta > interval) {
                then = now - (delta % interval);
                const video = webcamRef.current.video;
                const results = await predict(video)
                if (results && results.length > 0) {
                    drawPose(results);
                }
            }
        }
    };

    console.log('PoseDetWebcam poseDetector', poseDetector);
    console.log('PoseDetWebcam webcamRef', webcamRef);
    console.log('PoseDetWebcam webcamId', webcamId);

    const predict = async (imgData) => {
        // pose detection
        console.log('imgData', imgData)
        let poses;
        try {
            poses = await poseDetector.estimatePoses(
                imgData,
                {
                    maxPoses: 1,
                }
            )
        } catch (error) {
            // poseDetector.dispose();
            // poseDetector = null;
            console.error(error);
        }
        return poses
    }

    const drawPose = async (results) => {
        console.log('results', results)
        // Get Video Properties
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

        canvasCtx.globalCompositeOperation = 'source-over';
        // draw pose here
        // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
        //     { color: '#00FF00', lineWidth: 4 });
        // drawLandmarks(canvasCtx, results.poseLandmarks,
        //     { color: '#FF0000', lineWidth: 4 });
        // new DrawUtils(canvasCtx).drawResults(results);
        canvasCtx.restore();
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

    useEffect(async () => {
        startPredictions();
    }, []);

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
                ref={webcamRef}
                muted={true}
                style={{
                    objectFit: "cover",
                    borderRadius: "1rem",
                    position: "absolute",
                    height: "auto",
                    zindex: 9,
                    // params
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
                    ...styleProps,
                }}
            />
        </>
    );
}

export default PoseDetWebcam;
