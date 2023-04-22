import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from '@walletconnect/web3-provider';
import { useState } from "react";
import { AccountContext } from "./AccountContext";
import { Alert } from "react-native";
import { ethers, providers } from "ethers";

import { SEPOLIA_API_KEY } from "@env"

type WalletConnectManagerProps = {
    children: React.ReactNode;
}

export default function WalletConnectManager({ children }: WalletConnectManagerProps) {
    const [connected, setConnected] = useState<boolean>(false);
    const [signer, setSigner] = useState<providers.JsonRpcSigner | null>(null);
    const [provider, setProvider] = useState<providers.Web3Provider | null>(null);

    const connector = useWalletConnect();

    async function connect() {

        await connector.connect();

        const provider = new WalletConnectProvider({
            rpc: {
                11155111: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_API_KEY}` // replace
            },
            chainId: 11155111,
            connector: connector,
            qrcode: false
        });
        await provider
            .enable()
            .catch(() => {
                throw new Error("User rejected provider access");
            });

        const ethersProvider = new ethers.providers.Web3Provider(provider);
        setProvider(ethersProvider);
        const signer = ethersProvider.getSigner();
        setSigner(signer);
        setConnected(true);
    }


    const connectWallet = async () => {
        // READ ME
        // Unfortunately, the WalletConnect library is not working properly, sometimes it fails to connect and the user have to try again
        // Related issues:
        // https://github.com/WalletConnect/walletconnect-monorepo/issues/243
        // https://github.com/WalletConnect/walletconnect-monorepo/issues/1688
        await connect()
            .catch((error) => {
                console.log(error)
                Alert.alert("Error", "An error occurred while connecting, please try again.");
            });
    }

    const killSession = async () => {
        await connector.killSession().then(() => {
            setConnected(false);
        }).catch((error) => {
            // Unfortunatly, sometimes the killSession method fails, so we need to restart the app to clear the session
            // I have no idea why this happens, but it does
            // Also, I have no idea how to automate this, so the user have to manually restart the app
            Alert.alert("Error", "An error occurred while disconnecting, please restart the app and try again.");
        });
    };

    return (
        <AccountContext.Provider value={{ connected, signer, provider, connect: connectWallet, killSession }}>
            {children}
        </AccountContext.Provider>
    )
}