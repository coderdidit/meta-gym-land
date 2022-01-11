
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
    return '';
};

export { resToGPose };
