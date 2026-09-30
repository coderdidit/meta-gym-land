import { useContext } from "react";
import { useParams } from "react-router";
import { AvatarCtx } from "index";
import { Navigate } from "react-router-dom";
import { Image, Button } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { NFTImg, BreakFlexDiv } from "../../GlobalStyles";
import { SelectWebcam } from "components/Webcam/SelectWebcam";
import { WebcamCtx } from "index";
import PoseDetWebcam from "components/Webcam/PoseDetWebcam";
import styles from "./PlaySetupPage.module.css";

const PlaySetupPage = () => {
  const { miniGameId } = useParams();
  const [avatar] = useContext(AvatarCtx);
  const { webcamId } = useContext(WebcamCtx);

  if (!avatar) {
    return <Navigate to="/demo-avatar" />;
  }

  const linkToJoinMetaGymLand = () => {
    if (miniGameId) {
      return `/play/${miniGameId}`;
    }
    return "/play";
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.grid}>
          <div>
            <h1 className={styles.title}>
              <b>Setup your webcam</b>
            </h1>
            <div className={styles.avatarWrap}>
              <Image
                preview={false}
                src={avatar?.coverUri || "error"}
                alt=""
                style={{
                  ...NFTImg,
                  borderRadius: "20px",
                }}
                className={styles.avatarImage}
              />
            </div>
            <div className={styles.backWrap}>
              <Button
                className="mgl-btn mgl-btn-primary"
                onClick={() => window.history.back()}
              >
                <LeftOutlined />
                Back
              </Button>
            </div>
          </div>

          <div>
            <PoseDetWebcam
              sizeProps={{
                maxWidth: "380px",
                height: "auto",
                margin: "0",
              }}
              styleProps={{
                boxShadow: "0 0 10px 2px #202020",
                borderRadius: "25px",
              }}
            />

            <div className={styles.cameraWrap}>
              <p>Please select your webcam&nbsp;📷</p>

              <div className={styles.selectWrap}>
                <SelectWebcam width={"15rem"} />
              </div>
              <div
                style={{
                  ...BreakFlexDiv,
                }}
              ></div>
              <p className={styles.hint}>
                <u>Having trouble with your video?</u>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            disabled={webcamId == null}
            className={`mgl-btn mgl-btn-info ${styles.joinBtn}`}
          >
            <Link to={linkToJoinMetaGymLand()}>
              Join MetaGymLand <RightOutlined />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaySetupPage;
