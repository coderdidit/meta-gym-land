import React, { useContext, useRef, useEffect } from "react";
import { WebcamCtx, PoseDetectorCtx } from "index";
import Webcam from "react-webcam";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { POSE_CONNECTIONS, Pose } from '@mediapipe/pose';
import * as cu from "@mediapipe/control_utils";

const PoseDetWebcam = ({ styleProps }) => {
    const { webcamId, setWebcamId, webcamRef } = useContext(WebcamCtx);
    const { poseDetector } = useContext(PoseDetectorCtx);
    const canvasRef = useRef(null);

    console.log('poseDetector PoseDetWebcam', poseDetector);
    console.log('PoseDetWebcam webcamRef', webcamRef);
    console.log('PoseDetWebcam webcamId', webcamId);

    let camera;

    const startPredictions = async () => {
        // requestAnimationFrame(() => {
        //     startPredictions();
        // })
        // detectPose();
        // const videoElement = document.getElementById("webcam");
        if (camera) await camera.stop();
        const videoElement = webcamRef.current.video;

        console.log('startPredictions', videoElement);

        poseDetector.onResults(onResults);
        // limit fps for predictions
        const fps = 15;
        const interval = 1000 / fps;
        let then = Date.now();
        camera = new Camera(videoElement, {
            onFrame: async () => {
                if (webCamAndCanvasAreInit()) {
                    const now = Date.now();
                    const delta = now - then;
                    if (delta > interval) {
                        then = now - (delta % interval);
                        // run prediction
                        await poseDetector.send({ image: videoElement });
                    }
                }
            },
            // width: 1280,
            // height: 720
        });
        await camera.start();
    };

    const onResults = (results) => {
        if (webCamAndCanvasAreInit()) {
            doPredictionsCanvasSetup();
            console.log('onResults', results);

            // Get Video Properties
            // const video = webcamRef.current.video;
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

            // Draw mesh
            canvasCtx.globalCompositeOperation = 'source-over';
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                { color: '#00FF00', lineWidth: 4 });
            drawLandmarks(canvasCtx, results.poseLandmarks,
                { color: '#FF0000', lineWidth: 4 });
            canvasCtx.restore();
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

    useEffect(async () => {
        console.log("webcam changed", webcamId);
        // if (camera) await camera.stop();
        // await startPredictions();
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
                // id={"webcam"}
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
