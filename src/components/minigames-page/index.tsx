import { LockFilled, SmileFilled, UnlockFilled } from "@ant-design/icons";
import { MINI_GAMES } from "@games/index";
import { descriptionStyle, pageTitleStyle } from "GlobalStyles";

export { MiniGamesPage };

const unlocked = true;

const MiniGamesPage = () => {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "3rem",
        marginBottom: "4rem",
      }}
    >
      <section
        style={{
          ...pageTitleStyle,
          marginBottom: "1rem",
        }}
      >
        Try MetaGymLand Minigames <SmileFilled style={{ color: "#FFBE59" }} />
      </section>
      <section
        style={{
          marginBottom: "4rem",
          ...descriptionStyle,
        }}
      >
        Progress with unlocked games to unlock the locked ones
      </section>
      <section
        style={{
          ...descriptionStyle,
          marginBottom: "15rem",
          padding: "0 5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {MINI_GAMES.map((g) => {
            return (
              <div
                style={{
                  flex: "0 0 33.333333%",
                  margin: "5px",
                  height: "100px",
                  backgroundColor: "#F7F7F8",
                  border: "1px solid #898988",
                  padding: "1rem",
                }}
              >
                {g}&nbsp;&nbsp;
                {unlocked ? (
                  <UnlockFilled style={{ color: "#4290FC" }} />
                ) : (
                  <LockFilled />
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
