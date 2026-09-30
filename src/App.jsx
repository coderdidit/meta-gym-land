import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DemoAvatar from "components/DemoAvatar";
import GymBuddyDetails from "components/GymBuddyDetails";
import { Layout, Divider, ConfigProvider } from "antd";
import "antd/dist/reset.css";
import "./style.css";
import "./styles/tokens.css";
import "./styles/buttons.css";
import Home from "components/Home";
import SocialsPage from "components/SocialsPage";
import LoaderTest from "components/LoaderTest";
import MenuItems from "./components/MenuItems";
import { Link } from "react-router-dom";
import { MGLLogo } from "Logos";
import { AppFooter } from "AppFooter";
import PlayPage from "components/Play";
import GymRoomSandbox from "components/Play/GymRoomSandbox";
import PlaySetupPage from "components/Play/PlaySetupPage";
import { paddingLRHeaderFooter } from "./GlobalStyles";
import { MiniGamesPage } from "components/minigames-page";
import { ProgressPage } from "components/user-progrees";
import styles from "./App.module.css";

const { Header } = Layout;

const App = () => {
  return (
    <div className={styles.appRoot}>
      <ConfigProvider wave={{ disabled: true }}>
        <Router>
          <Header className={styles.header}>
            <div className={styles.headerBrandWrap}>
              <Link to="/" className={styles.headerBrandLink}>
                <MGLLogo />
              </Link>
            </div>
            <MenuItems />
          </Header>

          <div className={styles.content}>
            <Routes>
              <Route index element={<Home />} />
              <Route path="minigames" element={<MiniGamesPage />} />
              <Route path="player-progress" element={<ProgressPage />} />
              <Route path="demo-avatar" element={<DemoAvatar />} />
              <Route
                path="avatars"
                element={<Navigate to="/demo-avatar" replace />}
              />
              <Route
                path="avatars/*"
                element={<Navigate to="/demo-avatar" replace />}
              />
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ConfigProvider>
      <AppFooter style={{ ...paddingLRHeaderFooter }} />
    </div>
  );
};

export default App;
