import {
    highlightTextColor,
    pageTitleStyle,
    descriptionStyle,
    MBMT_TICKER,
} from "../../GlobalStyles";
import { useMoralis } from "react-moralis";

const mbmt = <span style={{ color: highlightTextColor }}>{MBMT_TICKER}</span>;
const mbmtlong = <span>(Meta Body Movement Token)</span>;

const commingSoon = <span style={{ color: "chocolate" }}>Comming Soon 🚀</span>;
const colName = 'mglXP';

const RewardsPage = () => {
    const { user } = useMoralis();
    console.log('RewardsPage user', user);
    const curXP = user && user.get && user.get(colName) ? user.get(colName) : 0;
    return (<>
        <section
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridGap: "5rem",
                marginTop: "4rem",
            }}>
            <div>
                <h1 style={{
                    ...pageTitleStyle,
                }}>Stretch To Earn {mbmt}</h1>
                <h2>Meta Body Movement Token</h2>
                <div style={{ marginBottom: "2rem", }} />
                <div style={{
                    flexBasis: "100%",
                }} />
                <div style={{
                    ...descriptionStyle,
                }}>
                    <p>With {mbmtlong} you will be able to:</p>
                    <ul style={{
                        padding: "1.5rem",
                        listStyle: "square",
                    }}>
                        <li>Claim rewards like:
                            <ul style={{
                                padding: "0.5rem 1.5rem",
                                listStyle: "none",
                            }}>

                                <li>NFTs</li>
                                <li>Avatar upgrades</li>
                                <li>More to come</li></ul>
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
                <div
                    style={{
                        ...descriptionStyle,
                    }}>
                    <p>You will not be able to earn {mbmt} with demo avatar</p>
                </div>
            </div>
            <div>
                <h1 style={{
                    ...pageTitleStyle,
                }}>Your current balance:
                </h1>
                <div style={{
                    ...pageTitleStyle,
                    textAlign: "center",

                }}><span style={{
                    color: "gold",
                }}>{curXP}</span>&nbsp;
                    {mbmt}
                </div>
            </div>
        </section>
        <div style={{
            flexBasis: "100%",
        }} />
        <section style={{
            ...descriptionStyle,
            marginBottom: "6rem",
        }}>
            How {mbmt} {mbmtlong} will work?
        </section>
    </>
    );
}

export default RewardsPage;
