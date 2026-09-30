import React from "react";
import { Button, Image } from "antd";
import { PlaySquareOutlined } from "@ant-design/icons";
import { pageTitleStyle, pageTitle2Style } from "GlobalStyles";
import { Link } from "react-router-dom";
import homePageImg from "./assets/home_page/home_page_img.png";
import howItWorks1 from "./assets/home_page/how_it_works_1.png";
import howItWorks2 from "./assets/home_page/how_it_works_2.png";
import howItWorks3 from "./assets/home_page/how_it_works_3.png";
import { SocialsComponent } from "./SocialsPage";
import { MGLSmallLogo } from "../Logos";
import stylesCss from "./Home.module.css";

export default function Home() {
  return (
    <div>
      <section className={stylesCss.hero}>
        <div className={stylesCss.heroContent}>
          <div className={stylesCss.heroTitle} style={pageTitleStyle}>
            Ready to get started?
          </div>
          <div className={stylesCss.heroSubtitle}>
            Follow steps below, have fun and get fit!
          </div>

          <div className={stylesCss.heroCtaWrap}>
            {/* <Button
              type="primary"
              style={{
                ...BtnPrimary,
                marginRight: "1rem",
              }}
            >
              <Link to="/demo-avatar">Play now</Link>
            </Button> */}
            <Button className="mgl-btn mgl-btn-info">
              <Link to="/demo-avatar">Try with Demo GymBuddy</Link>
            </Button>
          </div>
        </div>

        <Image
          preview={false}
          src={homePageImg}
          alt=""
          className={stylesCss.heroImage}
        />
      </section>

      <section className={stylesCss.howItWorksSection}>
        <div className={stylesCss.howItWorksHeader}>
          <div style={pageTitle2Style}>How it works?</div>

          <Button
            className={`mgl-btn mgl-btn-secondary ${stylesCss.watchVideoBtn}`}
            onClick={() =>
              window.open(
                "https://www.youtube.com/watch?v=vTWeE7YJnj4",
                "_blank",
              )
            }
          >
            <PlaySquareOutlined /> Watch video
          </Button>
        </div>
        <div className={stylesCss.howItWorksGrid}>
          <div>
            <Image
              preview={false}
              src={howItWorks1}
              alt=""
              className={stylesCss.howItWorksImage}
            />
            <p className={stylesCss.stepTitleNoMargin}>
              1. Connect your wallet (deprecated)
            </p>
            <p>We used to be a Web3 App</p>
            <p>Now it is not necessary.</p>
          </div>
          <div>
            <Image
              preview={false}
              src={howItWorks2}
              alt=""
              className={stylesCss.howItWorksImage}
            />
            <p className={stylesCss.stepTitle}>
              2. Buy or generate your GymBuddy
            </p>
            <p>Not available right now</p>
            <p>Just try DemoGym Buddy</p>
          </div>
          <div>
            <Image
              preview={false}
              src={howItWorks3}
              alt=""
              className={stylesCss.howItWorksImage}
            />
            <p className={stylesCss.stepTitle}>
              3. Enable your Webcam and join MetaGymLand
            </p>

            <p>Click 'Play with me' on selected GymBuddy</p>
            <p>and decide which Webcam you would like</p>
            <p>to enable to play MetaGymLand</p>
          </div>
        </div>
      </section>
      <div className={stylesCss.spacer} />

      <section className={stylesCss.socialSection}>
        <div className={stylesCss.socialInner}>
          <SocialsComponent />
        </div>

        <div className={stylesCss.contactWrap}>
          <MGLSmallLogo />
          <div className={stylesCss.contactEmailWrap}>
            <a
              className={stylesCss.contactEmail}
              href="mailto:metagymland@gmail.com"
            >
              metagymland@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
