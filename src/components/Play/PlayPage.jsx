import React, { useContext } from "react";
import Text from "antd/lib/typography/Text";
import { Image } from "antd";
import { AvatarCtx } from "index";
import { NFTsDiv, NFTImg } from "../../GlobalStyles";
import { Redirect } from "react-router";
import GymRoom from "./games/GymRoom";

const PlayPage = () => {
    const [avatar, setAvatar] = useContext(AvatarCtx);
    if (!avatar) {
        return <Redirect to="/avatars" />;
    }

    console.log('Play With Avatar', avatar);
    return (<>
        <div style={{
            fontFamily: "Source Serif Pro",
        }}>
            <Text strong>
                <h1>Welcome in Meta Gym Land Metaverse</h1>
            </Text>
        </div>
        <div style={{
            flexBasis: "100%",
            height: "0px",
        }}>
            {/* break duv in flex box */}
        </div>
        <GymRoom avatar={avatar} />
    </>);
}

export default PlayPage;
