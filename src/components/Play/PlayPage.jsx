import React, { useContext } from "react";
import { AvatarCtx } from "index";
import { Redirect } from "react-router";
import GymRoom from "./games/GymRoom";

const PlayPage = () => {
    const [avatar] = useContext(AvatarCtx);
    if (!avatar) {
        return <Redirect to="/avatars" />;
    }
    return (<div><GymRoom avatar={avatar} /></div>);
}

export default PlayPage;
