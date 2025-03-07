import { Component } from "react";
import Webcam from "react-webcam";
import { BgColorsOutlined } from "@ant-design/icons";
import { setWebcamBG, getWebcamBG } from "./state";

const blackBgClass = "black-bg";

interface PoseDetWebcamInnerProps {
  videoConstraints: MediaTrackSettings;
  sizeProps: any;
  styleProps: any;
  webcamRef: any;
  canvasRef: any;
}

export class PoseDetWebcamInner extends Component<
  PoseDetWebcamInnerProps,
  unknown
> {
  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(nextProps: PoseDetWebcamInnerProps, _nextState: any) {
    // fixing unnecessary webcam re-render
    const curDeviceId = this.props.videoConstraints?.deviceId;
    const nextDeviceId = nextProps.videoConstraints?.deviceId;
    if (!nextDeviceId) return false;
    if (curDeviceId === nextDeviceId) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { sizeProps, styleProps, videoConstraints, webcamRef, canvasRef } =
      this.props;
    return (
      <div
        id={"pose-det-webcam-container"}
        style={{
          display: "grid",
          gridTemplateRows: "1fr",
          gridTemplateColumns: "1fr",
          gridTemplateAreas: "overlap",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr",
            gridTemplateColumns: "1fr",
            gridTemplateAreas: "overlap",
          }}
        >
          <Webcam
            audio={false}
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
        <div
          id={"pose-det-webcam-canvas-cam-toggle-div"}
          style={{
            zIndex: 10,
            cursor: "pointer",
          }}
        >
          <BgColorsOutlined
            id={"pose-det-webcam-canvas-cam-toggle-icon"}
            onClick={() => {
              const icon = document.getElementById(
                "pose-det-webcam-canvas-cam-toggle-icon",
              );
              const webCamCanvas = document.getElementById(
                "pose-det-webcam-canvas",
              );
              if (webCamCanvas && icon) {
                if (webCamCanvas.className !== blackBgClass) {
                  webCamCanvas.className = blackBgClass;
                } else {
                  webCamCanvas.className = "";
                  icon.className = "";
                }
                setWebcamBG(webCamCanvas.className);
              }
            }}
          />
        </div>
      </div>
    );
  }
}
