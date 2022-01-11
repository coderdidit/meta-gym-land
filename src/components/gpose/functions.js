import { ConfidenceScore } from "../../AIConfig";
import { getAngleBetween } from './angles';
import * as pose from "./pose";

// for media pipe
const mapResults = (results) => {
    return mapMediaPipeResults(results);
};

const mapMediaPipeResults = (results) => {
    // poseLandmarks has 33 landmarks
    const { poseLandmarks } = results;
    const posLandXY = poseLandmarks.map(pl => {
        return {
            x: pl.x,
            y: pl.y,
            score: pl.visibility,
        }
    });
    // remeber this is in selfie mode
    return {
        nose: posLandXY[0],
        leftShoulder: posLandXY[11],
        rightShoulder: posLandXY[12],
        leftElbow: posLandXY[13],
        rightElbow: posLandXY[14],
        leftEye: posLandXY[3], // 1, 2, 3 (inner, eye, outer)
        rightEye: posLandXY[6], // 4, 5, 6 (inner, eye, outer)
        leftEar: posLandXY[7],
        rightEar: posLandXY[8],
    };
};


const resToGPose = (results) => {
    const parsedRes = mapResults(results);

    const { nose, leftEye, rightEye,
        leftShoulder, rightShoulder,
        leftElbow, rightElbow } = parsedRes;


    // TODO investigate more how this logic works in terms of flipping
    const leftElbowToSholder = getAngleBetween(leftElbow, leftShoulder) * -1
    const rightElbowToSholder = getAngleBetween(rightShoulder, rightElbow)

    const angle = 52

    const bothArmsUp = (leftElbowToSholder > angle)
        && (rightElbowToSholder > angle)
    const moveDown = (leftElbowToSholder > angle
        && rightElbowToSholder < angle) && !bothArmsUp
    const moveUp = (rightElbowToSholder > angle
        && leftElbowToSholder < angle) && !bothArmsUp

    const noseToLeftEyeYdistance = nose.y - leftEye.y
    const noseToRightEyeYdistance = nose.y - rightEye.y

    // vissibility TODO treshold settings here may be unecessary
    const scoreThreshold = ConfidenceScore;
    const noseVissible = nose.score > scoreThreshold
    const lEVissible = leftEye.score > scoreThreshold
    const REVissible = rightEye.score > scoreThreshold
    const moveSideActivationDist = 8;

    if (noseVissible && lEVissible
        && noseToLeftEyeYdistance < moveSideActivationDist) {
        return pose.HTL;
    } else if (noseVissible && REVissible
        && noseToRightEyeYdistance < moveSideActivationDist) {
        return pose.HTR;
    } else if (bothArmsUp) {
        return pose.BA_UP;
    } else if (moveUp) {
        return pose.LA_UP;
    } else if (moveDown) {
        return pose.RA_UP;
    } else {
        return idle;
    }
};

export { resToGPose };
