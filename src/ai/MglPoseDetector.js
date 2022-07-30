import * as mpPose from "@mediapipe/pose";
import { Pose } from "@mediapipe/pose";
import { ConfidenceScore } from "./AIConfig";

export class MglPoseDetector {
  constructor() {
    this.mediaPipePoseDetector = new Pose({
      locateFile: (file) => {
        const path = `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
        return path;
      },
    });

    this.mediaPipePoseDetector.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      selfieMode: true,
      //   enableSegmentation: true,
      // smoothSegmentation: true,
      minDetectionConfidence: ConfidenceScore,
      minTrackingConfidence: ConfidenceScore,
    });

    console.log("Create MglPoseDetector");
  }

  onResults(onResults) {
    this.mediaPipePoseDetector.onResults(onResults);
  }

  async send({ image }) {
    await this.mediaPipePoseDetector.send({ image });
  }

  close() {
    this.mediaPipePoseDetector.close();
  }

  reset() {
    this.mediaPipePoseDetector.reset();
  }

  async initialize() {
    console.log("Init Machine Learning");
    await this.mediaPipePoseDetector.initialize();
  }
}
