import React, { useState, useContext } from "react";
import { useMoralis, useNFTBalances, useWeb3ExecuteFunction } from "react-moralis";
import { Modal, Button, Card, Image, Tooltip, Skeleton } from "antd";
import { FileSearchOutlined, ShoppingCartOutlined, SkinFilled } from "@ant-design/icons";
import { getExplorer } from "helpers/networks";
import { useVerifyMetadata } from "hooks/useVerifyMetadata";
import { brightFontCol } from "GlobalStyles";
import { Input, Divider } from "antd";
import { Link } from "react-router-dom";
import { mainMarketAddress, deployedABI, listItemFunction } from "../MarketplaceSCMetadata";
import { NFTCardStyle, NFTsDiv, NFTImg, BtnPrimary, NFTImgWrapperStyle } from "../GlobalStyles";
import { DemoNFTContracts } from "../MglNftMetadata";
import { AvatarCtx } from "index";
import { NFTCollectionItems } from "./Marketplace/NFTCollectionItems";
import { useVerifyMetadata } from "hooks/useVerifyMetadata";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";

const { Meta } = Card;

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
                            />
                        )
                    })}
            </div>
        </div>
    );
}

export default DemoAvatar;
