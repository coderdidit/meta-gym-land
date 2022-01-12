import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {
    POSE_CONNECTIONS, POSE_LANDMARKS_LEFT,
    POSE_LANDMARKS_RIGHT, POSE_LANDMARKS_NEUTRAL
} from '@mediapipe/pose';
import { ConfidenceScore } from "../../AIConfig";

const IDLE_POSE_LANDMARKS_COLOR = "#FF0000";
const IDLE_POSE_LINES_COLOR = "#00FF00";
const VisibilityMin = ConfidenceScore;

const drawLine = (p1, p2, color, ctx, width, height) => {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p1.x * width, p1.y * height)
    ctx.lineTo(p2.x, p2.y * height);
    ctx.stroke();
};

export const drawPose = (canvasRef, results) => {
    // Get Canvas
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
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
        // console.log('results', results);
        const nose = results.poseLandmarks[0];

        drawLine(nose, { x: 0, y: nose.y }, "#1990FF", canvasCtx, width, height);
        // path from nose to left end   
        drawLine(nose, { x: canvasRef?.current.width, y: nose.y }, "#20BF96", canvasCtx, width, height);

        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            {
                color: IDLE_POSE_LINES_COLOR,
                lineWidth: 4,
                visibilityMin: VisibilityMin,
            });

        // left
        drawLandmarks(canvasCtx, Object.values(POSE_LANDMARKS_LEFT)
            .map(index => results.poseLandmarks[index]),
            {
                color: 'black', fillColor: 'white',
                lineWidth: 1,
                visibilityMin: VisibilityMin,
            });
        // right
        drawLandmarks(canvasCtx, Object.values(POSE_LANDMARKS_RIGHT)
            .map(index => results.poseLandmarks[index]),
            {
                color: 'black', fillColor: 'white',
                lineWidth: 1,
                visibilityMin: VisibilityMin,
            });
        // neutral
        drawLandmarks(canvasCtx, Object.values(POSE_LANDMARKS_NEUTRAL)
            .map(index => results.poseLandmarks[index]),
            {
                color: 'black', fillColor: 'white',
                lineWidth: 1,
                visibilityMin: VisibilityMin,
            });

        const le = {
            // LEFT_EYE_INNER: 1, 
            LEFT_EYE: 2,
            // LEFT_EYE_OUTER: 3
        }

        drawLandmarks(canvasCtx, Object.values(le)
            .map(index => results.poseLandmarks[index]),
            {
                color: '#2450F7', fillColor: '#2450F7',
                lineWidth: 20,
                visibilityMin: VisibilityMin,
            });

        const re = {
            // RIGHT_EYE_INNER: 4, 
            RIGHT_EYE: 5,
            // RIGHT_EYE_OUTER: 6
        }

        drawLandmarks(canvasCtx, Object.values(re)
            .map(index => results.poseLandmarks[index]),
            {
                color: '#2450F7', fillColor: '#2450F7',
                lineWidth: 20,
                visibilityMin: VisibilityMin,
            });
    }
    canvasCtx.restore();
};
