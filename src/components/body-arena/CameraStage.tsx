import { useContext, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { PoseDetectorCtx, WebcamCtx } from "index";
import type { Results } from "@mediapipe/pose";
import { startPoseEstimationLoop } from "../Webcam/pose-estimation-loop";
import type { WindowWithProps } from "window-with-props";
import type { PosePoint } from "../../games/arena/movement";
import styles from "./BodyArena.module.css";

declare let window: WindowWithProps;

export type CameraFrame = {
  ctx: CanvasRenderingContext2D;
  video: HTMLVideoElement | null;
  points: PosePoint[];
  receivedAt: number | null;
  now: number;
  delta: number;
};
type Props = {
  enabled: boolean;
  onFrame: (frame: CameraFrame) => void;
  onError: (message: string) => void;
  onPointer: (x: number, y: number) => void;
};

// One camera/inference loop, with a single integrated game canvas as its only visible output.
export default function CameraStage({
  enabled,
  onFrame,
  onError,
  onPointer,
}: Props) {
  const { poseDetector } = useContext(PoseDetectorCtx);
  const { webcamId } = useContext(WebcamCtx);
  const webcam = useRef<Webcam | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const latest = useRef({
    points: [] as PosePoint[],
    receivedAt: null as number | null,
  });
  const callbacks = useRef({ onFrame, onError });
  callbacks.current = { onFrame, onError };
  useEffect(() => {
    latest.current = { points: [], receivedAt: null };
    if (!enabled) return;
    poseDetector.onResults((results: Results) => {
      latest.current = {
        points: results.poseLandmarks || [],
        receivedAt: performance.now(),
      };
    });
    const stop = startPoseEstimationLoop({
      poseDetector,
      webcamRef: webcam,
      window,
    });
    return () => {
      stop();
      poseDetector.onResults(() => undefined);
      latest.current = { points: [], receivedAt: null };
    };
  }, [enabled, poseDetector, webcamId]);
  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    const draw = (now: number) => {
      const c = canvas.current;
      const video = webcam.current?.video ?? null;
      if (c) {
        const width = video?.videoWidth || 960;
        const height = video?.videoHeight || 720;
        if (c.width !== width || c.height !== height) {
          c.width = width;
          c.height = height;
        }
        const ctx = c.getContext("2d");
        if (ctx)
          callbacks.current.onFrame({
            ctx,
            video,
            ...latest.current,
            now,
            delta: now - previous,
          });
      }
      previous = now;
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <>
      {enabled && (
        <Webcam
          key={webcamId || "default"}
          ref={webcam}
          audio={false}
          muted
          playsInline
          className={styles.capture}
          aria-hidden="true"
          tabIndex={-1}
          videoConstraints={
            webcamId
              ? { deviceId: { exact: webcamId } }
              : { facingMode: "user" }
          }
          onUserMediaError={() =>
            callbacks.current.onError(
              "Camera unavailable. Check permission or choose another camera, then retry.",
            )
          }
        />
      )}
      <canvas
        ref={canvas}
        width={960}
        height={720}
        className={styles.canvas}
        aria-label="Body-controlled movement circuit"
        onPointerMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          onPointer(
            (e.clientX - box.left) / box.width,
            (e.clientY - box.top) / box.height,
          );
        }}
      />
    </>
  );
}
