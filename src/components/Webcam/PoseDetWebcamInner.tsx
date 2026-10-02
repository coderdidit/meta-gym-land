import styles from "./PoseDetWebcamInner.module.css";
import { Component } from "react";
import Webcam from "react-webcam";
import { BgColorsOutlined } from "@ant-design/icons";
import { setWebcamBG, getWebcamBG } from "./state";

const blackBgClass = "black-bg";
const BgColorsOutlinedIcon = BgColorsOutlined as any;

export interface PoseDetWebcamInnerProps {
  videoConstraints: MediaTrackConstraints | Record<string, never>;
  sizeProps: any;
  styleProps: any;
  webcamRef: any;
  canvasRef: any;
  onCameraError?: () => void;
}

export class PoseDetWebcamInner extends Component<
  PoseDetWebcamInnerProps,
  unknown
> {
  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(nextProps: PoseDetWebcamInnerProps, _nextState: any) {
    const cur = this.props.videoConstraints?.deviceId;
    const next = nextProps.videoConstraints?.deviceId;
    const curId =
      typeof cur === "string" ? cur : (cur as { exact?: string })?.exact;
    const nextId =
      typeof next === "string" ? next : (next as { exact?: string })?.exact;
    if (!nextId) return false;
    if (curId === nextId) return false;
    return true;
  }

  render() {
    const { sizeProps, styleProps, videoConstraints, webcamRef, canvasRef } =
      this.props;
    return (
      <div id={"pose-det-webcam-container"} className={styles.container}>
        <div className={styles.preview}>
          <Webcam
            key={(() => {
              const d = videoConstraints?.deviceId;
              if (typeof d === "string") return d;
              return (d as { exact?: string })?.exact ?? "default";
            })()}
            audio={false}
            onUserMediaError={this.props.onCameraError}
            videoConstraints={videoConstraints}
            imageSmoothing={true}
            mirrored={true}
            id={"pose-det-webcam"}
            ref={webcamRef}
            muted={true}
            style={{
              objectFit: "cover",
              zIndex: 8,
              // params
              ...sizeProps,
              ...styleProps,
              // grid props
              gridArea: "overlap",
              alignSelf: "center",
              justifySelf: "center",
            }}
          />
          <canvas
            ref={canvasRef}
            id={"pose-det-webcam-canvas"}
            className={getWebcamBG()}
            style={{
              objectFit: "cover",
              zIndex: 9,
              // params
              ...sizeProps,
              ...styleProps,
              // grid props
              gridArea: "overlap",
              alignSelf: "center",
              justifySelf: "center",
            }}
          />
        </div>
        <button
          type="button"
          className={styles.toggle}
          aria-label="Toggle webcam background"
          onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.classList.toggle(blackBgClass);
            setWebcamBG(
              canvas.classList.contains(blackBgClass) ? blackBgClass : "",
            );
          }}
        >
          <BgColorsOutlinedIcon />
        </button>
      </div>
    );
  }
}
