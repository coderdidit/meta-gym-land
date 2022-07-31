import { MglPoseDetector } from "ai/MglPoseDetector";
import { isInDebug } from "dev-utils/debug";
import Webcam from "react-webcam";
import { WindowWithProps } from "window-with-props";

export { startPoseEstimationLoop, lastAnimationTimerId };

let lastAnimationTimerId = -1;

type startPoseEstimationLoopParams = {
  poseDetector: MglPoseDetector;
  webcamRef: React.MutableRefObject<Webcam | null>;
  window: WindowWithProps;
};
const startPoseEstimationLoop = (params: startPoseEstimationLoopParams) => {
  const targetFps = 15;
  const oneSecondMillis = 100;
  const interval = oneSecondMillis / targetFps;
  let lastPoseEstimationCall = Date.now();

  const { poseDetector, webcamRef, window } = params;
  // function executed in the loop
  const runPoseEstimation = async () => {
    const currentCallTimestamp = Date.now();
    const timeElapsed = currentCallTimestamp - lastPoseEstimationCall;
    // wait ~1 second if webcam was switched
    const webcamSetupTime = window.webcamIdChangeTS
      ? currentCallTimestamp - window.webcamIdChangeTS
      : 2000;

    if (timeElapsed > interval && webcamSetupTime > oneSecondMillis) {
      // update last call timestamp
      lastPoseEstimationCall = currentCallTimestamp - (timeElapsed % interval);
      const poseEstimationError = await sendVideoToPoseDetector({
        poseDetector,
        webcamRef,
      });

      if (poseEstimationError) {
        // reset pose detector
        // and debounce next runPoseEstimation loop start
        poseDetector.reset();
        const waitMillis = 1000;
        console.error(
          `[PoseDetector] error catched, resetting the AI ` +
            `and waiting for ${waitMillis / 1000} seconds before next call`,
          { poseEstimationError },
        );
        setTimeout(() => {
          lastAnimationTimerId = requestAnimationFrame(runPoseEstimation);
        }, waitMillis);
        return;
      }
    }

    // keep the loop
    lastAnimationTimerId = requestAnimationFrame(runPoseEstimation);
  };

  // start the loop
  requestAnimationFrame(runPoseEstimation);
};

type sendVideoToPoseDetectorParams = {
  poseDetector: MglPoseDetector;
  webcamRef: React.MutableRefObject<Webcam | null>;
};
const sendVideoToPoseDetector = async (
  params: sendVideoToPoseDetectorParams,
): Promise<any | undefined> => {
  const { poseDetector, webcamRef } = params;
  const videoElement = webcamRef?.current?.video;
  if (isInDebug()) {
    console.log("[PoseDetector] sendVideoToPoseDetector call");
  }
  // this check
  // videoElement.readyState === 4
  // is important
  if (videoElement && videoElement.readyState === 4) {
    try {
      await poseDetector.send({ image: videoElement });
      return undefined;
    } catch (error) {
      return error;
    }
  }
};
