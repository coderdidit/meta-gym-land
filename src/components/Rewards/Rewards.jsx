import {
    highlightTextColor,
    pageTitleStyle,
    descriptionStyle,
    MBMT_TICKER,
} from "../../GlobalStyles";
import { useMoralis } from "react-moralis";

const mbmt = <span style={{ color: highlightTextColor }}>{MBMT_TICKER}</span>;


const RewardsPage = () => {
    const { user } = useMoralis();
    console.log('RewardsPage user', user);
    const curXP = user && user.get && user.get('mglXP') ? user.get('mglXP') : 0;
    return (<>
        <section
            style={{
                marginTop: "4rem",
                marginBottom: "6rem",
                // textAlign: "left",
            }}>

            <h1 style={{
                ...pageTitleStyle,
                marginBottom: "2rem",
            }}>Stretch To Earn {mbmt}</h1>

            <h1 style={{
                ...pageTitleStyle,
            }}>Your current&nbsp;
                {mbmt}
                &nbsp;balance
            </h1>
            <h1 style={{
                ...pageTitleStyle,
                textAlign: "center",
                color: highlightTextColor,
                marginBottom: "3rem",
            }}>{curXP}</h1>
            <div style={{
                flexBasis: "100%",
            }} />
            <div style={{
                ...descriptionStyle,
            }}>
                <p>With MetaGymLand XP you will be able to claim rewards like:</p>
                <ul style={{
                    padding: "1.5rem",
                    listStyle: "circle",
                }}>
                    <li>NFTs</li>
                    <li>MetaGymLand in game token</li>
                </ul>
            </div>
            <div style={{
                flexBasis: "100%",
            }} />
            <div
                style={{
                    ...descriptionStyle,
                }}>
                <p>You cant earn $mgl XP with demo avatar</p>
            </div>
        </section>
    </>
    );
}

export default RewardsPage;
