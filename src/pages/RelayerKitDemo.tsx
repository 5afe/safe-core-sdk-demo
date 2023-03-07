import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { CodeBlock, atomOneDark } from "react-code-blocks";
import SendIcon from "@mui/icons-material/SendRounded";

import SafeInfo from "src/components/safe-info/SafeInfo";
import GelatoTaskStatusLabel from "src/components/gelato-task-status-label/GelatoTaskStatusLabel";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";
import { useStepper } from "src/store/stepperContext";
import { useState } from "react";

const RelayerKitDemo = () => {
  const {
    chainId,

    safeSelected,
    safeBalance,

    isRelayerLoading,
    relayTransaction,
    gelatoTaskId,
  } = useAccountAbstraction();

  const { nextStep } = useStepper();

  const [transactionHash, setTransactionHash] = useState<string>("");

  // TODO: ADD PAY FEES USING USDC TOKEN

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Box
        component={Paper}
        sx={{ border: "1px solid #fff" }}
        padding="18px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Typography textAlign="center">
          The{" "}
          <Link
            href="https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/auth-kit"
            target="_blank"
          >
            Relay kit
          </Link>{" "}
          allows users to pay transaction fees (gas fees) using any ERC-20
          tokens in your Safe!. Check our{" "}
          <Link
            href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk/relay-kit"
            target="_blank"
          >
            Relay Kit documentation
          </Link>{" "}
          for more details!
        </Typography>

        {/* Safe selected info */}
        {safeSelected && (
          <SafeInfo safeAddress={safeSelected} chainId={chainId} />
        )}
      </Box>

      {/* send fake transaction to Gelato relayer */}
      {!isRelayerLoading && !gelatoTaskId && (
        <Button
          startIcon={<SendIcon />}
          variant="contained"
          disabled={!safeBalance}
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
          setTransactionHash={setTransactionHash}
          transactionHash={transactionHash}
        />
      )}

      {/* Next Step */}
      {gelatoTaskId && (
        <Button
          variant="contained"
          onClick={nextStep}
          disabled={!transactionHash}
        >
          Next
        </Button>
      )}

      <Box
        component={Paper}
        sx={{ border: "1px solid #fff" }}
        padding="18px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Typography textAlign="center" variant="h5" component="h2">
          How to use it
        </Typography>

        <Typography textAlign="center">
          This implementation is defined in our{" "}
          <Link
            href="https://github.com/5afe/account-abstraction-demo-ui/blob/main/src/store/accountAbstractionContext.tsx#L154"
            target="_blank"
          >
            <code>accountAbstractionContext.tsx</code>
          </Link>{" "}
          file.
        </Typography>

        <CodeBlock
          text={code}
          language={"javascript"}
          showLineNumbers
          startingLineNumber={160}
          theme={atomOneDark}
        />
      </Box>
    </Box>
  );
};

export default RelayerKitDemo;

const code = `import { GelatoRelayAdapter } from '@safe-global/relay-kit'

const relayAdapter = new GelatoRelayAdapter()

relayAdapter.relayTransaction({
  target: '0x...', // the Safe address
  encodedTransaction: '0x...', // Encoded Safe transaction data
  chainId: 5
})`;
