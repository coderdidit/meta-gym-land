import { useContext } from "react";
import { Button, Card, Image, Tooltip, Alert, Badge } from "antd";
import {
  FileSearchOutlined,
  SmileFilled,
  CopyOutlined,
} from "@ant-design/icons";
import { getExplorer } from "helpers/networks";
import { Link } from "react-router-dom";
import {
  NFTCardStyle,
  NFTsDiv,
  NFTImg,
  BtnPrimary,
  BtnInfo,
  NFTImgWrapperStyle,
} from "../GlobalStyles";
import { DemoNFTContracts } from "../MglNftMetadata";
import { AvatarCtx } from "index";
import { useNFTTokenIds } from "hooks/useNFTTokenIds";
import { useVerifyMetadata } from "hooks/useVerifyMetadata";
import { MainChainID } from "../MglNftMetadata";
import { chainIdToNameAndLogo } from "../components/Chains/Chains";
import { resolveNftSprite } from "../helpers/nft-props-resolvers";
import { pageTitleStyle, descriptionStyle } from "GlobalStyles";
import Loader from "./Loader";
import SnapArBtn from "./SnapArBtn";

const fallbackImg =
  "data:image/png;base64,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";

function DemoAvatar() {
  // eslint-disable-next-line no-unused-vars
  const [avatar, setAvatar] = useContext(AvatarCtx);
  const chainId = MainChainID;
  const demoNFTContract = DemoNFTContracts.get(chainId);
  const {
    data: NFTTokenIds,
    error: NFTsFetchError,
    isLoading,
  } = useNFTTokenIds(demoNFTContract, 3, chainId);
  const { verifyMetadata } = useVerifyMetadata();

  const nftFetchError = (
    <>
      <Alert
        message="Unable to fetch NFT. We are searching for a solution, please try again later!"
        type="warning"
      />
      <div style={{ marginBottom: "10px" }}></div>
    </>
  );

  const displayNftContractAndIpfsLink = (nft) => {
    return (
      <section
        style={{
          ...descriptionStyle,
          padding: "1rem 0",
        }}
      >
        <Button
          style={BtnInfo}
          onClick={() =>
            window.open(
              `${getExplorer(chainId)}address/${demoNFTContract}`,
              "_blank",
            )
          }
        >
          {demoNFTContract}
        </Button>
        <p
          style={{
            color: "#535353",
            marginBottom: "1rem",
            marginTop: "1rem",
            textDecorationLine: "underline",
          }}
        >
          {fixMoralisTokenUri(nft)}&nbsp;
          <CopyOutlined
            onClick={() =>
              navigator.clipboard.writeText(fixMoralisTokenUri(nft))
            }
            style={{ cursor: "pointer" }}
          />
        </p>
      </section>
    );
  };

  const displayNftCard = (nft, snapArMinatureLink) => {
    return (
      <div
        style={{
          ...NFTsDiv,
          marginTop: "1.5rem",
        }}
      >
        <Card
          actions={[
            <Tooltip title="View On Blockexplorer">
              <FileSearchOutlined
                onClick={() =>
                  window.open(
                    `${getExplorer(chainId)}address/${nft.token_address}`,
                    "_blank",
                  )
                }
              />
            </Tooltip>,
          ]}
          style={NFTCardStyle}
          cover={
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateRows: "1fr",
                  gridTemplateColumns: "1fr",
                  gridTemplateAreas: "overlap",
                }}
              >
                <div
                  style={{
                    // grid props
                    gridArea: "overlap",
                    alignSelf: "center",
                    justifySelf: "center",
                  }}
                >
                  <Image
                    preview={false}
                    src={nft.image || "error"}
                    fallback={fallbackImg}
                    alt=""
                    style={{
                      ...NFTImg,
                      // grid props
                      gridArea: "overlap",
                      alignSelf: "center",
                      justifySelf: "center",
                    }}
                    wrapperStyle={{
                      backgroundColor: "#" + nft?.background_color,
                      ...NFTImgWrapperStyle,
                    }}
                  />
                </div>
                {snapArMinatureLink && (
                  <SnapArBtn snapARLink={snapArMinatureLink} />
                )}
              </div>
              <Badge.Ribbon
                text="I will disappear soon"
                color="#5740C1"
                style={{
                  paddingRight: "5px",
                  paddingLeft: "5px",
                  marginRight: "1rem",
                  marginTop: "-1rem",
                }}
              />
            </>
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <Button
              onClick={() => {
                const avatarUri = resolveNftSprite(nft);
                const coverUri = nft?.image;
                const avatarTokenAddress = nft?.token_address;
                const avatarTokenId = nft?.token_id;
                const curAvatar = {
                  uri: avatarUri,
                  name: nft?.name,
                  snapARLink: nft?.snap_ar_link ?? "",
                  coverUri: coverUri,
                  tokenAddress: avatarTokenAddress,
                  tokenId: avatarTokenId,
                  user: null,
                };
                setAvatar(curAvatar);
                window.localStorage.setItem(
                  "avatar",
                  JSON.stringify(curAvatar),
                );
              }}
              type="primary"
              style={BtnPrimary}
            >
              <Link to="/play-setup">Play with me</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  const call2ActionBtns = (
    <section
      style={{
        display: "grid",
        justifyContent: "center",
        alignContent: "center",
        marginTop: "1rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
        }}
      >
        <Button
          type="primary"
          style={{
            ...BtnPrimary,
          }}
        >
          <Link to="/mint">Mint</Link>
        </Button>
        <Button type="primary" style={BtnInfo}>
          <Link to="/marketplace">Marketplace</Link>
        </Button>
      </div>
    </section>
  );

  const gymBuddyText = (
    <>
      <section
        style={{
          ...descriptionStyle,
          marginBottom: "1rem",
        }}
      >
        You can try me first before buying your own GymBuddy NFT,&nbsp;
        <span style={{ fontWeight: 700 }}>but I will disappear soon</span>
        &nbsp;&nbsp;😱
      </section>

      <section>
        <p> If you dont have your awesome GymBuddy yet,</p>
        <p>simply mint your first GymBuddy or visit Marketplace</p>
        <p> and start your MetaGymLand Metaverse adventure!</p>
      </section>
    </>
  );

  if (isLoading) {
    return <Loader />;
  } else {
    if (NFTsFetchError) {
      return nftFetchError;
    }
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "3rem",
          marginBottom: "4rem",
        }}
      >
        <section
          style={{
            ...pageTitleStyle,
          }}
        >
          I am a Demo GymBuddy <SmileFilled style={{ color: "#FFBE59" }} />
        </section>

        {NFTTokenIds?.result.map((nft, index) => {
          //Verify Metadata
          nft = verifyMetadata(nft);
          const snapArMinatureLink = nft?.snap_ar_miniature_link ?? "";
          return (
            <div key={index}>
              {displayNftContractAndIpfsLink(nft)}
              {gymBuddyText}
              {call2ActionBtns}
              {displayNftCard(nft, snapArMinatureLink)}
            </div>
          );
        })}
      </div>
    );
  }
}

export default DemoAvatar;

const fixMoralisTokenUri = (nft) => {
  if (!nft.token_uri) return "";
  return nft.token_uri.replace("https://ipfs.moralis.io:2053/ipfs/", "ipfs://");
};
