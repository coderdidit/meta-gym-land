import { Divider } from "antd";
import packageJson from '../package.json';
import { mainFontColor, descriptionStyle } from "GlobalStyles";
import {
    MGLSmallLogo,
    MoralisLogo,
    AvaxLogo,
    ChainLinkLogo,
    CoderDitiLogo,
    TfJSLogo,
    MediaPipeLogo,
    PhaserLogo,
} from "Logos";

export const AppFooter = ({ style }) => {
    return (
        <>
            <Divider style={{
                ...style,
                backgroundColor: mainFontColor,
                marginBottom: "2rem",
            }} />

            <footer style={{
                ...style,
                display: "grid",
                gap: "2rem",
                gridTemplateColumns: "9fr 1fr 1fr 1fr 1fr",
            }}>
                <div style={{
                    textAlign: "left",
                }}>
                    <MGLSmallLogo />
                </div>

                <div>
                    <div style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        marginBottom: "1rem",
                    }}>
                        MetaGymLand
                    </div>
                    <a style={{
                        ...descriptionStyle,
                        textDecoration: "none",
                        color: mainFontColor,
                    }} href="/">Home</a>
                    <br />
                    <a style={{
                        ...descriptionStyle,
                        textDecoration: "none",
                        color: mainFontColor,
                    }} href="https://metagymland.com/" target="_blank" >About</a>
                </div>

                <div>
                    <div style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        marginBottom: "1rem",
                    }}>Build with
                    </div>
                    <div style={{
                    }}>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://moralis.io"
                        >
                            <MoralisLogo />
                        </a>
                    </div>
                    <div style={{
                    }}>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.avax.network"
                        >
                            <AvaxLogo />
                        </a>
                    </div>
                    <div style={{
                    }}>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://chain.link"
                        >
                            <ChainLinkLogo />
                        </a>
                    </div>
                    <div style={{
                    }}>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.tensorflow.org/js"
                        >
                            <TfJSLogo textFill={"#595959"} />
                        </a>
                    </div>
                    <div style={{
                    }}>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://mediapipe.dev"
                        >
                            <MediaPipeLogo textFill={"#595959"} />
                        </a>
                    </div>
                    <div style={{
                    }}>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://phaser.io"
                        >
                            <PhaserLogo
                                width={"60"}
                                height={"25"}
                            />
                        </a></div>
                </div>

                <div style={{ color: mainFontColor }}>
                    <div style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        marginBottom: "1rem",
                    }}>
                        Coded by
                    </div>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://coderdidit.com"
                    >
                        <CoderDitiLogo />
                    </a>
                </div>
                {/* <div style={{
                    textAlign: "center",
                }}>
                    <div style={{ color: mainFontColor }}>
                        <div>Coded by</div>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://coderdidit.com"
                        >
                            <CoderDitiLogo />
                        </a>
                    </div>
                </div> */}

                <div
                >
                    <div style={{
                        textAlign: "right",
                    }}>
                        <b>v{packageJson.version}</b>
                    </div>
                </div>
            </footer>
        </>
    );
};
