import {
    highlightTextColor,
    pageTitleStyle,
    descriptionStyle,
    MBMT_TICKER,
} from "../../GlobalStyles";
import { useMoralis } from "react-moralis";


const RewardsPage = () => {
    const { user } = useMoralis();
    console.log('RewardsPage user', user);
    const curXP = user && user.get && user.get('mglXP') ? user.get('mglXP') : 0;
    return (
        <div
            style={{
                marginTop: "4rem",
                marginBottom: "6rem",
                // textAlign: "left",
            }}>

            <h1 style={{
                ...pageTitleStyle,
                marginBottom: "2rem",
            }}>Stretch To Earn</h1>

            <h1 style={{
                ...pageTitleStyle,
                marginBottom: "3rem",
            }}>Your current <span style={{ color: highlightTextColor }}>{MBMT_TICKER}: {curXP}</span>
            </h1>
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
        </div>
    );
}

export default RewardsPage;
