import { createContext, useCallback, useContext, useState } from "react";
import { ethers } from "ethers";
import { SafeAuthKit, SafeAuthProviderType } from "@safe-global/auth-kit";

import getChain from "src/utils/getChain";
import Chain from "src/models/chain";
import metamaskLogo from "src/assets/Metamask_logo.svg";
import walletConnectLogo from "src/assets/WalletConnect_logo.png";
import web3Auth_logo from "src/assets/web3Auth_logo.png";
import { initialChain } from "src/chains/chains";

// TODO: review wallet logos
const logos: Record<string, string> = {
  WalletConnect: walletConnectLogo,
  MetaMask: metamaskLogo,
  Web2Login: web3Auth_logo,
};

type walletContextValue = {
  walletAddress?: string;
  chainId?: string;
  walletLogo?: string;
  safes: string[];
  chain?: Chain;
  isWalletConnected: boolean;
  web3Provider?: ethers.providers.Web3Provider;
  connectWeb2Login: () => void;
  setChainId: (chainId: string) => void;
};

const initialState = {
  isWalletConnected: false,
  connectWeb2Login: () => {},
  setChainId: () => {},
  safes: [],
};

const walletContext = createContext<walletContextValue>(initialState);

const useWallet = () => {
  const context = useContext(walletContext);

  if (!context) {
    throw new Error("useWallet should be used within a WalletContext Provider");
  }

  return context;
};

// TODO: add chain selector

const WalletProvider = ({ children }: { children: JSX.Element }) => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [safes, setSafes] = useState<string[]>([]);
  const [chainId, setChainId] = useState<string>(initialChain.id);
  const [walletLabel, setWalletLabel] = useState<string>("");
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>();

  const isWalletConnected = !!walletAddress && !!chainId;

  const chain = getChain(chainId) || initialChain;
  const walletLogo = logos[walletLabel];

  const connectWeb2Login = useCallback(async () => {
    try {
      const safeAuth = await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
        chainId: chain.id,
        txServiceUrl: chain.transactionServiceUrl,
        authProviderConfig: {
          rpcTarget: chain.rpcUrl,
          clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID || "",
          network: "testnet",
          theme: "dark",
        },
      });

      if (safeAuth) {
        const safeAuthSignInResponse = await safeAuth.signIn();

        console.log("SIGN IN RESPONSE: ", safeAuthSignInResponse);
        console.log("safeAuth eoa: ", safeAuthSignInResponse.eoa);
        console.log("safeAuth.safes: ", safeAuthSignInResponse.safes);

        const safes = safeAuthSignInResponse.safes || [];
        const provider = safeAuth.getProvider();

        setChainId(chain.id);
        setWalletLabel("Web2Login");
        setWalletAddress(safeAuthSignInResponse.eoa);
        setSafes(safes);

        if (provider) {
          setWeb3Provider(new ethers.providers.Web3Provider(provider));
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }, [chain]);

  // TODO: ADD disconnect wallet logic ?

  const state = {
    walletAddress,
    chainId,
    chain,
    safes,

    walletLogo,
    isWalletConnected,

    web3Provider,

    connectWeb2Login,
    setChainId,
  };

  return (
    <walletContext.Provider value={state}>{children}</walletContext.Provider>
  );
};

export { useWallet, WalletProvider };
