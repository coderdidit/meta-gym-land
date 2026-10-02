import pageStyles from "./index.styles.module.css";
import { LockFilled, StarFilled, UnlockFilled } from "@ant-design/icons";
import { MINI_GAMES } from "@games/index";

import { Link } from "react-router-dom";

export { MiniGamesPage };

const miniGamesMapping = new Map([
  ["space_stretch", "Space Stretch"],
  ["fly_fit", "Sky Workout"],
  ["snap", "Snapchat"],
  ["chart_squats", "Chart Squats"],
  ["matrix", "Mystery"],
  ["gym_canals", "Gym Canals"],
  ["invaders", "Space Invaders"],
  ["kayaks", "Kayaks"],
  ["runner", "Runner"],
  ["race_track", "Race Track"],
]);

const unlocked = true;
const StarFilledIcon = StarFilled as any;
const UnlockFilledIcon = UnlockFilled as any;
const LockFilledIcon = LockFilled as any;

const MiniGamesPage = () => {
  return (
    <div className={pageStyles.page}>
      <section className={pageStyles.title}>
        Try MetaGymLand Minigames{" "}
        <StarFilledIcon className={pageStyles.titleIcon} />
      </section>
      <section className={pageStyles.description}>
        Progress with unlocked games to unlock the locked ones
      </section>
      <p>
        <Link to="/arena">
          Try Arena: dodge, block and strike in a body-controlled battle
        </Link>
      </p>
      <section className={pageStyles.gamesSection}>
        <div className={pageStyles.games}>
          <div
            key={"gym_room"}
            className={[pageStyles.gameCard, !unlocked && pageStyles.locked]
              .filter(Boolean)
              .join(" ")}
          >
            <Link to="/play-setup">Gym Room</Link>
            &nbsp;&nbsp;
            <UnlockFilledIcon className={pageStyles.unlockedIcon} />
          </div>
          {MINI_GAMES.map((g) => {
            const link = `/play-setup/${g}`;
            return (
              <div
                key={g}
                className={[pageStyles.gameCard, !unlocked && pageStyles.locked]
                  .filter(Boolean)
                  .join(" ")}
              >
                <Link to={link}>{miniGamesMapping.get(g) ?? ""}</Link>
                &nbsp;&nbsp;
                {unlocked ? (
                  <UnlockFilledIcon className={pageStyles.unlockedIcon} />
                ) : (
                  <LockFilledIcon />
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
