import { AbstractWeb3Connector } from "moralis";
import { sequence } from "0xsequence";
import { debugLog } from "dev-utils/debug";

class NoEthereumProviderError extends Error {
  constructor() {
    super();
    this.message = "Non ethereum enabled browser";
  }
}

function getProvider() {
  if (!window?.sequence.isSequence) {
    window.open("https://sequence.xyz");
    return null;
  }
  return window.sequence;
}

function fromDecimalToHex(number) {
  if (typeof number !== "number") throw "The input provided should be a number";
  return `0x${number.toString(16)}`;
}

/**
 * Converts chainId to a hex if it is a number
 */
function verifyChainId(chainId) {
  if (typeof chainId === "number") chainId = fromDecimalToHex(chainId);
  return chainId;
}

class SequenceConnector extends AbstractWeb3Connector {
  type = "sequence";

  verifyEthereumBrowser() {
    if (!window?.ethereum) {
      throw new NoEthereumProviderError();
    }
  }

  async activate() {
    this.verifyEthereumBrowser();

    const provider = getProvider();

    debugLog("[SequenceConnector]", provider);

    const [accounts, chainId] = await Promise.all([
      provider.request({ method: "eth_requestAccounts" }),
      provider.request({ method: "eth_chainId" }),
    ]);

    const account = accounts[0] ? accounts[0].toLowerCase() : null;

    this.chainId = verifyChainId(chainId);
    this.account = account;
    this.provider = provider;

    this.subscribeToEvents(provider);

    return { provider, chainId, account };
  }

  async switchNetwork(chainId) {
    this.verifyEthereumBrowser();
    chainId = verifyChainId(chainId);

    const currentNetwork = this.chainId;
    if (currentNetwork === chainId) return;

    const provider = getProvider();

    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
  }

  async addNetwork(
    chainId,
    chainName,
    currencyName,
    currencySymbol,
    rpcUrl,
    blockExplorerUrl,
  ) {
    this.verifyEthereumBrowser();

    const newchainId = verifyChainId(chainId);
    const provider = getProvider();

    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: newchainId,
          chainName: chainName,
          nativeCurrency: {
            name: currencyName,
            symbol: currencySymbol,
            decimals: 18,
          },
          rpcUrls: [rpcUrl],
          blockExplorerUrls: blockExplorerUrl ? [blockExplorerUrl] : null,
        },
      ],
    });
  }
}

export default SequenceConnector;
