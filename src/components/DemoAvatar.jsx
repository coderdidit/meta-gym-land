import React, { useContext } from "react";
import { useMoralis } from "react-moralis";
import { Button, Card, Image, Tooltip, Alert } from "antd";
import { FileSearchOutlined, SkinFilled } from "@ant-design/icons";
import { getExplorer } from "helpers/networks";
import { brightFontCol } from "GlobalStyles";
import { Link } from "react-router-dom";
import { NFTCardStyle, NFTsDiv, NFTImg, BtnPrimary, NFTImgWrapperStyle } from "../GlobalStyles";
import { DemoNFTContracts } from "../MglNftMetadata";
import { AvatarCtx } from "index";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";
import { useVerifyMetadata } from "hooks/useVerifyMetadata";

const fallbackImg =
    "data:image/png;base64,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";


function DemoAvatar() {
    // eslint-disable-next-line no-unused-vars
    const [avatar, setAvatar] = useContext(AvatarCtx);
    const { chainId } = useMoralis();
    const demoNFTContract = DemoNFTContracts.get(chainId);
    console.log("demoNFTContract", demoNFTContract);
    const { data: NFTTokenIds, error: NFTsFetchError } = useNFTTokenIds(demoNFTContract);
    console.log("NFTTokenIds", NFTTokenIds);
    const { verifyMetadata } = useVerifyMetadata();

    return (
        <div>
            <div style={{
                marginTop: "1rem",
                marginBottom: "3rem",
            }}>
                <h1 style={{
                    fontFamily: "Source Serif Pro",
                    textAlign: "center",
                    fontSize: "27px",
                    fontWeight: "bold",
                }}>I am a Demo Avatar <SkinFilled /></h1>
                <br />
                <h3>
                    You can try me first before having your own NFT avatar
                </h3>
                <h3>
                    But I will dissapear soon&nbsp;&nbsp;😱
                </h3>
                <h3>
                    If you don't have your awesome Avatar yet, get one in our
                    {" "}<Link to="/marketplace">
                        <b><u>Marketplace</u></b>
                    </Link>{" "}🚀
                </h3>
            </div>
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
