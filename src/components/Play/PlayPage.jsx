import { useContext } from "react";
import { useParams } from "react-router";
import { AvatarCtx } from "index";
import { Navigate } from "react-router-dom";
import GymRoom from "./GymRoom";

const PlayPage = () => {
  const [avatar] = useContext(AvatarCtx);
  const { miniGameId } = useParams();
  if (!avatar) {
    return <Navigate to="/avatars" />;
  }
  return (
    <>
      <GymRoom avatar={avatar} miniGameId={miniGameId} />
    </>
  );
};

export default PlayPage;
