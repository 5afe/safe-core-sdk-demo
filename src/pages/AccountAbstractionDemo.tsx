import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import WalletIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import SendIcon from "@mui/icons-material/SendRounded";

import SafesOwnedSelector from "src/components/safes-owned-selector/SafesOwnedSelector";
import SafeInfo from "src/components/safe-info/SafeInfo";
import GelatoTaskStatusLabel from "src/components/gelato-task-status-label/GelatoTaskStatusLabel";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";

function AccountAbstractionDemo() {
  const {
    connectWeb2Login,
    isOwnerConnected,
    chainId,
    chain,

    safeSelected,

    isRelayerLoading,
    relayTransaction,
    gelatoTaskId,
    setSafeSelected,

    onRampWithStripe,
  } = useAccountAbstraction();

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
      {isOwnerConnected ? (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          {/* Safe salector */}
          <SafesOwnedSelector
            safeSelected={safeSelected || ""}
            onSelectSafe={setSafeSelected}
          />

          {/* Safe selected info */}
          {safeSelected && (
            <SafeInfo safeAddress={safeSelected} chainId={chainId} />
          )}

          {/* send relay transaction button */}
          {/* TODO: disabled if balance === 0 */}

          {!isRelayerLoading && !gelatoTaskId && (
            <Button
              startIcon={<SendIcon />}
              variant="contained"
              disabled={!safeSelected}
              onClick={relayTransaction}
            >
              Send Relayed Tx
            </Button>
          )}

          {isRelayerLoading && <CircularProgress />}

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

            <Tooltip
              title={
                "buy USDC to your Safe address using Stripe payment provider"
              }
            >
              <Button
                startIcon={<WalletIcon />}
                variant="contained"
                onClick={onRampWithStripe}
                disabled={!chain?.isStripePaymentsEnabled}
              >
                Buy USDC
                {!chain?.isStripePaymentsEnabled
                  ? " (only in Mumbai chain)"
                  : ""}
              </Button>
            </Tooltip>
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

export default AccountAbstractionDemo;
