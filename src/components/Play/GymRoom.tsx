import React, { useState, useEffect, useContext } from "react";
import { useMoralis } from "react-moralis";
import { GameInstance, IonPhaser } from "@ion-phaser/react";
import { MiniGameCtx } from "index";
import PoseDetWebcam from "components/Webcam/PoseDetWebcam";
import SideMenu from "./GymRoomSideMenu";
import { getGameConfig, preBoot } from "games/game";

type ionGameInstance = GameInstance | undefined;

const GymRoom = ({
  avatar,
  useWebcam = true,
  miniGameId = null,
}: {
  avatar: any;
  useWebcam: boolean;
  miniGameId: string | null;
}) => {
  // run game
  const [initialised, setInitialised] = useState(true);
  // needs to be undefined at start, otherwise 2 game canvases will load
  const [config, setConfig] = useState(undefined as ionGameInstance);
  const { setMinigame } = useContext(MiniGameCtx);
  const { user } = useMoralis();

  const startGame = () => {
    if (miniGameId) {
      setMinigame(miniGameId);
    }

    const ionGameConfig = {
      ...getGameConfig(),
      callbacks: {
        preBoot: (game: Phaser.Game) => {
          // Makes sure the game doesnt create another game on rerender
          setInitialised(false);
          preBoot({
            game,
            avatar,
            setMinigame,
            pickedMiniGame: miniGameId,
            user,
          });
        },
      },
    } as ionGameInstance;
    setConfig(ionGameConfig);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      startGame();
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <IonPhaser
      initialize={initialised}
      game={config}
      id="phaser-app"
      style={{
        position: "absolute",
        top: "0px",
        bottom: "0px",
        width: "100%",
        height: "100%",
        zIndex: "1",
      }}
    >
      <SideMenu />

      {useWebcam && (
        <div
          style={{
            position: "fixed",
            top: "1%",
            left: "45%",
            bottom: "0px",
          }}
        >
          <PoseDetWebcam
            sizeProps={{
              width: "220px",
              height: "auto",
              borderRadius: "14px",
            }}
            styleProps={{
              boxShadow: "0 0 10px 2px #202020",
            }}
          />
        </div>
      )}
    </IonPhaser>
  );
};

export default GymRoom;
