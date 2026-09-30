import pageStyles from "./index.styles.module.css";

import { PolygonLogo } from "../Chains/Logos";

const ConnectWalletWarn = () => {
  return (
    <div>
      <div className={pageStyles.walletWarning}>
        <h1 className={pageStyles.title}>Please connect your wallet</h1>
        <p className={pageStyles.description}>
          To see your&nbsp;MetaGymLand NFTs
        </p>
        <p className={pageStyles.subtitle}>
          If it does not look right? Hit refresh
        </p>
      </div>
    </div>
  );
};

const UseCorrectNetworkWarn = () => {
  return (
    <div>
      <div className={pageStyles.networkWarning}>
        <h1 className={pageStyles.title}>Please switch to</h1>
        <h1 className={pageStyles.title}>Polygon Mumbai Testnet Network</h1>
        <div className={pageStyles.actions}>
          <PolygonLogo />,
        </div>
        <p className={pageStyles.description}>
          To see your&nbsp; MetaGymLand NFTs
        </p>
        <p className={pageStyles.subtitle}>
          If it does not look right? Hit refresh
        </p>
      </div>
    </div>
  );
};

export { ConnectWalletWarn, UseCorrectNetworkWarn };
