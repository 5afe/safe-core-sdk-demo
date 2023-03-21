import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import styled from "@emotion/styled";
import { Theme } from "@mui/material";
import { CodeBlock, atomOneDark } from "react-code-blocks";
import WalletIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";

import SafeInfo from "src/components/safe-info/SafeInfo";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";
import { useState } from "react";

const OnRampKitDemo = () => {
  const {
    openStripeWidget,
    closeStripeWidget,
    safeSelected,
    chain,
    chainId,
    isAuthenticated,
    loginWeb3Auth,
  } = useAccountAbstraction();

  const [showStripeWidget, setShowStripeWidget] = useState<boolean>(false);

  return (
    <>
      <Typography variant="h2" component="h1">
        The Onramp Kit
      </Typography>

      <Typography marginTop="16px">
        Allow users to buy cryptocurrencies using a credit card and other
        payment options directly within your app." Click on "Buy USDC" to
        on-ramp funds to your Safe using the Stripe widget!
      </Typography>

      <Typography marginTop="24px" marginBottom="8px">
        Find more info at:
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Link
          href="https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/onramp-kit"
          target="_blank"
        >
          Github
        </Link>

        <Link
          href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk/onramp-kit"
          target="_blank"
        >
          Documentation
        </Link>
      </Stack>

      <Divider style={{ margin: "32px 0 28px 0" }} />

      {/* OnRamp Demo */}
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
            To be able to use the OnRamp Kit you need to be authenticated
          </Typography>

          <Button variant="contained" onClick={loginWeb3Auth}>
            Connect
          </Button>
        </ConnectedContainer>
      ) : (
        <Box display="flex" gap={3} alignItems="flex-start">
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

          {/* Stripe widget */}
          <ConnectedContainer>
            <Typography fontWeight="700">Stripe widget</Typography>

            <Typography fontSize="14px" marginTop="8px" marginBottom="32px">
              This widget is on testmode, you will need to use{" "}
              <Link
                href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk/onramp-kit#considerations-and-limitations"
                target="_blank"
              >
                fake data
              </Link>{" "}
              in order to simulate the process. Available only in the United
              States.
            </Typography>

            {!showStripeWidget ? (
              <Tooltip
                title={
                  "buy USDC to your Safe address using Stripe payment provider"
                }
              >
                {/* Buy USDC with our OnRamp kit */}
                <Button
                  startIcon={<WalletIcon />}
                  variant="contained"
                  onClick={async () => {
                    setShowStripeWidget(true);
                    await openStripeWidget();
                  }}
                  disabled={!chain?.isStripePaymentsEnabled}
                >
                  Buy USDC
                  {!chain?.isStripePaymentsEnabled
                    ? " (only in Mumbai chain)"
                    : ""}
                </Button>
              </Tooltip>
            ) : (
              <Stack
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
              >
                <Tooltip title={"close Stripe Widget"}>
                  <IconButton
                    size="small"
                    color="primary"
                    sx={{ alignSelf: "flex-end" }}
                    onClick={async () => {
                      setShowStripeWidget(false);
                      await closeStripeWidget();
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* Stripe root widget */}
                <div id="stripe-root"></div>
              </Stack>
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

export default OnRampKitDemo;

const code = `import { SafeOnRampKit, SafeOnRampProviderType } from '@safe-global/onramp-kit'

const safeOnRamp = await SafeOnRampKit.init(SafeOnRampProviderType.Stripe, {
  onRampProviderConfig: {
    stripePublicKey: <You public key>, // You should get your own keys from Stripe
    onRampBackendUrl: <Your backend url> // You should deploy your own server
  }
})

const sessionData = await safeOnRamp.open({
  walletAddress,
  networks: ['polygon']
  element: '#stripe-root',
  events: {
    onLoaded: () => console.log('Loaded'),
    onPaymentSuccessful: () => console.log('Payment successful')
    onPaymentError: () => console.log('Payment failed')
    onPaymentProcessing: () => console.log('Payment processing')
  }
})
`;

const ConnectedContainer = styled(Box)<{
  theme?: Theme;
}>(
  ({ theme }) => `
  
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 40px 32px;

  min-height: 265px;
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
