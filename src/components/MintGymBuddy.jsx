import {
    pageTitleStyle,
    descriptionStyle
} from "GlobalStyles";
import { SmileFilled } from "@ant-design/icons";

const MintGymBuddyPage = () => {
    return (
        <div style={{
            textAlign: "center",
        }}>
            <div style={{
                marginTop: "1rem",
            }}>
                <div style={{
                    ...pageTitleStyle,
                }}>Mint your GymBuddy <SmileFilled style={{ color: "#FFBE59" }} />
                </div>
                <div style={{
                    ...descriptionStyle,
                    padding: "1rem 0",
                }}>
                    ... test description
                </div>
            </div>
        </div>
    )
}

export default MintGymBuddyPage;

