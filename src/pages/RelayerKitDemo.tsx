import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import styled from "@emotion/styled";
import { Theme } from "@mui/material";
import { CodeBlock, atomOneDark } from "react-code-blocks";
import SendIcon from "@mui/icons-material/SendRounded";
import { utils } from "ethers";

import SafeInfo from "src/components/safe-info/SafeInfo";
import GelatoTaskStatusLabel from "src/components/gelato-task-status-label/GelatoTaskStatusLabel";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";
import { useState } from "react";

const transferAmount = 0.01;

const RelayerKitDemo = () => {
  const {
    chainId,

    safeSelected,
    safeBalance,

    isRelayerLoading,
    relayTransaction,
    gelatoTaskId,

    isAuthenticated,
    loginWeb3Auth,
  } = useAccountAbstraction();

  const [transactionHash, setTransactionHash] = useState<string>("");

  // TODO: ADD PAY FEES USING USDC TOKEN

  const hasFunds =
    Number(utils.formatEther(safeBalance || "0")) > transferAmount;

  return (
    <>
      <Typography variant="h2" component="h1">
        The Relay Kit
      </Typography>

      <Typography marginTop="16px">
        Allow users to pay using any ERC-20 tokens, without having to manage
        gas. Sponsor transactions on behalf of your users. On your first relayed
        transaction, a Safe Account will be automatically deployed and your
        address will be assigned as the Safe owner.
      </Typography>

      <Typography marginTop="24px" marginBottom="8px">
        Find more info at:
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Link
          href="https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/relay-kit"
          target="_blank"
        >
          Github
        </Link>

        <Link
          href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk/relay-kit"
          target="_blank"
        >
          Documentation
        </Link>
      </Stack>

      <Divider style={{ margin: "32px 0 28px 0" }} />

      {/* Relay Demo */}
      <Typography
        variant="h3"
        component="h2"
        fontWeight="700"
        marginBottom="16px"
      >
        Interactive demo
      </Typography>

      {!isAuthenticated ? (
        <ConnectedContainer
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={3}
        >
          <Typography variant="h4" component="h3" fontWeight="700">
            To use the Relay Kit you need to be authenticated
          </Typography>

          <Button variant="contained" onClick={loginWeb3Auth}>
            Connect
          </Button>
        </ConnectedContainer>
      ) : (
        <Box display="flex" gap={3}>
          {/* safe Account */}
          <ConnectedContainer>
            <Typography fontWeight="700">Safe Account</Typography>

            <Typography fontSize="14px" marginTop="8px" marginBottom="32px">
              Your Safe account (Smart Contract) holds and protects your assets.
            </Typography>

            {/* Safe Info */}
            {safeSelected && (
              <SafeInfo safeAddress={safeSelected} chainId={chainId} />
            )}
          </ConnectedContainer>

          {/* Relay Transaction */}
          <ConnectedContainer
            display="flex"
            flexDirection="column"
            gap={2}
            alignItems="flex-start"
          >
            <Typography fontWeight="700">Relayed transaction</Typography>

            {/* Gelato status label */}
            {gelatoTaskId && (
              <GelatoTaskStatusLabel
                gelatoTaskId={gelatoTaskId}
                chainId={chainId}
                setTransactionHash={setTransactionHash}
                transactionHash={transactionHash}
              />
            )}

            {isRelayerLoading && (
              <LinearProgress sx={{ alignSelf: "stretch" }} />
            )}

            {!isRelayerLoading && !gelatoTaskId && (
              <>
                <Typography fontSize="14px">
                  Find out about the status of your relayed transaction.
                </Typography>

                {/* send fake transaction to Gelato relayer */}
                <Button
                  startIcon={<SendIcon />}
                  variant="contained"
                  disabled={!safeBalance || !hasFunds}
                  onClick={relayTransaction}
                >
                  Send Transaction
                </Button>
              </>
            )}
          </ConnectedContainer>
        </Box>
      )}

      <Divider style={{ margin: "40px 0 30px 0" }} />

      <Typography
        variant="h3"
        component="h2"
        fontWeight="700"
        marginBottom="16px"
      >
        How to use it
      </Typography>

      {/* TODO: create a component for this? */}
      <CodeContainer>
        <CodeBlock
          text={code}
          language={"javascript"}
          showLineNumbers
          startingLineNumber={96}
          theme={atomOneDark}
        />
      </CodeContainer>
    </>
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

const ConnectedContainer = styled(Box)<{
  theme?: Theme;
}>(
  ({ theme }) => `
  
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 40px 32px;
`
);

const CodeContainer = styled(Box)<{
  theme?: Theme;
}>(
  ({ theme }) => `
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 16px;
`
);
