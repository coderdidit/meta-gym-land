import React, { useState } from "react";
import { getNativeByChain, getExplorer } from "../../helpers/networks"
import {
    useMoralis,
    useMoralisQuery,
    useWeb3ExecuteFunction
} from "react-moralis";
import { Card, Image, Tooltip, Modal, Badge, Alert, Spin } from "antd";
import {
    FileSearchOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { useVerifyMetadata } from "hooks/useVerifyMetadata";
import { mainMarketAddress, deployedABI, createdMarketItemsTable } from "../../MarketplaceSCMetadata";
import { NFTCardStyle } from "../../GlobalStyles";

const { Meta } = Card;
const fallbackImg =
    "data:image/png;base64,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";

function NFTCollectionItems({NFTTokenIds}) {

    const { chainId, account, Moralis } = useMoralis();

    console.log("NFTTokenIds", NFTTokenIds);
    const [visible, setVisibility] = useState(false);
    const [nftToBuy, setNftToBuy] = useState(null);
    const [loading, setLoading] = useState(false);

    const [contractABI, setContractABI] = useState(deployedABI); //Smart Contract ABI here
    const [marketAddress, setMarketAddress] = useState(mainMarketAddress)

    const contractProcessor = useWeb3ExecuteFunction();
    const nativeName = getNativeByChain(chainId);
    const contractABIJson = JSON.parse(contractABI);
    const { verifyMetadata } = useVerifyMetadata();
    const listings = new Map();

    const queryMarketItems = useMoralisQuery(createdMarketItemsTable);
    const fetchMarketItems = JSON.parse(
        JSON.stringify(queryMarketItems.data, [
            "objectId",
            "createdAt",
            "price",
            "nftContract",
            "itemId",
            "sold",
            "tokenId",
            "seller",
            "owner",
            "confirmed",
        ])
    );
    const purchaseItemFunction = "createMarketSale";

    async function purchase() {
        setLoading(true);
        const tokenDetails = getMarketItem(nftToBuy);
        const itemID = tokenDetails.itemId;
        const tokenPrice = tokenDetails.price;
        const ops = {
            contractAddress: marketAddress,
            functionName: purchaseItemFunction,
            abi: contractABIJson,
            params: {
                nftContract: nftToBuy.token_address,
                itemId: itemID,
            },
            msgValue: tokenPrice,
        };

        await contractProcessor.fetch({
            params: ops,
            onSuccess: () => {
                console.log("success");
                setLoading(false);
                setVisibility(false);
                updateSoldMarketItem();
                succPurchase();
            },
            onError: (error) => {
                setLoading(false);
                failPurchase(error);
            },
        });
    }

    const handleBuyClick = (nft) => {
        setNftToBuy(nft);
        console.log(nft.image);
        setVisibility(true);
    };

    function succPurchase() {
        let secondsToGo = 5;
        const modal = Modal.success({
            title: "Success!",
            content: `You have purchased this NFT`,
        });
        setTimeout(() => {
            modal.destroy();
        }, secondsToGo * 1000);
    }

    function failPurchase(err) {
        const modal = Modal.error({
            title: "Error!",
            content: `There was a problem when purchasing this NFT: ${err}`,
        });
        // let secondsToGo = 5;
        // setTimeout(() => {
        //   modal.destroy();
        // }, secondsToGo * 1000);
    }

    async function updateSoldMarketItem() {
        const id = getMarketItem(nftToBuy).objectId;
        console.log('updateSoldMarketItem id', id);
        const marketList = Moralis.Object.extend(createdMarketItemsTable);
        const query = new Moralis.Query(marketList);
        await query.get(id).then((obj) => {
            obj.set("sold", true);
            obj.set("owner", account);
            obj.save();
        });
    }

    /**
     * TODO maybe create mapping here
     * (token_address, token_id) => amount for sale
     * 
     * alternatively that data can be fetched from smart contract
     * 
     * but for now just followint the tutorial
     * 
    */
    const getMarketItem = (nft) => {
        const result = fetchMarketItems?.find(
            (e) =>
                e.nftContract === nft?.token_address &&
                e.tokenId === nft?.token_id &&
                e.sold === false &&
                e.confirmed === true
        );
        return result;
    };

    const getMarketItems = (nft) => {
        console.log('getMarketItems fetchMarketItems', fetchMarketItems)
        const result = fetchMarketItems?.filter(
            (e) =>
                e.nftContract === nft?.token_address &&
                e.tokenId === nft?.token_id &&
                e.sold === false &&
                e.confirmed === true
        );
        const key = `${nft?.token_address}:${nft?.token_id}`
        listings.set(key, result.length);
        return result.length > 0;
    };

    const getAmountForSale = (nft) => {
        const key = `${nft?.token_address}:${nft?.token_id}`
        return listings.get(key)
    }

    return (
        <>
            {NFTTokenIds?.result
                .map((nft, index) => {
                    //Verify Metadata
                    nft = verifyMetadata(nft);
                    return (
                        <Card
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
                                <Tooltip title="Buy NFT">
                                    <ShoppingCartOutlined onClick={() => handleBuyClick(nft)} />
                                </Tooltip>,
                            ]}
                            style={NFTCardStyle}
                            cover={
                                <Image
                                    preview={false}
                                    src={nft.image || "error"}
                                    fallback={fallbackImg}
                                    alt=""
                                    style={{ height: "240px" }}
                                />
                            }
                            key={index}
                        >
                            {getMarketItems(nft) && (
                                <>
                                    <Badge.Ribbon text="Buy Now" color="green"></Badge.Ribbon>
                                </>
                            )}
                            <Meta
                                title={nft.name}
                                description={
                                    <>
                                        <p>{`#${nft.token_id}`}</p>
                                        <div style={{
                                            textAlign: "center"
                                        }}>
                                            <h3>
                                                <b style={{ color: "darkblue" }}>Total</b>
                                                &nbsp;<b style={{ color: "cadetblue" }}>/</b>&nbsp;
                                                <b style={{ color: "crimson" }}>For Sale</b>
                                            </h3>
                                            <h1>
                                                <b style={{ color: "darkblue" }}>{nft.amount}</b>
                                                &nbsp;<b style={{ color: "cadetblue" }}>/</b>&nbsp;
                                                <b style={{ color: "crimson" }}>{getAmountForSale(nft)}</b>
                                            </h1>
                                        </div>
                                    </>
                                }
                            />
                        </Card>
                    )
                })}
        </>
    )
}

export default NFTCollectionItems;
