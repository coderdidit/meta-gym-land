import { useContext, useRef, useEffect } from "react";
import { WebcamCtx, PoseDetectorCtx } from "index";
import { drawPose } from "../../ai/pose-drawing";
import { updateGPoseState } from "../../ai/gpose/functions";
import { isInDebug } from "../../dev-utils/debug";
import { PoseDetWebcamInner } from "./PoseDetWebcamInner";

const PoseDetWebcam = ({ sizeProps, styleProps }) => {
  const { webcamId, setWebcamId } = useContext(WebcamCtx);
  const { poseDetector } = useContext(PoseDetectorCtx);
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);

  const getDeviceId = () => {
    return webcamRef?.current?.stream?.getVideoTracks()?.[0]?.getSettings()
      ?.deviceId;
  };

  // make sure camera is setup
  useEffect(() => {
    const checkCurWebcamId = setInterval(() => {
      if (!webcamId) {
        const deviceId = getDeviceId();
        if (deviceId) {
          setWebcamId(deviceId);
          clearInterval(checkCurWebcamId);
        }
      } else {
        clearInterval(checkCurWebcamId);
      }
      if (isInDebug()) {
        console.log("[PoseDetWebcam] checkCurWebcamId", {
          webcamId,
          getDeviceId: getDeviceId(),
        });
      }
    }, 1000);

    return () => {
      clearInterval(checkCurWebcamId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // start pose estimation loop
  const predictionsStarted = useRef(false);
  useEffect(() => {
    // TODO: add debounce on starting the predictions
    const doPredictions = () => {
      if (!predictionsStarted.current) {
        if (isInDebug()) {
          console.log("[PoseDetWebcam] startPredictions useEffect");
        }
        poseDetector.onResults(onResults);
        startPredictions();
        predictionsStarted.current = true;
      }
    };

    doPredictions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pose estimation loop logic start
  let then = Date.now();
  const fps = 15;
  const interval = 1000 / fps;
  let noCamError = true;
  let camErrCnt = 0;
  const startPredictions = async () => {
    requestAnimationFrame(() => {
      startPredictions();
    });
    if (webCamAndCanvasAreInit()) {
      const now = Date.now();
      const delta = now - then;
      const webcamSetupTime = now - window.webcamIdChangeTS; // TODO double check if this is necessary
      // if time change is greater then defined interval
      // and webcam change happened 1 second ago
      if (delta > interval && webcamSetupTime > 1000) {
        then = now - (delta % interval);
        const videoElement = webcamRef.current.video;
        try {
          if (noCamError) await poseDetector.send({ image: videoElement });
        } catch (error) {
          poseDetector.reset();
          noCamError = false;
          camErrCnt += 1;
          const wait = 500 * camErrCnt;
          console.error(
            `error catched, resetting the AI 
                        and waiting for ${wait / 1000} seconds`,
            error,
          );
          setTimeout(() => {
            noCamError = true;
          }, wait);
        }
      }
    }
  };

  // HERE: handle game logic events driven by poses
  const onResults = (results) => {
    if (webCamAndCanvasAreInit()) {
      doPredictionsCanvasSetup();
      drawPose(canvasRef, results);
      const { poseLandmarks } = results;
      if (poseLandmarks) {
        updateGPoseState(results);
      }
    }
  };
  // pose estimation loop componenets end

  const webCamAndCanvasAreInit = () => {
    return (
      webcamRef &&
      webcamRef.current &&
      webcamRef.current.video.readyState === 4 &&
      canvasRef &&
      canvasRef.current
    );
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
    // if it is the same device do not force re-render
    if (webcamId && webcamId === getDeviceId()) {
      return {};
    } else if (webcamId) {
      return { deviceId: webcamId };
    }
    return {};
  };
  const videoConstraints = getVideoConstraints();
  return (
    <PoseDetWebcamInner
      sizeProps={sizeProps}
      styleProps={styleProps}
      videoConstraints={videoConstraints}
      webcamRef={webcamRef}
      canvasRef={canvasRef}
    />
  );
};

export default PoseDetWebcam;
