import { ConfidenceScore } from "../../AIConfig";
import { getAngleBetween } from './angles';
import * as pose from "./pose";
import * as gstate from "./state";

// for media pipe
const mapResults = (results) => {
    return mapMediaPipeResults(results);
};

const mapMediaPipeResults = (results) => {
    // poseLandmarks has 33 landmarks
    const { poseLandmarks } = results
    // const poseLandmarks = results.poseLandmarks;
    console.log('poseLandmarks', poseLandmarks, results);
    const posLandXY = poseLandmarks.map(pl => {
        return {
            x: pl.x,
            y: pl.y,
            score: pl.visibility,
        }
    });
    // remeber this is in selfie mode
    // everything is flipped due to selfie mode
    return {
        nose: posLandXY[0],
        leftShoulder: posLandXY[12], // normally 11 (flipped)
        rightShoulder: posLandXY[11], // normally 12 (flipped)
        leftElbow: posLandXY[14], // normally 13 (flipped)
        rightElbow: posLandXY[13], // normally 14 (flipped)
        leftEye: posLandXY[6], // 1, 2, 3 (inner, eye, outer) (flipped)
        rightEye: posLandXY[3], // 4, 5, 6 (inner, eye, outer) (flipped)
        leftEar: posLandXY[8],
        rightEar: posLandXY[7],
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
    const moveUp = (leftElbowToSholder > angle
        && rightElbowToSholder < angle) && !bothArmsUp
    const moveDown = (rightElbowToSholder > angle
        && leftElbowToSholder < angle) && !bothArmsUp

    const noseToLeftEyeYdistance = nose.y - leftEye.y
    const noseToRightEyeYdistance = nose.y - rightEye.y

    // vissibility TODO treshold settings here may be unecessary
    const scoreThreshold = ConfidenceScore;
    const noseVissible = nose.score > scoreThreshold
    const lEVissible = leftEye.score > scoreThreshold
    const REVissible = rightEye.score > scoreThreshold
    const moveSideActivationDist = 0;

    console.log('leftElbow.y', leftElbow.y);
    console.log('rightElbow.y', rightElbow.y);
    console.log('noseToLeftEyeYdistance', noseToLeftEyeYdistance);
    console.log('noseToRightEyeYdistance', noseToRightEyeYdistance);

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
        return pose.IDLE;
    }
};

const resultsToGPoseState = (results) => {
    const curState = resToGPose(results);
    gstate.setPose(curState);
    return curState;
}

export { resultsToGPoseState };
