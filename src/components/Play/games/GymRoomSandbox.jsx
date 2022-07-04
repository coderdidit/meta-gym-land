import React from "react";
import GymRoom from "./GymRoom";

const GymRoomSandbox = () => {
  const avatar = {
    uri: "https://gateway.pinata.cloud/ipfs/QmPUQSULAxGXK321PMJKE5Qcs3xHvRuxDzDUjoB8g9cmzD/gbpx10.png",
    tokenAddress: "123",
    tokenId: "1",
    snapARLink:
      "https://www.snapchat.com/unlock/?type=SNAPCODE&uuid=c890d0e0b700469598bb86f34b6c4b64&metadata=01",
  };
  return <GymRoom avatar={avatar} useWebcam={false} />;
};

export default GymRoomSandbox;
