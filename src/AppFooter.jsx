import pageStyles from "./AppFooter.styles.module.css";
import { Divider } from "antd";
import packageJson from "../package.json";

import { MGLSmallLogo, CoderDitiLogo } from "Logos";

export const AppFooter = ({ style }) => {
  return (
    <>
      <Divider className={pageStyles.divider} />

      <footer className={pageStyles.footer} style={style}>
        <div className={pageStyles.brand}>
          <MGLSmallLogo />
        </div>

        <div>
          <div className={pageStyles.heading}>MetaGymLand</div>
          <a className={pageStyles.link} href="/#">
            Home
          </a>
          <br />
          <a
            className={pageStyles.link}
            href="https://metagymland.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </a>
          <br />
          <a
            className={pageStyles.link}
            href="https://docs.metagymland.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Whitepaper
          </a>
        </div>

        <div className={pageStyles.credits}>
          <div className={pageStyles.heading}>Coded by</div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://coderdidit.com"
          >
            <CoderDitiLogo />
          </a>
        </div>
        <div>
          <div className={pageStyles.version}>
            <b>v{packageJson.version}</b>
          </div>
        </div>
      </footer>
    </>
  );
};
