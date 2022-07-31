import { useContext, useRef, useEffect } from "react";
import { WebcamCtx, PoseDetectorCtx } from "index";
import { drawPose } from "../../ai/pose-drawing";
import { updateGPoseState } from "../../ai/gpose/functions";
import { isInDebug } from "../../dev-utils/debug";
import { PoseDetWebcamInner } from "./PoseDetWebcamInner";
import Webcam from "react-webcam";
import { Results } from "@mediapipe/pose";
import { WindowWithProps } from "window-with-props";
import { startPoseEstimationLoop } from "./pose-estimation-loop";

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
  useEffect(() => {
    if (isInDebug()) {
      console.log("[PoseDetWebcam] useEffect on startPoseEstimation", {
        webcamId,
      });
    }
    const startPoseEstimationDebounce = setTimeout(() => {
      if (webcamId) {
        if (isInDebug()) {
          console.log("[PoseDetWebcam] startPredictions useEffect");
        }
        // consume estimations
        poseDetector.onResults(onResults);
        // produce estimations
        startPoseEstimationLoop({
          poseDetector,
          webcamRef,
          window,
        });
        // predictionsStarted.current = true;
      }
    }, 500);

    return () => {
      if (isInDebug()) {
        console.log("[PoseDetWebcam] exit");
      }
      clearTimeout(startPoseEstimationDebounce);

      const cancelAllAnimationFrames = () => {
        let id = window.requestAnimationFrame(() => {
          if (isInDebug()) {
            console.log(
              "[PoseDetWebcam] start cancelAllAnimationFrames on exit",
            );
          }
        });
        while (id--) {
          window.cancelAnimationFrame(id);
        }
      };
      cancelAllAnimationFrames();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcamId]);

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
