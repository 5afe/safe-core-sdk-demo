import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useConnectWallet } from "@web3-onboard/react";
import WalletIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SendIcon from "@mui/icons-material/SendRounded";
import { utils } from "ethers";

import SafesOwnedSelector from "src/components/safes-owned-selector/SafesOwnedSelector";
import SafeInfo from "src/components/safe-info/SafeInfo";
import useSafeCoreSDK from "src/hooks/useSafeCoreSDK";
import createSafeTransaction from "src/utils/createSafeTransaction";

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

  const safeSdk = useSafeCoreSDK(safeSelected);

  const ownerAddress = wallet?.accounts?.[0]?.address;
  const chainId = wallet?.chains?.[0]?.id;
  const isWalletConnected = !!ownerAddress && !!chainId;

  useEffect(() => {
    if (wallet && ownerAddress) {
      setPrimaryWallet(wallet, ownerAddress);
    }
  }, [wallet, ownerAddress, setPrimaryWallet]);

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

          {/* send transaction button */}
          <Button
            startIcon={<SendIcon />}
            variant="contained"
            disabled={!safeSelected}
            onClick={async () => {
              if (safeSdk) {
                const transaction = {
                  to: safeSelected,
                  value: utils.parseUnits("0.01", "ether").toString(),
                  data: "0x",
                };

                const safeTransaction = await createSafeTransaction(
                  safeSdk,
                  transaction
                );

                console.log("safeTransaction: ", safeTransaction);

                const signedSafeTransaction = await safeSdk.signTransaction(
                  safeTransaction
                );

                console.log("signedSafeTransaction: ", signedSafeTransaction);

                // TODO: REMOVE THIS
                const executeTxResponse = await safeSdk.executeTransaction(
                  safeTransaction
                );

                console.log("executeTxResponse: ", executeTxResponse);

                await executeTxResponse.transactionResponse?.wait();

                console.log("Transaction Executed!: ");

                console.log("TODO: Send Transaction (SDK)");
              }
            }}
          >
            Send Tx
          </Button>
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
