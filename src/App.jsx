import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DemoAvatar from "components/DemoAvatar";
import GymBuddyDetails from "components/GymBuddyDetails";
import { Layout, ConfigProvider } from "antd";
import "antd/dist/reset.css";
import "./style.css";
import "./styles/variables.css";
import { appTheme } from "./styles/theme";
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
import { MiniGamesPage } from "components/minigames-page";
import { ProgressPage } from "components/user-progrees";
import styles from "./App.module.css";
import MovementLab from "./components/movement-lab/MovementLab";
import Arena from "./components/movement-lab/Arena";
import BodyArena from "./components/body-arena/BodyArena";

const { Header } = Layout;

const App = () => {
  return (
    <div className={styles.appRoot}>
      <ConfigProvider theme={appTheme} wave={{ disabled: true }}>
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
              <Route path="movement-lab" element={<MovementLab />} />
              <Route path="arena" element={<Arena />} />
              <Route
                path="mirror_arena"
                element={<BodyArena key="mirror" presentation="mirror" />}
              />
              <Route
                path="dark_arena"
                element={<BodyArena key="dark" presentation="dark" />}
              />
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
      <AppFooter />
    </div>
  );
};

export default App;
