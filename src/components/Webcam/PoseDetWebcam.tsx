import { useContext, useRef, useEffect } from "react";
import { WebcamCtx, PoseDetectorCtx } from "index";
import { drawPose } from "../../ai/pose-drawing";
import { updateGPoseState } from "../../ai/gpose/functions";
import { isInDebug } from "../../dev-utils/debug";
import { PoseDetWebcamInner } from "./PoseDetWebcamInner";
import Webcam from "react-webcam";
import { Results } from "@mediapipe/pose";
import { WindowWithProps } from "window-with-props";

declare let window: WindowWithProps;

type PoseDetWebcamProps = { sizeProps: any; styleProps: any };
const PoseDetWebcam = ({ sizeProps, styleProps }: PoseDetWebcamProps) => {
  const { webcamId, setWebcamId } = useContext(WebcamCtx);
  const { poseDetector } = useContext(PoseDetectorCtx);
  const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> =
    useRef(null);
  const webcamRef: React.MutableRefObject<Webcam | null> = useRef(null);

  const getDeviceId = (): string | undefined => {
    const webCamSettings: MediaTrackSettings | undefined =
      webcamRef?.current?.stream?.getVideoTracks()?.[0]?.getSettings();
    return webCamSettings?.deviceId;
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
      // for waiting ~1 second if webcam was switched
      const webcamSetupTime = window.webcamIdChangeTS
        ? now - window.webcamIdChangeTS
        : 2000;
      // if time change is greater then defined interval
      // and webcam change happened 1 second ago
      if (delta > interval && webcamSetupTime > 1000) {
        then = now - (delta % interval);
        const videoElement = webcamRef?.current?.video;
        try {
          if (noCamError && videoElement) {
            camErrCnt = 0;
            await poseDetector.send({ image: videoElement });
          }
        } catch (error) {
          poseDetector.reset();
          noCamError = false;
          camErrCnt += 1;
          const wait = 500 * camErrCnt;
          console.error(
            `error catched, resetting the AI` +
              `and waiting for ${wait / 1000} seconds`,
            {
              error,
              camErrCnt,
              wait,
              noCamError,
            },
          );
          setTimeout(() => {
            noCamError = true;
          }, wait);
        }
      }
    }
  };

  // HERE: handle game logic events driven by poses
  const onResults = (results: Results) => {
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

  const webCamAndCanvasAreInit = (): boolean => {
    return Boolean(
      webcamRef &&
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4 &&
        canvasRef &&
        canvasRef.current,
    );
  };

  const doPredictionsCanvasSetup = () => {
    // Get Video Properties
    const videoWidth = webcamRef!.current!.video!.videoWidth;
    const videoHeight = webcamRef!.current!.video!.videoHeight;

    // Set video width
    webcamRef!.current!.video!.width = videoWidth;
    webcamRef!.current!.video!.height = videoHeight;
    // Set canvas height and width
    canvasRef!.current!.width = videoWidth;
    canvasRef!.current!.height = videoHeight;
  };

  const getVideoConstraints = (): MediaTrackSettings => {
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
