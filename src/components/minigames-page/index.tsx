import { MINI_GAMES } from "@games/index";

export { MiniGamesPage };

const unlocked = true;

const MiniGamesPage = () => {
  return (
    <div>
      <ul>
        {MINI_GAMES.map((g) => {
          return (
            <li>
              {g}, unlocked={unlocked ? "true" : "false"}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
