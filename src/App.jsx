import { HashRouter as Router, Routes, Route } from "react-router-dom";
import DemoAvatar from "components/DemoAvatar";
import GymBuddyDetails from "components/GymBuddyDetails";
import { Layout, Divider } from "antd";
import "antd/dist/antd.css";
import "./style.css";
import Home from "components/Home";
import SocialsPage from "components/SocialsPage";
import LoaderTest from "components/LoaderTest";
import MenuItems from "./components/MenuItems";
import { Link } from "react-router-dom";
import { mainFontColor } from "GlobalStyles";
import { MGLLogo } from "Logos";
import { AppFooter } from "AppFooter";
import PlayPage from "components/Play";
import GymRoomSandbox from "components/Play/GymRoomSandbox";
import PlaySetupPage from "components/Play/PlaySetupPage";
import { paddingLRHeaderFooter } from "./GlobalStyles";
import { MiniGamesPage } from "components/minigames-page";
import { ProgressPage } from "components/user-progrees";

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

const App = () => {
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
        </Header>

        <div style={styles.content}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="minigames" element={<MiniGamesPage />} />
            <Route path="player-progress" element={<ProgressPage />} />
            <Route path="demo-avatar" element={<DemoAvatar />} />
            <Route
              path="gym-buddy-details/:address/:id"
              element={<GymBuddyDetails />}
            />
            <Route path="play" element={<PlayPage />}>
              <Route index element={<PlayPage />} />
              <Route path=":miniGameId" element={<PlayPage />} />
            </Route>
            <Route path="sandbox-play" element={<GymRoomSandbox />}>
              <Route index element={<GymRoomSandbox />} />
              <Route path=":miniGameId" element={<GymRoomSandbox />} />
            </Route>
            <Route path="play-setup" element={<PlaySetupPage />}>
              <Route index element={<PlaySetupPage />} />
              <Route path=":miniGameId" element={<PlaySetupPage />} />
            </Route>
            <Route path="socials" element={<SocialsPage />} />
            <Route path="loader" element={<LoaderTest />} />
          </Routes>
        </div>
      </Router>
      <AppFooter style={styles.footer} />
    </div>
  );
};

export default App;
