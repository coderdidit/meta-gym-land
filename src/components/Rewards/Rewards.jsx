import {
    highlightTextColor,
    pageTitleStyle,
    descriptionStyle
} from "../../GlobalStyles";

const RewardsPage = () => {
    return (
        <div
            style={{
                marginTop: "4rem",
                marginBottom: "6rem",
            }}
        >
            <h1 style={{
                ...pageTitleStyle,
                marginBottom: "3rem",
            }}>Your current $mgl XP: 0</h1>
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
