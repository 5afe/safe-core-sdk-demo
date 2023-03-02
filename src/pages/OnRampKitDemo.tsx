import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
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
      <Typography textAlign="center">
        The{" "}
        <Link
          href="https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/onRamp-kit"
          target="_blank"
        >
          Onramp kit
        </Link>{" "}
        allows users to buy cryptocurrencies using a credit card and other
        payment options. Check our{" "}
        <Link
          href="https://docs.gnosis-safe.io/learn/safe-core-account-abstraction-sdk/onramp-kit"
          target="_blank"
        >
          Onramp kit documentation
        </Link>{" "}
        for more details!
      </Typography>

      <Typography textAlign="center">
        Click on "Buy USDC" to on-ramping funds to your Safe using Stripe
        Widget! (if you are not from US please use a VPN to be able to complete
        the payment)
      </Typography>

      {safeSelected && (
        <SafeInfo safeAddress={safeSelected} chainId={chainId} />
      )}

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

      {/* Stripe root widget */}
      <div id="stripe-root"></div>
    </Box>
  );
};

export default OnRampKitDemo;
