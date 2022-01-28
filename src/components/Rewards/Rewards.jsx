import {
    pageTitleStyle,
    pageTitle2Style,
    pageTitle3Style,
    descriptionStyle,
    MBMT_TICKER,
    activeColor,
} from "../../GlobalStyles";
import card from "./card.png";
import { useMoralis } from "react-moralis";

const colName = 'mbmtBalance';
const honeyColor = "#F8B60A";

const mbmt = <span style={{ color: activeColor }}>{MBMT_TICKER}</span>;
const mbmtWhite = <span style={{ color: "#FFF" }}>{MBMT_TICKER}</span>;
const mgl = <span style={{ color: activeColor }}>$MGL</span>;
const mbmtlong = <span style={{ color: honeyColor }}>Meta Body Movement Token</span>;
const commingSoon = <span style={{}}>Comming Soon 🚀</span>;


const activeBgStyle = {
    backgroundColor: activeColor,
    borderRadius: "30px",
    padding: "0.3rem 0.6rem",
}

const RewardsPage = () => {
    const { user } = useMoralis();
    const mbmtBalance = user && user.get && user.get(colName) ? user.get(colName) : 0;
    return (
        <div style={{
            padding: "0rem 6rem",
            marginTop: "1rem",
        }}>
            <section
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridGap: "1rem",
                }}>
                <div>
                    <h1 style={{
                        ...pageTitleStyle,
                    }}>Stretch To Earn&nbsp;
                        <span style={{ color: honeyColor }}>
                            {MBMT_TICKER}
                        </span>
                    </h1>
                    <h2>Meta Body Movement Token</h2>
                    <div style={{ marginBottom: "2rem", }} />
                    <div style={{
                        flexBasis: "100%",
                    }} />
                    <div style={{
                        ...pageTitle3Style,
                    }}>
                        With {mbmtlong} you will be able to:
                    </div>
                    <div style={{
                        ...descriptionStyle,
                    }}>
                        <ul style={{
                            padding: "1.5rem",
                            listStyle: "square",
                        }}>
                            <li>Claim rewards like:
                                <ul style={{
                                    padding: "1rem",
                                    display: "grid",
                                    gridTemplateColumns: "1fr 3fr 3fr",
                                    gridGap: "10px",
                                    textAlign: "center",
                                    listStyle: "none",
                                }}>
                                    <li style={activeBgStyle}>NFTs</li>
                                    <li style={activeBgStyle}>Avatar upgrades</li>
                                    <li style={activeBgStyle}>More to come</li>
                                </ul>
                            </li>
                            <li>
                                Claim token to your wallet
                                &nbsp;{commingSoon}
                            </li>

                        </ul>
                    </div>
                    <div style={{
                        flexBasis: "100%",
                    }} />
                    <div style={{
                        ...descriptionStyle,
                        backgroundColor: "aliceblue",
                        padding: "0.4rem 0.1rem",
                        borderRadius: "30px",
                        textAlign: "center",
                        color: "black",
                        width: "80%",
                    }}>
                        You will not be able to earn <b>$MBMT</b> with demo avatar
                    </div>
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateRows: "1fr",
                        gridTemplateColumns: "1fr",
                        gridTemplateAreas: "overlap",
                    }}
                >
                    <div style={{
                        gridArea: "overlap",
                        alignSelf: "center",
                        justifySelf: "center",
                    }}>
                        <img src={card} alt="" />

                    </div>
                    <div style={{
                        gridArea: "overlap",
                        alignSelf: "center",
                        justifySelf: "center",
                        textAlign: "center",
                        paddingBottom: "8rem",
                    }}>
                        <h1 style={{
                            ...pageTitle3Style,
                            padding: "1rem",
                        }}>Your current balance:
                        </h1>
                        <div style={{
                            ...pageTitle2Style,
                        }}><span style={{
                            color: honeyColor,
                        }}>
                                {mbmtBalance}
                            </span>
                            &nbsp;
                            {mbmtWhite}
                        </div>
                    </div>
                </div>
            </section>
            <div style={{
                flexBasis: "100%",
            }} />
            <section style={{
                marginTop: "6rem",
                marginBottom: "2rem",
                color: "black",
                backgroundColor: "white",
                borderRadius: "30px",
                padding: "1rem",
            }}>

                <div style={{
                    ...pageTitleStyle,
                    textAlign: "center",
                }}>
                    Meta Body Movement Token and MetaGymLand tokens economy
                </div>
                <div style={{
                    ...pageTitle2Style,
                    textAlign: "center",
                    marginBottom: "2rem",
                }}>
                    How will this all work?
                </div>
                <div style={{
                    ...descriptionStyle,
                    textAlign: "center",
                }}>
                    The {mbmt} token will attempt to reflect the energy that you would feel after doing a workout
                    <br />
                    But in the virtual world
                    <br /><br />
                    How does energy after a workout or stretching usually works?<br />
                    It feels good after the workout, but you need to do them regularly otherwise it will go away
                    <br /><br />
                    {mbmt} will work in a similar way<br />
                    It will reflect the energy that you accumulated after the workout<br />
                    But not used and not maintained it will go away
                    <br /><br />
                    If you would like to claim other MetaGymLand digital assets with your {mbmt}<br />
                    they will be automatically burned<br />
                    <br />
                    This way {mbmt} will behave as an <span style={{
                        fontWeight: 700,
                    }}>
                        inflationary/deflationary algorithmic token</span>
                    <br /><br />
                    Once claiming youre earned {mbmt} into your wallet<br />
                    or to using {mbmt} to claim other MetaGymLand digital assets<br />
                    you will need to pay a small fee with {mgl} token
                    <br /><br />
                    {mgl} will be the MetaGymLand governance and platform token<br />
                </div>
            </section>
        </div>
    );
}

export default RewardsPage;
