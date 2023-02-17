import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useConnectWallet } from "@web3-onboard/react";
import WalletIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SendIcon from "@mui/icons-material/SendRounded";
import { utils, ethers, BigNumber } from "ethers";
import AccountAbstraction, {
  MetaTransactionData,
  MetaTransactionOptions,
} from "@safe-global/account-abstraction";
import GelatoNetworkRelay from "@safe-global/relay-provider";

import SafesOwnedSelector from "src/components/safes-owned-selector/SafesOwnedSelector";
import SafeInfo from "src/components/safe-info/SafeInfo";
import useSafeCoreSDK from "src/hooks/useSafeCoreSDK";
import GelatoTaskStatusLabel from "src/components/gelato-task-status-label/GelatoTaskStatusLabel";

function GelatoRelayer() {
  const [
    {
      wallet, // the wallet that has been connected or null if not yet connected
      connecting, // boolean indicating if connection is in progress
    },
    connect, // function to call to initiate user to connect wallet, returns a list of WalletState objects (connected wallets)
    disconnect, // function to call with wallet<DisconnectOptions> to disconnect wallet, returns a list of WalletState objects (connected wallets)
    updateBalances, // function to be called with an optional array of wallet addresses connected through Onboard to update balance or empty/no params to update all connected wallets
    setWalletModules, // function to be called with an array of wallet modules to conditionally allow connection of wallet types i.e. setWalletModules([ledger, trezor, injected])
    setPrimaryWallet, // function that can set the primary wallet and/or primary account within that wallet. The wallet that is set needs to be passed in for the first parameter and if you would like to set the primary account, the address of that account also needs to be passed in
  ] = useConnectWallet();

  const [safeSelected, setSafeSelected] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gelatoTaskId, setGelatoTaskId] = useState<string>();

  const { web3Provider } = useSafeCoreSDK(safeSelected);

  const ownerAddress = wallet?.accounts?.[0]?.address;
  const chainId = wallet?.chains?.[0]?.id;
  const isWalletConnected = !!ownerAddress && !!chainId;

  useEffect(() => {
    if (wallet && ownerAddress) {
      setPrimaryWallet(wallet, ownerAddress);
    }
  }, [wallet, ownerAddress, setPrimaryWallet]);

  const relayTransaction = async () => {
    if (web3Provider) {
      setIsLoading(true);

      const relayProvider = new GelatoNetworkRelay();

      const safeAccountAbstraction = new AccountAbstraction(
        web3Provider.getSigner(), // safe owner signer
        safeSelected, // safe address
        Number(chainId) // safe chain Id
      );

      safeAccountAbstraction.setRelayProvider(relayProvider);

      const safeTransaction: MetaTransactionData = {
        to: safeSelected,
        data: "0x",
        // value: utils.parseUnits("0.01", "ether").toString(),
        value: BigNumber.from(utils.parseUnits("0.01", "ether").toString()),
        operation: 0, // OperationType.Call,
      };

      const options: MetaTransactionOptions = {
        isSponsored: false,
        gasLimit: BigNumber.from("200000"),
        gasToken: ethers.constants.AddressZero,
      };

      const gelatoTaskId = await safeAccountAbstraction.relayTransaction(
        safeTransaction,
        options
      );

      setIsLoading(false);
      setGelatoTaskId(gelatoTaskId);
    }
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
          {/* TODO: NO SAFES OWNER LABEL (redirect to create a safe) */}

          {/* Safe salector */}
          <SafesOwnedSelector
            ownerAddress={ownerAddress}
            chainId={chainId}
            safeSelected={safeSelected}
            handleChange={setSafeSelected}
          />

          {/* Safe selected info */}
          <SafeInfo safeAddress={safeSelected} chainId={chainId} />

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
        </Box>
      ) : (
        <Button
          startIcon={<WalletIcon />}
          variant="contained"
          onClick={() => connect()}
        >
          Connect
        </Button>
      )}
    </Container>
  );
}

export default GelatoRelayer;
