import React, { useContext } from "react";
import { useMoralis } from "react-moralis";
import { Button, Card, Image, Tooltip } from "antd";
import { FileSearchOutlined, SkinFilled } from "@ant-design/icons";
import { getExplorer } from "helpers/networks";
import { brightFontCol } from "GlobalStyles";
import { Link } from "react-router-dom";
import { NFTCardStyle, NFTsDiv, NFTImg, BtnPrimary, NFTImgWrapperStyle } from "../GlobalStyles";
import { DemoNFTContracts } from "../MglNftMetadata";
import { AvatarCtx } from "index";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";

function DemoAvatar() {
    // eslint-disable-next-line no-unused-vars
    const [avatar, setAvatar] = useContext(AvatarCtx);
    const { chainId } = useMoralis();
    const demoNFTContract = DemoNFTContracts.get(chainId);
    console.log("demoNFTContract", demoNFTContract);
    const { data: NFTTokenIds, error: NFTsFetchError } = useNFTTokenIds(demoNFTContract);
    console.log("NFTTokenIds", NFTTokenIds);

    return (
        <div style={{
            padding: "0 14%",
            // maxWidth: "1030px",
            width: "100%",
            background: "none",
            color: brightFontCol,
        }}>
            <h1 style={{
                fontFamily: "Source Serif Pro",
                textAlign: "center",
                fontSize: "27px",
                fontWeight: "bold",
            }}>I am a Demo Avatar <SkinFilled /></h1>
            <br />
            <h3>
                You can try me first before having your ownI will dissapear soon
            </h3>
            <h3>
                But I will dissapear soon
            </h3>
            <h3>
                If you don't have your awesome Avatar yet, get one in our
                {" "}<Link to="/marketplace">
                    <b><u>Marketplace</u></b>
                </Link>{" "}🚀
            </h3>
            {(
                <>
                    {NFTsFetchError && (
                        <>
                            <Alert
                                message="Unable to fetch NFT. We are searching for a solution, please try again later!"
                                type="warning"
                            />
                            <div style={{ marginBottom: "10px" }}></div>
                        </>
                    )}
                </>
            )}
            <div style={NFTsDiv}>
                {NFTTokenIds?.result
                    .map((nft, index) => {
                        //Verify Metadata
                        nft = verifyMetadata(nft);
                        return (
                            <Card
                                key={index}
                                hoverable
                                actions={[
                                    <Tooltip title="View On Blockexplorer">
                                        <FileSearchOutlined
                                            onClick={() =>
                                                window.open(
                                                    `${getExplorer(chainId)}address/${nft.token_address}`,
                                                    "_blank"
                                                )
                                            }
                                        />
                                    </Tooltip>,
                                ]}
                                style={NFTCardStyle}
                                cover={
                                    <Image
                                        preview={false}
                                        src={nft.image || "error"}
                                        fallback={fallbackImg}
                                        alt=""
                                        style={NFTImg}
                                        wrapperStyle={{
                                            backgroundColor: "#" + nft?.background_color,
                                            ...NFTImgWrapperStyle
                                        }}
                                    />
                                }
                            >
                                <Button
                                    onClick={() => {
                                        const avatarUri = nft?.image;
                                        const avatarTokenAddress = nft?.token_address;
                                        const avatarTokenId = nft?.token_id;
                                        setAvatar({
                                            uri: avatarUri,
                                            tokenAddress: avatarTokenAddress,
                                            tokenId: avatarTokenId,
                                        });
                                    }}
                                    type="primary"
                                    style={BtnPrimary}
                                >
                                    <Link to='/play-setup'>
                                        Play with me
                                    </Link>
                                </Button>
                            </Card>
                        )
                    })}
            </div>
        </div>
    );
}

export default DemoAvatar;
