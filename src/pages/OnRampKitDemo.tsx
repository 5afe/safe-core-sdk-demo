import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { CodeBlock, atomOneDark } from "react-code-blocks";
import WalletIcon from "@mui/icons-material/AccountBalanceWalletRounded";

import SafeInfo from "src/components/safe-info/SafeInfo";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";
import { useStepper } from "src/store/stepperContext";

const OnRampKitDemo = () => {
  const { onRampWithStripe, safeSelected, safeBalance, chain, chainId } =
    useAccountAbstraction();

  const { nextStep } = useStepper();

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
            href="https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/onramp-kit"
            target="_blank"
          >
            Onramp kit
          </Link>{" "}
          allows users to buy cryptocurrencies using a credit card and other
          payment options. Check our{" "}
          <Link
            href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk/onramp-kit"
            target="_blank"
          >
            Onramp kit documentation
          </Link>{" "}
          for more details!
        </Typography>

        <Typography textAlign="center">
          Click on "Buy USDC" to on-ramp funds to your Safe using Stripe
          widget! This widget is on `testmode`, you will need to use{" "}
          <Link
              href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk/onramp-kit#considerations-and-limitations"
              target="_blank"
            >
               fake data
          </Link>{" "}
          in order to simulate the process. Also if you are not connecting from the United States it won't allow you to use it.
        </Typography>

        {safeSelected && (
          <SafeInfo safeAddress={safeSelected} chainId={chainId} />
        )}
      </Box>

      <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
        <Tooltip
          title={"buy USDC to your Safe address using Stripe payment provider"}
        >
          {/* Buy USDC with our OnRamp kit */}
          <Button
            startIcon={<WalletIcon />}
            variant="contained"
            onClick={onRampWithStripe}
            disabled={!chain?.isStripePaymentsEnabled}
          >
            Buy USDC
            {!chain?.isStripePaymentsEnabled ? " (only in Mumbai chain)" : ""}
          </Button>
        </Tooltip>

        {/* Next Step */}
        <Button variant="contained" onClick={nextStep} disabled={!safeBalance}>
          Go to Relayer Demo
        </Button>
      </Box>

      {/* Stripe root widget */}
      <div id="stripe-root"></div>

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
            href="https://github.com/5afe/account-abstraction-demo-ui/blob/main/src/store/accountAbstractionContext.ts#L190"
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
          startingLineNumber={190}
          theme={atomOneDark}
        />
      </Box>
    </Box>
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
