import {
    pageTitleStyle,
    descriptionStyle,
    BtnPrimary,
} from "GlobalStyles";
import { getExplorer } from "helpers/networks";
import { SmileFilled } from "@ant-design/icons";
import { TestGymBuddiesContract, MainChainID } from "../MglNftMetadata";
import { SelectOutlined } from "@ant-design/icons";
import { Button } from "antd";
import {
    // useMoralis,
    // useMoralisQuery,
    useWeb3ExecuteFunction
} from "react-moralis";

/**
 * TODO
 * this is very dummy implementation of random mint
 * replace with chainlink VRF
*/
////////////////////////////////////
let rngAttempts = 0;
const mintedGymBuddies = new Set();
const minGbId = 1;
const maxGbId = 3;
const getRandomGymBuddyIdHelper = () => {
    return Math.floor(Math.random() * (maxGbId - minGbId + 1)) + minGbId;
}
const getRandomGymBuddyId = () => {
    const rgGymBuddyId = getRandomGymBuddyIdHelper();
    if (rngAttempts > 100) return rgGymBuddyId;
    if (!mintedGymBuddies.has(rgGymBuddyId)) {
        rngAttempts = 0;
        mintedGymBuddies.add(rgGymBuddyId);
        return rgGymBuddyId;
    }
    rngAttempts += 1;
    return getRandomGymBuddyId();
}
////////////////////////////////////

const MintGymBuddyPage = () => {

    const contractProcessor = useWeb3ExecuteFunction();
    const contractAddress = TestGymBuddiesContract;
    const chainId = MainChainID;

    const handleMintClick = () => {
        alert('should mint');
    }

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
                    <div style={{ marginTop: "10px", padding: "0 10px" }}>
                        <a
                            style={{ color: "ivory" }}
                            href={`${getExplorer(chainId)}/address/${contractAddress}`}
                            target="_blank" rel="noreferrer"
                        >
                            <SelectOutlined style={{ marginRight: "5px" }} />
                            View GymBuddies NFT Contract on Explorer
                        </a>
                    </div>
                </div>
                <Button
                    type="primary"
                    style={BtnPrimary}
                    onClick={handleMintClick}
                >
                    Mint
                </Button>
            </div>
        </div>
    )
}

export default MintGymBuddyPage;

