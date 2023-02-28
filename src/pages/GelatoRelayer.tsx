import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import WalletIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SendIcon from "@mui/icons-material/SendRounded";
import { utils, ethers, BigNumber } from "ethers";
import AccountAbstraction, {
  MetaTransactionData,
  MetaTransactionOptions,
} from "@safe-global/account-abstraction";
import { GelatoRelayAdapter } from "@safe-global/relay-kit";
import {
  SafeOnRampKit,
  SafeOnRampEvent,
  SafeOnRampProviderType,
} from "@safe-global/onramp-kit";

import SafesOwnedSelector from "src/components/safes-owned-selector/SafesOwnedSelector";
import SafeInfo from "src/components/safe-info/SafeInfo";
import GelatoTaskStatusLabel from "src/components/gelato-task-status-label/GelatoTaskStatusLabel";
import { useWallet } from "src/store/walletContext";

// TODO: rename this to Account Abstraction demo
function GelatoRelayer() {
  const {
    walletAddress: ownerAddress,
    web3Provider,
    chainId,
    connectWeb2Login,
    safes,
  } = useWallet();

  const isWalletConnected = !!ownerAddress && !!chainId;

  const [safeSelected, setSafeSelected] = useState<string>("");
  const [safeAccountAbstraction, setSafeAccountAbstraction] =
    useState<AccountAbstraction>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gelatoTaskId, setGelatoTaskId] = useState<string>();

  // TODO: MOVE THIS T= USE_ACCOUNT_ABSTRACTION custom hook
  useEffect(() => {
    // initialize account abstraction here
    const initializeSDK = async () => {
      if (web3Provider) {
        const signer = web3Provider.getSigner();
        const relayAdapter = new GelatoRelayAdapter();
        const safeAccountAbstraction = new AccountAbstraction(signer);

        await safeAccountAbstraction.init({ relayAdapter });

        setSafeAccountAbstraction(safeAccountAbstraction);

        const hasSafes = safes.length > 0;

        const safeSelected = hasSafes
          ? safes[0]
          : safeAccountAbstraction.getSafeAddress();

        setSafeSelected(safeSelected);
      }
    };

    initializeSDK();
  }, [safes, web3Provider]);

  const relayTransaction = async () => {
    if (web3Provider) {
      setIsLoading(true);

      // TODO: create a mint NTF tranasction instead of a dump tx?
      const safeTransaction: MetaTransactionData = {
        to: safeSelected,
        data: "0x",
        value: BigNumber.from(utils.parseUnits("0.01", "ether").toString()),
        operation: 0, // OperationType.Call,
      };

      const options: MetaTransactionOptions = {
        isSponsored: false,
        // TODO: remove this
        gasLimit: BigNumber.from("600000"),
        gasToken: ethers.constants.AddressZero, // native token ???
      };

      const gelatoTaskId = await safeAccountAbstraction?.relayTransaction(
        safeTransaction,
        options
      );

      setIsLoading(false);
      setGelatoTaskId(gelatoTaskId);
    }
  };

  // onramp implementation
  const getFundsWithStripe = async () => {
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
      // sessionId: sessionId, // TODO: add optional sessionId ?¿
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

    console.log("Stripe sessionData: ", sessionData);
  };

  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
      }}
    >
      {isWalletConnected ? (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          {/* Safe salector */}
          <SafesOwnedSelector
            safeSelected={safeSelected}
            onSelectSafe={setSafeSelected}
          />

          {/* Safe selected info */}
          {safeSelected && (
            <SafeInfo safeAddress={safeSelected} chainId={chainId} />
          )}

          {/* send relay transaction button */}
          {!isLoading && !gelatoTaskId && (
            <Button
              startIcon={<SendIcon />}
              variant="contained"
              disabled={!safeSelected}
              onClick={relayTransaction}
            >
              Send Relayed Tx
            </Button>
          )}

          {isLoading && <CircularProgress />}

          {/* Gelato status label */}
          {gelatoTaskId && (
            <GelatoTaskStatusLabel
              gelatoTaskId={gelatoTaskId}
              chainId={chainId}
            />
          )}

          {/* OnRamp Stripe example */}
          <>
            {/* Stripe root widget */}
            <div id="stripe-root"></div>

            <Button
              startIcon={<WalletIcon />}
              variant="contained"
              onClick={getFundsWithStripe}
            >
              Get funds with Stripe
            </Button>
          </>
        </Box>
      ) : (
        <Button
          startIcon={<WalletIcon />}
          variant="contained"
          onClick={() => connectWeb2Login()}
        >
          Connect with Web2 Auth
        </Button>
      )}
    </Container>
  );
}

export default GelatoRelayer;
