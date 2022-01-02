import * as posedetection from '@tensorflow-models/pose-detection';

const DEFAULT_LINE_WIDTH = 8;
const DEFAULT_RADIUS = 10;


// #ffffff - White
// #800000 - Maroon
// #469990 - Malachite
// #e6194b - Crimson
// #42d4f4 - Picton Blue
// #fabed4 - Cupid
// #aaffc3 - Mint Green
// #9a6324 - Kumera
// #000075 - Navy Blue
// #f58231 - Jaffa
// #4363d8 - Royal Blue
// #ffd8b1 - Caramel
// #dcbeff - Mauve
// #808000 - Olive
// #ffe119 - Candlelight
// #911eb4 - Seance
// #bfef45 - Inchworm
// #f032e6 - Razzle Dazzle Rose
// #3cb44b - Chateau Green
// #a9a9a9 - Silver Chalice
const COLOR_PALETTE = [
    '#ffffff', '#800000', '#469990', '#e6194b', '#42d4f4', '#fabed4', '#aaffc3',
    '#9a6324', '#000075', '#f58231', '#4363d8', '#ffd8b1', '#dcbeff', '#808000',
    '#ffe119', '#911eb4', '#bfef45', '#f032e6', '#3cb44b', '#a9a9a9'
];

const scoreThreshold = 0.5;

const allowedKeypoints = new Set([
    "nose",
    "left_eye",
    "right_eye",
    "left_eye_inner",
    "right_eye_inner",
    "left_eye_outer",
    "right_eye_outer",
    // "left_ear",
    // "right_ear",

    "left_shoulder",
    "right_shoulder",
    "left_elbow",
    "right_elbow",
    // "left_wrist",
    // "right_wrist",
])


// drawCtx() {
//     this.ctx.drawImage(
//         this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
// }

// clearCtx() {
//     this.ctx.clearRect(0, 0, this.video.videoWidth, this.video.videoHeight);
// }


export class DrawUtils {
    constructor(canvasCtx) {
        this.ctx = canvasCtx;
    }
    /**
     * Draw the keypoints and skeleton on the video.
     * @param poses A list of poses to render.
     */
    drawResults(poses) {
        for (const pose of poses) {
            this.drawResult(pose);

            let leftColor = "white"
            let rightColor = "white"
            // if (window.gameLeftMove()) {
            //     leftColor = "red"
            // }
            // if (window.gameRightMove()) {
            //     rightColor = "red"
            // }
            // horizontal line for reference
            const nose = pose.keypoints[0]
            if (nose.score > scoreThreshold) {
                // path from nose to right end
                this.drawLine(nose, { x: 0, y: nose.y }, rightColor)
                // path from nose to left end 
                // TODO TODO TODO  
                // this.drawLine(nose, { x: this.video.videoWidth, y: nose.y }, leftColor)
            }
        }
    }

    /**
     * Draw the keypoints and skeleton on the video.
     * @param pose A pose with keypoints to render.
     */
    drawResult(pose) {
        if (pose.keypoints != null) {
            this.drawKeypoints(pose.keypoints);
            this.drawSkeleton(pose.keypoints);
        }
    }

    /**
     * Draw the keypoints on the video.
     * @param keypoints A list of keypoints.
     */
    drawKeypoints(keypoints) {
        const keypointInd = posedetection.util.getKeypointIndexBySide(
            posedetection.SupportedModels.BlazePose);
        this.ctx.fillStyle = 'Red';
        this.ctx.strokeStyle = 'White';
        this.ctx.lineWidth = DEFAULT_LINE_WIDTH;

        for (const i of keypointInd.middle) {
            if (allowedKeypoints.has(keypoints[i].name)) {
                this.drawKeypoint(keypoints[i]);
            }
        }

        this.ctx.fillStyle = 'Green';
        for (const i of keypointInd.left) {
            if (allowedKeypoints.has(keypoints[i].name)) {
                this.drawKeypoint(keypoints[i]);
            }
        }

        this.ctx.fillStyle = 'Orange';
        for (const i of keypointInd.right) {
            if (allowedKeypoints.has(keypoints[i].name)) {
                this.drawKeypoint(keypoints[i]);
            }
        }
    }

    drawKeypoint(keypoint) {
        // If score is null, just show the keypoint.
        const score = keypoint.score != null ? keypoint.score : 1;
        if (score >= scoreThreshold) {
            const circle = new Path2D();
            circle.arc(keypoint.x, keypoint.y, DEFAULT_RADIUS, 0, 2 * Math.PI);
            this.ctx.fill(circle);
            this.ctx.stroke(circle);
        }
    }

    /**
     * Draw the skeleton of a body on the video.
     * @param keypoints A list of keypoints.
     */
    drawSkeleton(keypoints) {
        this.ctx.lineWidth = DEFAULT_LINE_WIDTH;
        posedetection.util.getAdjacentPairs(posedetection.SupportedModels.BlazePose).forEach(([
            i, j
        ]) => {
            const kp1 = keypoints[i];
            const kp2 = keypoints[j];
            let color = "blue"
            if (kp1.name == "left_shoulder" && kp2.name == "left_elbow"
                // && window.gameUpMove()
            ) {
                color = "red"
            } else if (kp1.name == "right_shoulder" && kp2.name == "right_elbow"
                // && window.gameDownMove()
            ) {
                color = "red"
            }
            // else if (window.gameFireMove()) {
            //     color = "orange"
            // }
            if (allowedKeypoints.has(kp1.name) && allowedKeypoints.has(kp2.name)) {
                // If score is null, just show the keypoint.
                const score1 = kp1.score != null ? kp1.score : 1;
                const score2 = kp2.score != null ? kp2.score : 1;
                const scoreThreshold = 0.5;

                if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
                    this.drawLine(kp1, kp2, color)
                }
            }
        });
    }

    drawLine(p1, p2, color) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y)
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }
}