import { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Account from "components/Account/Account";
import Chains from "components/Chains";
import NFTBalance from "components/NFTBalance";
import DemoAvatar from "components/DemoAvatar";
import GymBuddyDetails from "components/GymBuddyDetails";
import { Layout, Divider } from "antd";
import "antd/dist/antd.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import Home from "components/Home";
import SocialsPage from "components/SocialsPage";
import Marketplace from "components/Marketplace";
import MintGymBuddyPage from "components/MintGymBuddy";
import LoaderTest from "components/LoaderTest";
import MenuItems from "./components/MenuItems";
import { Link } from "react-router-dom";
import { mainFontColor } from "GlobalStyles";
import { MGLLogo } from "Logos";
import { AppFooter } from "AppFooter";
import PlayPage from "components/Play";
import GymRoomSandbox from "components/Play/GymRoomSandbox";
import PlaySetupPage from "components/Play/PlaySetupPage";
import {
  ConnectWalletWarn,
  UseCorrectNetworkWarn,
} from "./components/Warrnings";
import RewardsPage from "./components/Rewards";
import { MainChainID } from "MglNftMetadata";
import { paddingLRHeaderFooter } from "./GlobalStyles";
import BitKeepConnector from "./components/Account/BitKeepConnector";

const { Header } = Layout;

const styles = {
  header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    ...paddingLRHeaderFooter,
    background: "none",
    height: "60px",
  },
  content: {
    fontFamily: "Roboto, sans-serif",
    marginTop: "10px",
    minHeight: "30vh",
  },
  footer: {
    ...paddingLRHeaderFooter,
  },
  headerRight: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    fontSize: "17px",
    fontWeight: "500",
  },
  homeLink: {
    height: 0,
  },
};

// eslint-disable-next-line no-unused-vars
const App = ({ isServerInfo }) => {
  const {
    isWeb3Enabled,
    enableWeb3,
    isAuthenticated,
    isWeb3EnableLoading,
    chainId,
  } = useMoralis();
  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) {
      if (connectorId === "bitkeep") {
        enableWeb3({ provider: connectorId, connector: BitKeepConnector });
      } else {
        enableWeb3({ provider: connectorId });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  const resolveAvatarsRouteElement = () => {
    if (isAuthenticated && chainId === MainChainID) {
      return <NFTBalance />;
    } else if (isAuthenticated && chainId !== MainChainID) {
      return <UseCorrectNetworkWarn />;
    } else {
      return <ConnectWalletWarn />;
    }
  };

  return (
    <div
      style={{
        background: "none",
        fontFamily: "Roboto, sans-serif",
        color: mainFontColor,
      }}
    >
      <Router>
        <Header style={styles.header}>
          <div
            style={{
              marginTop: "2rem",
              background: "none",
            }}
          >
            <Link to="/" style={styles.homeLink}>
              <MGLLogo />
            </Link>
          </div>
          <MenuItems />
          <div style={styles.headerRight}>
            <Divider
              type="vertical"
              style={{
                height: "1.8em",
                backgroundColor: mainFontColor,
              }}
            />
            <NativeBalance />
            <Account />
            <Chains />
          </div>
        </Header>

        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/avatars" element={resolveAvatarsRouteElement()} />
            <Route path="/demo-avatar" element={<DemoAvatar />} />
            <Route
              path="/gym-buddy-details/:address/:id"
              element={<GymBuddyDetails />}
            />
            <Route path="/play/:miniGameId?" element={<PlayPage />} />
            <Route
              path="/sandbox-play/:miniGameId?"
              element={<GymRoomSandbox />}
            />
            <Route path="/socials" element={<SocialsPage />} />
            <Route path="/loader" element={<LoaderTest />} />
            <Route
              path="/play-setup/:miniGameId?"
              element={<PlaySetupPage />}
            />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/mint" element={<MintGymBuddyPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route
              path="/nonauthenticated"
              element={<>Please login using the "Authenticate" button</>}
            />
          </Routes>
        </div>
      </Router>
      <AppFooter style={styles.footer} />
    </div>
  );
};

export default App;
