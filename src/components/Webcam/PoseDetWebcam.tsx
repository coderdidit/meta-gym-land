import { useContext, useRef, useEffect } from "react";
import { WebcamCtx, PoseDetectorCtx } from "index";
import { drawPose } from "../../ai/pose-drawing";
import { updateGPoseState } from "../../ai/gpose/functions";
import { isInDebug } from "../../dev-utils/debug";
import {
  PoseDetWebcamInner,
  PoseDetWebcamInnerProps,
} from "./PoseDetWebcamInner";
import Webcam from "react-webcam";
import { Results } from "@mediapipe/pose";
import { WindowWithProps } from "window-with-props";
import { startPoseEstimationLoop } from "./pose-estimation-loop";

declare let window: WindowWithProps;

type PoseDetWebcamProps = {
  sizeProps: any;
  styleProps: any;
  onPoseResults?: (results: Results) => void;
  onCameraError?: () => void;
};
const PoseDetWebcam = ({
  sizeProps,
  styleProps,
  onPoseResults,
  onCameraError,
}: PoseDetWebcamProps) => {
  const resultsListener = useRef(onPoseResults);
  resultsListener.current = onPoseResults;
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
    let stopEstimation: (() => void) | undefined;
    const startPoseEstimationDebounce = setTimeout(() => {
      if (webcamId) {
        if (isInDebug()) {
          console.log("[PoseDetWebcam] startPredictions useEffect");
        }
        poseDetector.onResults(onResults);
        stopEstimation = startPoseEstimationLoop({
          poseDetector,
          webcamRef,
          window,
        });
      }
    }, 1200);

    return () => {
      if (isInDebug()) {
        console.log("[PoseDetWebcam] exit");
      }
      clearTimeout(startPoseEstimationDebounce);
      stopEstimation?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcamId]);

  // HERE: handle game logic events driven by poses
  const onResults = (results: Results) => {
    resultsListener.current?.(results);
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

  const getVideoConstraints = ():
    | MediaTrackConstraints
    | Record<string, never> => {
    if (webcamId && webcamId === getDeviceId()) {
      return {};
    }
    if (webcamId) {
      return { deviceId: { exact: webcamId } };
    }
    return {};
  };
  const videoConstraints = getVideoConstraints();
  return (
    <PoseDetWebcamInner
      sizeProps={sizeProps}
      styleProps={styleProps}
      videoConstraints={
        videoConstraints as PoseDetWebcamInnerProps["videoConstraints"]
      }
      webcamRef={webcamRef}
      canvasRef={canvasRef}
      onCameraError={onCameraError}
    />
  );
};

export default PoseDetWebcam;
