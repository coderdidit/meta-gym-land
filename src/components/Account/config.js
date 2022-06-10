import Metamask from "./WalletIcons/metamaskWallet.png";
import Coin98 from "./WalletIcons/Coin98.png";
import WalletConnect from "./WalletIcons/wallet-connect.svg";
import MathWallet from "./WalletIcons/MathWallet.svg";
import TokenPocket from "./WalletIcons/TokenPocket.svg";
import SafePal from "./WalletIcons/SafePal.svg";
import TrustWallet from "./WalletIcons/TrustWallet.png";
import BitKeepWallet from "./WalletIcons/bkWallet.png";
import BitKeepConnector from "./BitKeepConnector";

export const connectors = [
  {
    title: "Metamask",
    icon: Metamask,
    connectorId: "injected",
    priority: 1,
  },
  {
    title: "WalletConnect",
    icon: WalletConnect,
    connectorId: "walletconnect",
    priority: 2,
  },
  // willl require custom connector
  // https://docs.moralis.io/moralis-dapp/users/web3-login/custom-auth-any-eip1193-provider
  // https://forum.moralis.io/t/trust-wallet-integration/1382
  // https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents
  // https://docs.bitkeep.com/guide/how-to-connect.html
  {
    title: "BitKeep Wallet",
    icon: BitKeepWallet,
    connectorId: "bitkeep",
    customConnector: BitKeepConnector,
    priority: 3,
  },
  {
    title: "Trust Wallet",
    icon: TrustWallet,
    connectorId: "injected",
    priority: 4,
  },
  {
    title: "MathWallet",
    icon: MathWallet,
    connectorId: "injected",
    priority: 999,
  },
  {
    title: "TokenPocket",
    icon: TokenPocket,
    connectorId: "injected",
    priority: 999,
  },
  {
    title: "SafePal",
    icon: SafePal,
    connectorId: "injected",
    priority: 999,
  },
  {
    title: "Coin98",
    icon: Coin98,
    connectorId: "injected",
    priority: 999,
  },
];
