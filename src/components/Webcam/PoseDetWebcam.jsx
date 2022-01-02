import React, { useContext, useRef, useEffect } from "react";
import { WebcamCtx } from "index";
import Webcam from "react-webcam";

const PoseDetWebcam = ({ camTop, camLeft, camWidth }) => {
    const { webcamId, setWebcamId, webcamRef } = useContext(WebcamCtx);
    const canvasRef = useRef(null);

    const reunPredictions = async () => {
        requestAnimationFrame(() => {
            reunPredictions()
        })
        detect()
    };

    console.log('PoseDetWebcam webcamRef', webcamRef);
    console.log('PoseDetWebcam webcamId', webcamId);

    const detect = async () => {
        // Check data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4 &&
            canvasRef &&
            canvasRef.current
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            // webcamRef.current.video.width = videoWidth;
            // webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            // 4. TODO - Make Detections
            // e.g. const obj = await net.detect(video);

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");
            // ctx.drawImage(
            //     video, 0, 0, videoWidth, videoHeight
            // );

            ctx.fillStyle = '#FF0300';
            ctx.strokeStyle = '#FF0300';
            ctx.beginPath();
            ctx.arc(95, 50, 40, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            // 5. TODO - Update drawing utility
            // drawSomething(obj, ctx)  
        }
    };

    useEffect(() => { reunPredictions() }, []);

    return (
        <>
            <Webcam
                audio={false}
                videoConstraints={{ deviceId: webcamId }}
                mirrored={true}
                className={"webcam"}
                ref={webcamRef}
                muted={true}
                style={{
                    objectFit: "cover",
                    borderRadius: "1rem",
                    boxShadow: "0 0 10px 2px #202020",
                    position: "absolute",
                    height: "auto",
                    zindex: 9,
                    // param
                    top: camTop,
                    left: camLeft,
                    width: camWidth,
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
                    // debug
                    border: "5px solid red",
                    // param
                    top: camTop,
                    left: camLeft,
                    width: camWidth,
                }}
            />
        </>
    );
}

export default PoseDetWebcam;