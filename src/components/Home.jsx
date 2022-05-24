import { Divider } from "antd";
import React from "react";
import { Button, Image } from 'antd';
import { PlaySquareOutlined } from "@ant-design/icons";
import {
  brightFontCol,
  pageTitleStyle,
  pageTitle2Style,
  descriptionStyle,
  paddingLRContent,
} from "GlobalStyles";
import { Link } from "react-router-dom";
import { BtnPrimary, BtnInfo } from "../GlobalStyles";
import homePageImg from "./assets/home_page/home_page_img.png";
import howItWorks1 from "./assets/home_page/how_it_works_1.png";
import howItWorks2 from "./assets/home_page/how_it_works_2.png";
import howItWorks3 from "./assets/home_page/how_it_works_3.png";
import { SocialsComponent } from "./SocialsPage";
import {
  MGLSmallLogo
} from "../Logos";

const styles = {
  homeGlobal: {
    color: brightFontCol,
  },
  titleText: {
    ...pageTitleStyle,
  },
  text: {
    ...descriptionStyle,
  },
  card: {
    border: "none",
    borderBottom: "none",
    background: "none",
    color: brightFontCol,
    lineHeight: "0.8",
  }
};

const howItWorksImagesSize = "70%";

export default function Home() {
  return (
    <div
      style={{
        ...paddingLRContent,
      }}
    >
      <section style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        paddingLeft: "6rem",
        paddingRight: "6rem",
      }}>
        <div style={{
        }}>
          <div style={{
            ...styles.titleText,
            paddingTop: "1rem",
          }}>
            Ready to get started?
          </div>
          <div style={{
            ...styles.text,
          }}>
            Follow steps below, have fun and get fit!
          </div>

          <div style={{
            paddingTop: "4.5rem",
          }}>
            <Button
              type="primary"
              style={{
                ...BtnPrimary,
                marginRight: "1rem",
              }}
            >
              <Link to="/avatars">
                Play now
              </Link>
            </Button>
            <Button style={{
              ...BtnInfo,
            }}>
              <Link to="/demo-avatar">
                Try with Demo GymBuddy
              </Link>
            </Button>
          </div>
        </div>

        <Image
          preview={false}
          src={homePageImg}
          alt=""
          className="demo-video"
          style={{
            width: "100%",
            padding: "0px",
            margin: "0px",
          }}
        />
      </section>

      <section>
        <div style={{
          textAlign: "center",
          padding: "1rem 1rem 1rem 1rem",
        }}>
          <div style={pageTitle2Style}>
            How it works?
          </div>

          <Button
            style={{
              ...BtnInfo,
              margin: "1rem",
            }}
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=KDhVAucOtOg",
                "_blank"
              )
            }
          >
            <PlaySquareOutlined /> Watch video
          </Button>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          justifyContent: "center",
          textAlign: "center",
          ...descriptionStyle,
        }}>
          <div>
            <Image
              preview={false}
              src={howItWorks1}
              alt=""
              className="demo-video"
              style={{
                padding: "0px",
                margin: "0px",
              }}
            />
            <p style={{
              fontWeight: 500,
              // marginBottom: "1rem",
            }}>1. Connect your wallet</p>
            <p>Currently, we are on Avalanche fuji testnet.</p>
          </div>
          <div>
            <Image
              preview={false}
              src={howItWorks2}
              alt=""
              className="demo-video"
              style={{
                
                padding: "0px",
                margin: "0px",
              }}
            />
            <p style={{
              fontWeight: 500,
              marginBottom: "1rem",
            }}>2. Buy or mint your GymBuddy</p>
            <p>You can buy your GymBuddy in</p>
            <p>'Marketplace' or Mint on 'Mint' page</p>
            <p>Play with your existing GymBuddies</p>
            <p>or try MetaGymLand with Free demo GymBuddy</p>
          </div>
          <div>
            <Image
              preview={false}
              src={howItWorks3}
              alt=""
              className="demo-video"
              style={{
                padding: "0px",
                margin: "0px",
              }}
            />
            <p style={{
              fontWeight: 500,
              marginBottom: "1rem",
            }}>3. Enable your Webcam and join MetaGymLand</p>

            <p>Click 'Play with me' on selected GymBuddy</p>
            <p>and decide which Webcam you would like</p>
            <p>to enable to play MetaGymLand</p>
          </div>
        </div>
      </section>
      <div style={{
        flexBasis: "100%",
      }} />
      <Divider style={{
        backgroundColor: "#032139",
      }}></Divider>
      <section>
        <div style={{
          marginTop: "3rem",
          marginBottom: "3rem",
          alignItems: "center",
          justifyContent: "center"
        }}>

          <div style={{
            display: "grid",
            placeItems: "center",
          }}>
            <SocialsComponent />
          </div>

          <div style={{
            marginTop: "2rem",
            textAlign: "center",
            fontSize: "18px",
          }}>
            <MGLSmallLogo
              width={"25"}
              height={"25"}
              viewBox={"0 0 16 16"}
            />
            <div style={{
              opacity: 0.8,
            }}>
              <a style={{
                textDecoration: "none",
                color: brightFontCol,
              }}
                href="mailto:metagymland@gmail.com">metagymland@gmail.com</a>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
