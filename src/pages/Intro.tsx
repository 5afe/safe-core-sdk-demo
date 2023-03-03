import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";

import { useStepper } from "src/store/stepperContext";
import ChainSelector from "src/components/chain-selector/ChainSelector";

const Intro = () => {
  const { nextStep } = useStepper();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      <Box
        component={Paper}
        sx={{ border: "1px solid #fff"}}
        padding="18px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Typography textAlign="center">
          <Link
            href="https://github.com/safe-global/account-abstraction-sdk"
            target="_blank"
          >
            The Safe&#123;Core&#125; Account abstraction SDK{" "}
          </Link>{" "}
          allows builders to add account abstraction functionality into their
          apps. This demo is a sample of the use of our different packages (Auth
          Kit, OnRamp Kit & relayer Kit)
        </Typography>

        <Typography textAlign="center">
          Check our{" "}
          <Link
            href="https://docs.gnosis-safe.io/learn/safe-core-account-abstraction-sdk"
            target="_blank"
          >
            Safe&#123;Core&#125; Account abstraction SDK documentation
          </Link>{" "}
          for more details!
        </Typography>

        <Typography textAlign="center">
          Select your chain and start this journey!
        </Typography>
      </Box>

      <ChainSelector />

      <Button variant="contained" onClick={nextStep}>
        Start!
      </Button>
    </Box>
  );
};

export default Intro;
