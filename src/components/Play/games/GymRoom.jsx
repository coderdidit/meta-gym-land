import React, { useState, useEffect, useContext } from "react";
import Phaser from "phaser";
import { IonPhaser } from "@ion-phaser/react";
import { GymRoomScene } from "./GymRoomScene";
import { SpaceStretchScene } from "./SpaceStretchScene";
import { FlyFitScene } from "./FlyFitScene";
import { ChartSquats } from "./ChartSquats";
import { BootScene } from "./BootScene";
import { WebcamCtx, MiniGameCtx } from "index";
import PoseDetWebcam from "components/Webcam/PoseDetWebcam";
import { MGLSmallLogo } from "Logos";
import { SettingFilled, InfoCircleFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { mainBgColor } from "../../../GlobalStyles";
import { Popover } from 'antd';
import {
    GYM_ROOM_SCENE,
    SPACE_STRETCH_SCENE,
    FLY_FIT_SCENE,
    CHART_SQUATS
} from "./shared";

const menuHeight = 0;

const setWidthAndHeight = () => {
    let width = window.innerWidth;
    // let height = width / 1.778;
    let height = window.innerHeight;

    if (height > window.innerHeight) {
        height = window.innerHeight;
        // keeping for reference
        // width = height * 1.778;
    }
    return [width, height - menuHeight];
}

const getConfig = (mainScene) => {
    const [width, height] = setWidthAndHeight();
    const Scenes = [
        BootScene,
        mainScene,
        SpaceStretchScene,
        FlyFitScene,
        ChartSquats
    ];

    return {
        type: Phaser.AUTO,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                // debug: "debug"
            },
        },
        scale: {
            mode: Phaser.Scale.NONE,
            width,
            height,
        },
        scene: Scenes,
        // audio: {
        //     noAudio: true
        // },
        render: {
            pixelArt: true
        },
        fps: {
            target: 60,
        },
    }
}


const MiniGameInstructions = new Map([
    [GYM_ROOM_SCENE, {
        title: "Gym room", content: (
            <>
                <div style={{ padding: "0.3rem" }}>
                    <span style={{ backgroundColor: "aqua", padding: "0.2rem", borderRadius: "3px" }}>
                        right arm up</span>
                    &nbsp;|&nbsp;
                    <span style={{ backgroundColor: "antiquewhite", padding: "0.2rem", borderRadius: "3px" }}>
                        both arms up</span>&nbsp;
                    <span style={{ color: "crimson" }}>MOVE UP</span>
                </div>
                <div style={{ padding: "0.3rem" }}>
                    <span style={{ backgroundColor: "antiquewhite", padding: "0.2rem", borderRadius: "3px" }}>
                        left arm up</span>
                    &nbsp;
                    <span style={{ color: "blue" }}>MOVE DOWN</span>
                </div>
                <div style={{ padding: "0.3rem" }}>
                    <span style={{ backgroundColor: "aqua", padding: "0.2rem", borderRadius: "3px" }}>
                        tilt your head to left</span>
                    &nbsp;
                    <span style={{ color: "crimson" }}>MOVE LEFT</span>
                </div>
                <div style={{ padding: "0.3rem" }}>
                    <span style={{ backgroundColor: "antiquewhite", padding: "0.2rem", borderRadius: "3px" }}>
                        tilt your head to right</span>
                    &nbsp;
                    <span style={{ color: "blue" }}>MOVE RIGHT</span>
                </div>
                <div style={{ padding: "0.3rem" }}>
                    Be creative!<br />
                    Other simmilar moves will workl as well
                </div>
            </>
        )
    }],
    [SPACE_STRETCH_SCENE, {
        title: "Space stretch", content: (
            <>
                <div style={{ padding: "0.3rem" }}>
                    <span style={{ backgroundColor: "antiquewhite", padding: "0.2rem", borderRadius: "3px" }}>
                        both arms up</span>&nbsp;
                    <span style={{ color: "crimson" }}>MOVE UP</span>
                </div>
                <div style={{ padding: "0.3rem" }}>
                    <span style={{ backgroundColor: "antiquewhite", padding: "0.2rem", borderRadius: "3px" }}>
                        gravity</span>
                    &nbsp;
                    <span style={{ color: "blue" }}>MOVE DOWN</span>
                </div>
                <div style={{ padding: "0.3rem" }}>
                    <span style={{ backgroundColor: "aqua", padding: "0.2rem", borderRadius: "3px" }}>
                        tilt your head to left</span>
                    &nbsp;
                    <span style={{ color: "crimson" }}>MOVE LEFT</span>
                </div>
                <div style={{ padding: "0.3rem" }}>
                    <span style={{ backgroundColor: "antiquewhite", padding: "0.2rem", borderRadius: "3px" }}>
                        tilt your head to right</span>
                    &nbsp;
                    <span style={{ color: "blue" }}>MOVE RIGHT</span>
                </div>
                <div style={{ padding: "0.3rem" }}>
                    Be creative!<br />
                    Other simmilar moves will workl as well
                </div>
            </>
        )
    }],
    [FLY_FIT_SCENE, {
        title: "Fly fit", content: (
            <>
                {FLY_FIT_SCENE}
            </>
        )
    }],
    [CHART_SQUATS, {
        title: "Chart squats", content: (
            <>
                {CHART_SQUATS}
            </>
        )
    }],
]);

const GymRoom = ({ avatar, useWebcam = true }) => {
    console.log('GymRoom avatar', avatar);
    // run game
    const [initialised, setInitialised] = useState(true);
    const [config, setConfig] = useState();
    const { webcamId, webcamRef } = useContext(WebcamCtx);
    const { minigame, setMinigame } = useContext(MiniGameCtx);

    const miniGameInstroctions = () => {
        const i = MiniGameInstructions.get(minigame);
        return (<>
            <Popover placement="right"
                title={i.title}
                content={i.content}
                trigger="click">
                <InfoCircleFilled style={{
                    fontSize: "20px",
                    color: "#FFF",
                }} />
            </Popover>
        </>);
    }

    console.log('GymRoom webcamRef', webcamRef);
    console.log('GymRoom webcamId', webcamId);

    const startGame = () => {
        setConfig({
            ...getConfig(GymRoomScene),
            callbacks: {
                preBoot: (game) => {
                    // Makes sure the game doesnt create another game on rerender
                    setInitialised(false);
                    console.log('Updating game registry', avatar);
                    game.registry.merge({
                        avatar,
                        setMinigame,
                    });
                },
            },
        });
    };

    useEffect(() => {
        startGame();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<IonPhaser
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
        {/* side menu */}
        <div
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
                marginTop: "5rem",
            }}>
                {miniGameInstroctions()}
            </div>
        </div>
        {useWebcam && (<div style={{
            position: "fixed",
            top: "1%",
            left: "45%",
            bottom: "0px",
        }} >
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
        </div>)}
    </IonPhaser>);
};

export default GymRoom;
