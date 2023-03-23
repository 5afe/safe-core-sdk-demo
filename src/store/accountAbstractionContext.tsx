import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { utils, ethers, BigNumber } from "ethers";
import { SafeAuthKit, SafeAuthProviderType } from "@safe-global/auth-kit";
import AccountAbstraction, {
  MetaTransactionData,
  MetaTransactionOptions,
} from "@safe-global/account-abstraction-kit-poc";
import { GelatoRelayAdapter } from "@safe-global/relay-kit";
import {
  SafeOnRampKit,
  SafeOnRampEvent,
  SafeOnRampProviderType,
} from "@safe-global/onramp-kit";

import getChain from "src/utils/getChain";
import Chain from "src/models/chain";
import { initialChain } from "src/chains/chains";
import usePolling from "src/hooks/usePolling";

type accountAbstractionContextValue = {
  ownerAddress?: string;
  chainId: string;
  safes: string[];
  chain?: Chain;
  isAuthenticated: boolean;
  web3Provider?: ethers.providers.Web3Provider;
  loginWeb3Auth: () => void;
  logoutWeb3Auth: () => void;
  setChainId: (chainId: string) => void;
  safeSelected?: string;
  safeBalance?: string;
  setSafeSelected: React.Dispatch<React.SetStateAction<string>>;
  isRelayerLoading: boolean;
  relayTransaction: () => Promise<void>;
  gelatoTaskId?: string;
  openStripeWidget: () => Promise<void>;
  closeStripeWidget: () => Promise<void>;
};

const initialState = {
  isAuthenticated: false,
  loginWeb3Auth: () => {},
  logoutWeb3Auth: () => {},
  relayTransaction: async () => {},
  setChainId: () => {},
  setSafeSelected: () => {},
  onRampWithStripe: async () => {},
  safes: [],
  chainId: initialChain.id,
  isRelayerLoading: true,
  openStripeWidget: async () => {},
  closeStripeWidget: async () => {},
};

const accountAbstractionContext =
  createContext<accountAbstractionContextValue>(initialState);

const useAccountAbstraction = () => {
  const context = useContext(accountAbstractionContext);

  if (!context) {
    throw new Error(
      "useAccountAbstraction should be used within a AccountAbstraction Provider"
    );
  }

  return context;
};

const AccountAbstractionProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  // owner address from the email  (provided by web3Auth)
  const [ownerAddress, setOwnerAddress] = useState<string>("");

  // safes owned by the user
  const [safes, setSafes] = useState<string[]>([]);

  // chain selected
  const [chainId, setChainId] = useState<string>(initialChain.id);

  // web3 provider to perform signatures
  const [web3Provider, setWeb3Provider] =
    useState<ethers.providers.Web3Provider>();

  const isAuthenticated = !!ownerAddress && !!chainId;
  const chain = getChain(chainId) || initialChain;

  // reset React state when you switch the chain
  useEffect(() => {
    setOwnerAddress("");
    setSafes([]);
    setChainId(chain.id);
    setWeb3Provider(undefined);
    setSafeSelected("");
    setAuthClient(undefined);
  }, [chain]);

  // authClient
  const [authClient, setAuthClient] = useState<SafeAuthKit>();

  // onRampClient
  const [onRampClient, setOnRampClient] = useState<SafeOnRampKit>();

  // auth-kit implementation
  const loginWeb3Auth = useCallback(async () => {
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
        const { safes, eoa } = await safeAuth.signIn();
        const provider =
          safeAuth.getProvider() as ethers.providers.ExternalProvider;

        // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
        setChainId(chain.id);
        setOwnerAddress(eoa);
        setSafes(safes || []);
        setWeb3Provider(new ethers.providers.Web3Provider(provider));
        setAuthClient(safeAuth);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }, [chain]);

  const logoutWeb3Auth = () => {
    authClient?.signOut();
    setOwnerAddress("");
    setSafes([]);
    setChainId(chain.id);
    setWeb3Provider(undefined);
    setSafeSelected("");
    setAuthClient(undefined);
  };

  // TODO: add disconnect owner wallet logic ?

  // current safe selected by the user
  const [safeSelected, setSafeSelected] = useState<string>("");

  // conterfactual safe Address if its not deployed yet
  useEffect(() => {
    const getSafeAddress = async () => {
      if (web3Provider) {
        const signer = web3Provider.getSigner();
        const relayAdapter = new GelatoRelayAdapter();
        const safeAccountAbstraction = new AccountAbstraction(signer);

        await safeAccountAbstraction.init({ relayAdapter });

        const hasSafes = safes.length > 0;

        const safeSelected = hasSafes
          ? safes[0]
          : safeAccountAbstraction.getSafeAddress();

        setSafeSelected(safeSelected);
      }
    };

    getSafeAddress();
  }, [safes, web3Provider]);

  const [isRelayerLoading, setIsRelayerLoading] = useState<boolean>(false);
  const [gelatoTaskId, setGelatoTaskId] = useState<string>();

  // refresh the Gelato task id
  useEffect(() => {
    setIsRelayerLoading(false);
    setGelatoTaskId(undefined);
  }, [chainId]);

  // relay-kit implementation using Gelato
  const relayTransaction = async () => {
    if (web3Provider) {
      setIsRelayerLoading(true);

      const signer = web3Provider.getSigner();
      const relayAdapter = new GelatoRelayAdapter();
      const safeAccountAbstraction = new AccountAbstraction(signer);

      await safeAccountAbstraction.init({ relayAdapter });

      // we use a dump safe transfer as a demo transaction
      const dumpSafeTransafer: MetaTransactionData = {
        to: safeSelected,
        data: "0x",
        value: BigNumber.from(utils.parseUnits("0.01", "ether").toString()),
        operation: 0, // OperationType.Call,
      };

      const options: MetaTransactionOptions = {
        isSponsored: false,
        gasLimit: BigNumber.from("600000"), // in this alfa version we need to manually set the gas limit :<
        gasToken: ethers.constants.AddressZero, // native token ???
      };

      const gelatoTaskId = await safeAccountAbstraction.relayTransaction(
        dumpSafeTransafer,
        options
      );

      setIsRelayerLoading(false);
      setGelatoTaskId(gelatoTaskId);
    }
  };

  // onramp-kit implementation
  const openStripeWidget = async () => {
    const onRampClient = await SafeOnRampKit.init(
      SafeOnRampProviderType.Stripe,
      {
        onRampProviderConfig: {
          stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || "",
          onRampBackendUrl: process.env.REACT_APP_STRIPE_BACKEND_BASE_URL || "",
        },
      }
    );
    const sessionData = await onRampClient?.open({
      // sessionId: sessionId, optional parameter
      walletAddress: safeSelected,
      networks: ["ethereum", "polygon"],
      element: "#stripe-root",
      events: {
        onLoaded: () => console.log("onLoaded()"),
        onPaymentSuccessful: (eventData: SafeOnRampEvent) =>
          console.log("onPaymentSuccessful(): ", eventData),
        onPaymentProcessing: (eventData: SafeOnRampEvent) =>
          console.log("onPaymentProcessing(): ", eventData),
        onPaymentError: (eventData: SafeOnRampEvent) =>
          console.log("onPaymentError(): ", eventData),
      },
    });

    setOnRampClient(onRampClient);

    console.log("Stripe sessionData: ", sessionData);
  };

  const closeStripeWidget = async () => {
    onRampClient?.close();
  };

  // we can pay Gelato tx relayer fees with native token & USDC
  // TODO: ADD native Safe Balance polling
  // TODO: ADD USDC Safe Balance polling

  // fetch safe address balance with polling
  const fetchSafeBalance = useCallback(async () => {
    const balance = await web3Provider?.getBalance(safeSelected);

    return balance?.toString();
  }, [web3Provider, safeSelected]);

  const safeBalance = usePolling(fetchSafeBalance);

  const state = {
    ownerAddress,
    chainId,
    chain,
    safes,

    isAuthenticated,

    web3Provider,

    loginWeb3Auth,
    logoutWeb3Auth,

    setChainId,

    safeSelected,
    safeBalance,
    setSafeSelected,

    isRelayerLoading,
    relayTransaction,
    gelatoTaskId,

    openStripeWidget,
    closeStripeWidget,
  };

  return (
    <accountAbstractionContext.Provider value={state}>
      {children}
    </accountAbstractionContext.Provider>
  );
};

export { useAccountAbstraction, AccountAbstractionProvider };
