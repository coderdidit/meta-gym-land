import { AbstractWeb3Connector, verifyChainId } from "moralis";

export const InjectedEvents = Object.freeze({
    ACCOUNTS_CHANGED: 'accountsChanged',
    CHAIN_CHANGED: 'chainChanged',
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
});

class NoEthereumProviderError extends Error {
    constructor() {
        super();
        this.message = 'Non ethereum enabled browser';
    }
}

function getProvider() {
    if (!window.isBitKeep) {
        return null
    }
    return window.bitkeep.ethereum
}

function isBitKeepInstalled() {
    return window.isBitKeep && window.bitkeep.ethereum;
}

class BitKeepConnector extends AbstractWeb3Connector {
    type = 'injected';

    verifyEthereumBrowser() {
        if (!window?.ethereum) {
            throw new NoEthereumProviderError();
        }
    }

    async activate() {
        console.log('---activate------BitKeepConnector------', isBitKeepInstalled());
        this.verifyEthereumBrowser();

        const provider = getProvider();

        const [accounts, chainId] = await Promise.all([
            provider.request({ method: 'eth_requestAccounts' }),
            window.ethereum.request({ method: 'eth_chainId' }),
        ]);

        const account = accounts[0] ? accounts[0].toLowerCase() : null;

        this.chainId = chainId;
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

        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }],
        });
    }

    async addNetwork(chainId, chainName, currencyName, currencySymbol, rpcUrl, blockExplorerUrl) {
        this.verifyEthereumBrowser();

        const newchainId = verifyChainId(chainId);
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
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

export default BitKeepConnector;
