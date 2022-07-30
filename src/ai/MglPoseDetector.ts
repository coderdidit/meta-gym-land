import * as mpPose from "@mediapipe/pose";
import { Pose, ResultsListener, InputMap, Options } from "@mediapipe/pose";
import { isInDebug } from "dev-utils/debug";
import { ConfidenceScore } from "./AIConfig";

const PoseDetectorSettings: Options = {
  modelComplexity: 1,
  smoothLandmarks: true,
  selfieMode: true,
  // enableSegmentation: true,
  // smoothSegmentation: true,
  minDetectionConfidence: ConfidenceScore,
  minTrackingConfidence: ConfidenceScore,
};

export class MglPoseDetector {
  mediaPipePoseDetector: Pose;

  constructor() {
    this.mediaPipePoseDetector = new Pose({
      locateFile: (file) => {
        const path = `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
        if (isInDebug()) {
          console.log("[MglPoseDetector] loading model from path", { path });
        }
        return path;
      },
    });

    this.mediaPipePoseDetector.setOptions(PoseDetectorSettings);

    console.log("[MglPoseDetector] create new Pose object");
  }

  // not tested yet
  reInit() {
    this.mediaPipePoseDetector = new Pose({
      locateFile: (file) => {
        const path = `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
        console.log("[MglPoseDetector] loading model from path", { path });
        return path;
      },
    });

    this.mediaPipePoseDetector.setOptions(PoseDetectorSettings);

    console.log("[MglPoseDetector] re-create new Pose object");
  }

  async recreatePoseObject() {
    console.log("[MglPoseDetector] recreatePoseObject");
    await this.close();
    console.log("[MglPoseDetector] old Pose object closed");
    this.reInit();
    await this.initialize();
  }

  onResults(listener: ResultsListener) {
    this.mediaPipePoseDetector.onResults(listener);
  }

  async send({ image }: InputMap) {
    await this.mediaPipePoseDetector.send({ image });
  }

  async close() {
    await this.mediaPipePoseDetector.close();
  }

  reset() {
    this.mediaPipePoseDetector.reset();
  }

  async initialize() {
    await this.mediaPipePoseDetector.initialize();
    console.log("[MglPoseDetector] initialized");
  }
}
