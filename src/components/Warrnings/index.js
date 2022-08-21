import {
  pageTitleStyle,
  pageTitle3Style,
  descriptionStyle,
} from "../../GlobalStyles";
import { PolygonLogo } from "../Chains/Logos";

const ConnectWalletWarn = () => {
  return (
    <div>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          marginTop: "4rem",
        }}
      >
        <h1
          style={{
            ...pageTitleStyle,
          }}
        >
          Please connect your wallet
        </h1>
        <p
          style={{
            ...descriptionStyle,
          }}
        >
          To see your&nbsp;MetaGymLand NFTs
        </p>
        <p
          style={{
            ...pageTitle3Style,
            fontWeight: 700,
            marginTop: "3rem",
          }}
        >
          If it does not look right? Hit refresh
        </p>
      </div>
    </div>
  );
};

const UseCorrectNetworkWarn = () => {
  return (
    <div>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          marginTop: "4rem",
          marginBottom: "4rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            ...pageTitleStyle,
          }}
        >
          Please switch to
        </h1>
        <h1
          style={{
            ...pageTitleStyle,
          }}
        >
          Polygon Mumbai Testnet Network
        </h1>
        <div
          style={{
            margin: "1rem",
          }}
        >
          <PolygonLogo />,
        </div>
        <p
          style={{
            ...descriptionStyle,
          }}
        >
          To see your&nbsp; MetaGymLand NFTs
        </p>
        <p
          style={{
            ...pageTitle3Style,
            fontWeight: 700,
            marginTop: "3rem",
          }}
        >
          If it does not look right? Hit refresh
        </p>
      </div>
    </div>
  );
};

export { ConnectWalletWarn, UseCorrectNetworkWarn };
