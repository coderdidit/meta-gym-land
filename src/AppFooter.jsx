import { Divider } from "antd";
import packageJson from "../package.json";
import { mainFontColor, descriptionStyle } from "GlobalStyles";
import { MGLSmallLogo, CoderDitiLogo, PoweredByPolygonLogo } from "Logos";

export const AppFooter = ({ style }) => {
  return (
    <>
      <Divider
        style={{
          ...style,
          backgroundColor: mainFontColor,
          marginTop: 0,
        }}
      />

      <footer
        style={{
          ...style,
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "9fr 1fr 1fr 1fr 1fr",
          lineHeight: 2,
        }}
      >
        <div
          style={{
            textAlign: "left",
          }}
        >
          <MGLSmallLogo />
        </div>

        <div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            MetaGymLand
          </div>
          <a
            style={{
              ...descriptionStyle,
              textDecoration: "none",
              color: mainFontColor,
            }}
            href="/#"
          >
            Home
          </a>
          <br />
          <a
            style={{
              ...descriptionStyle,
              textDecoration: "none",
              color: mainFontColor,
            }}
            href="https://metagymland.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </a>
          <br />
          <a
            style={{
              ...descriptionStyle,
              textDecoration: "none",
              color: mainFontColor,
            }}
            href="https://docs.metagymland.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Whitepaper
          </a>
        </div>

        {/* <div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://polygon.technology"
          >
            <PoweredByPolygonLogo
              style={{
                border: `1px solid ${mainFontColor}`,
                borderRadius: "15px",
              }}
            />
          </a>
        </div> */}

        <div style={{ color: mainFontColor }}>
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Coded by
          </div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://coderdidit.com"
          >
            <CoderDitiLogo />
          </a>
        </div>
        <div>
          <div
            style={{
              textAlign: "right",
            }}
          >
            <b>v{packageJson.version}</b>
          </div>
        </div>
      </footer>
    </>
  );
};
