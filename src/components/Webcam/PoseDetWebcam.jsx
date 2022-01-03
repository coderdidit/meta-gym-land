import React, { useContext, useRef, useEffect } from "react";
import { WebcamCtx, PoseDetectorCtx } from "index";
import Webcam from "react-webcam";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { POSE_CONNECTIONS } from '@mediapipe/pose';




const PoseDetWebcam = ({ styleProps }) => {
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

    const onResults = (results) => {
        // console.log('onResults', results)
        if (webCamAndCanvasAreInit()) {
            doPredictionsCanvasSetup();
            console.log('onResults', results);

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
