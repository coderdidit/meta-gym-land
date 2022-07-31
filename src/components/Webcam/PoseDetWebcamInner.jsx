import { Component } from "react";
import Webcam from "react-webcam";
import { BgColorsOutlined } from "@ant-design/icons";
import { setWebcamBG, getWebcamBG } from "./state";

const blackBgClass = "black-bg";
const grennClass = "green-color";

export class PoseDetWebcamInner extends Component {
  // eslint-disable-next-line no-unused-vars
  shouldComponentUpdate(nextProps, nextState) {
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
          style={{
            marginTop: "-25px",
            marginLeft: "6%",
            zIndex: 10,
            cursor: "pointer",
          }}
        >
          <BgColorsOutlined
            id={"pose-det-webcam-canvas-cam-toggle-icon"}
            className={getWebcamBG() !== "" ? grennClass : ""}
            onClick={() => {
              const icon = document.getElementById(
                "pose-det-webcam-canvas-cam-toggle-icon",
              );
              const webCamCanvas = document.getElementById(
                "pose-det-webcam-canvas",
              );
              if (webCamCanvas.className !== blackBgClass) {
                webCamCanvas.className = blackBgClass;
                icon.className = grennClass;
              } else {
                webCamCanvas.className = "";
                icon.className = "";
              }
              setWebcamBG(webCamCanvas.className);
            }}
          />
        </div>
      </div>
    );
  }
}
