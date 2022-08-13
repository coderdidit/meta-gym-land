import React, { useState, useEffect, useRef, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MoralisProvider } from "react-moralis";
import "./index.css";
import Home from "components/Home";
import { GYM_ROOM_SCENE } from "./games";
import { MglPoseDetector } from "./ai/MglPoseDetector";

// Moralis vals
const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

// Avatar global state
export const AvatarCtx = React.createContext();
const AvatarCtxProvider = ({ children }) => {
  const lastUsedAvatarRaw = window.localStorage.getItem("avatar");
  const lastUsedAvatar = lastUsedAvatarRaw
    ? JSON.parse(lastUsedAvatarRaw)
    : null;
  const [avatar, setAvatar] = useState(lastUsedAvatar);
  return (
    <AvatarCtx.Provider value={[avatar, setAvatar]}>
      {children}
    </AvatarCtx.Provider>
  );
};

// MiniGame selected global state
export const MiniGameCtx = React.createContext();
const MiniGameCtxProvider = ({ children }) => {
  const [minigame, setMinigame] = useState(GYM_ROOM_SCENE);
  return (
    <MiniGameCtx.Provider value={{ minigame, setMinigame }}>
      {children}
    </MiniGameCtx.Provider>
  );
};

// Webcam global state
export const WebcamCtx = React.createContext();
const WebcamCtxProvider = ({ children }) => {
  const [webcamId, _setWebcamId] = useState(null);
  window.webcamIdChangeTS = Date.now();
  const setWebcamId = (wcamID) => {
    _setWebcamId(wcamID);
    window.webcamIdChangeTS = Date.now();
  };

  return (
    <WebcamCtx.Provider
      value={{
        webcamId,
        setWebcamId,
      }}
    >
      {children}
    </WebcamCtx.Provider>
  );
};

const poseDetector = new MglPoseDetector();
// PoseDetector global var
export const PoseDetectorCtx = React.createContext();
const PoseDetectorCtxProvider = ({ children }) => {
  const poseDetectorInitialized = useRef(false);

  useEffect(() => {
    const initPoseDetector = async () => {
      await poseDetector.initialize();
    };
    if (!poseDetectorInitialized.current) {
      initPoseDetector().catch(console.error);
      poseDetectorInitialized.current = true;
    }

    return () => {
      poseDetector.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PoseDetectorCtx.Provider value={{ poseDetector }}>
      {children}
    </PoseDetectorCtx.Provider>
  );
};

const Application = () => {
  const isServerInfo = APP_ID && SERVER_URL ? true : false;
  //Validate
  if (!APP_ID || !SERVER_URL)
    throw new Error(
      "Missing Moralis Application ID or Server URL. Make sure to set your .env file.",
    );
  if (isServerInfo)
    return (
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <PoseDetectorCtxProvider>
          <AvatarCtxProvider>
            <WebcamCtxProvider>
              <MiniGameCtxProvider>
                <App isServerInfo />
              </MiniGameCtxProvider>
            </WebcamCtxProvider>
          </AvatarCtxProvider>
        </PoseDetectorCtxProvider>
      </MoralisProvider>
    );
  else {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Home />
      </div>
    );
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Application />
  </StrictMode>,
);
