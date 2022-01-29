import React, { useContext } from "react";
import { MiniGameCtx } from "index";
import { MGLSmallLogo } from "Logos";
import { SettingFilled, InfoCircleFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { mainBgColor } from "../../../GlobalStyles";
import { Popover } from 'antd';
import {
    GYM_ROOM_SCENE,
    SPACE_STRETCH_SCENE,
    FLY_FIT_SCENE,
    CHART_SQUATS,
    MATRIX
} from "./shared";
import moveDownPng from "./assets/images/move_down.png";
import moveUpPng from "./assets/images/move_up.png";
import moveUp2Png from "./assets/images/move_up2.png";
import moveLeftPng from "./assets/images/move_left.png";
import moveRightPng from "./assets/images/move_right.png";
import pumpThePricePng from "./assets/images/pump_the_price.png";
import moveForwPng from "./assets/images/move_forward.png";
import turnLeftPng from "./assets/images/turn_left.png";
import turnRightPng from "./assets/images/turn_right.png";

const moveUpImg = <img src={moveUpPng} alt="" />;
const moveUp2Img = <img src={moveUp2Png} alt="" />;
const moveDownImg = <img src={moveDownPng} alt="" />;
const moveLeftImg = <img src={moveLeftPng} alt="" />;
const moveRightImg = <img src={moveRightPng} alt="" />;
const pumpThePriceImg = <img src={pumpThePricePng} alt="" />;

const moveForwImg = <img src={moveForwPng} alt="" />;
const turnLeftImg = <img src={turnLeftPng} alt="" />;
const turnRightImg = <img src={turnRightPng} alt="" />;

const beCreative = <div style={{ padding: "0.3rem" }}>
    <hr />
    <div><b>Be creative!</b></div>
    <div>Other simmilar moves</div>
    <div>will workl as well</div>
</div>;


const MiniGameInstructions = new Map([
    [GYM_ROOM_SCENE, {
        title: (
            <>
                <p>How to play</p>
                <p><b>MetaGym room</b></p>
            </>), content: (
                <>
                    <div style={{ padding: "0.3rem" }}>
                        {moveUp2Img}
                    </div>
                    <div style={{ padding: "0.3rem" }}>
                        {moveDownImg}
                    </div>
                    <div style={{ padding: "0.3rem" }}>
                        {moveLeftImg}
                    </div>
                    <div style={{ padding: "0.3rem" }}>
                        {moveRightImg}
                    </div>
                    {beCreative}
                </>
            )
    }],
    [SPACE_STRETCH_SCENE, {
        title: (
            <>
                <p>How to play</p>
                <p><b>Space stretch</b></p>
            </>)
        , content: (
            <>
                <div style={{ padding: "0.3rem" }}>
                    {moveUpImg}
                </div>
                <div style={{ padding: "0.3rem" }}>
                    <span style={{ backgroundColor: "antiquewhite", padding: "0.2rem", borderRadius: "3px" }}>
                        gravity</span>
                    &nbsp;
                    <span>MOVE DOWN</span>
                </div>
                <div style={{ padding: "0.3rem" }}>
                    {moveLeftImg}
                </div>
                <div style={{ padding: "0.3rem" }}>
                    {moveRightImg}
                </div>
                {beCreative}
            </>
        )
    }],
    [FLY_FIT_SCENE, {
        title: (
            <>
                <p>How to play</p>
                <p><b>Fly fit</b></p>
            </>), content: (
                <>
                    <div style={{ padding: "0.3rem" }}>
                        {moveForwImg}
                    </div>
                    <div style={{ padding: "0.3rem" }}>
                        {turnLeftImg}
                    </div>
                    <div style={{ padding: "0.3rem" }}>
                        {turnRightImg}
                    </div>
                    {beCreative}
                </>
            )
    }],
    [CHART_SQUATS, {
        title: (
            <>
                <p>How to play</p>
                <p><b>Chart squats</b></p>
            </>), content: (
                <>
                    <div style={{ padding: "0.3rem" }}>
                        {pumpThePriceImg}
                    </div>
                    {beCreative}
                </>
            )
    }],
]);

MiniGameInstructions.set(MATRIX, MiniGameInstructions.get(GYM_ROOM_SCENE));

const SideMenu = () => {
    const { minigame } = useContext(MiniGameCtx);

    const miniGameInstructions = () => {
        const i = MiniGameInstructions.get(minigame);
        return (<>
            <Popover
            style={{
                // textAlign: "right",
            }}
                placement="right"
                title={i?.title}
                content={i?.content}
                trigger="click">
                <InfoCircleFilled style={{
                    fontSize: "20px",
                    color: "#FFF",
                }} />
            </Popover>
        </>);
    }

    return (<div
        style={{
            width: "60px",
            padding: "1rem",
            height: "100%",
            position: "fixed",
            left: "0",
            top: "0",
            backgroundColor: mainBgColor,
        }}
    >
        <div style={{
            width: "inherit",
            marginLeft: "-5px",
            marginBottom: "1rem",
        }}>
            <Link to="/">
                <MGLSmallLogo
                    width={"35"}
                    height={"35"}
                    viewBox={"0 0 16 16"}
                />
            </Link>
        </div>
        <div>
            <Link to="/play-setup">
                <SettingFilled style={{
                    fontSize: "22px",
                    color: "#FFF",
                }} />
            </Link>
        </div>
        <div style={{
            marginTop: "14rem",
        }}>
            {miniGameInstructions()}
        </div>
    </div>);
}

export default SideMenu;
