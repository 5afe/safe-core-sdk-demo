import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
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
      <Typography textAlign="center">
        The{" "}
        <Link
          href="https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/auth-kit"
          target="_blank"
        >
          Relay kit
        </Link>{" "}
        allows users to pay transaction fees (gas fees) using any ERC-20 tokens
        in your Safe!. Check our{" "}
        <Link
          href="https://docs.gnosis-safe.io/learn/safe-core-account-abstraction-sdk/relay-kit"
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

      <Typography textAlign="center" variant="h5" component="h2">
        How to use it
      </Typography>

      <Typography textAlign="center">
        This implementation is defined in our{" "}
        <Link
          href="https://github.com/5afe/account-abstraction-demo-ui/blob/main/src/store/accountAbstractionContext.ts#L154"
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
  );
};

export default RelayerKitDemo;

const code = `const signer = web3Provider.getSigner();
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
 `;
