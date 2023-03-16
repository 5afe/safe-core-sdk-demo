import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import safeLogo from "src/assets/safe-logo.svg";

type LastStepProps = {
  previousStep: () => void;
};

const LastStep = ({ previousStep }: LastStepProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      paddingTop="72px"
      paddingLeft="100px"
    >
      <img src={safeLogo} alt="safe logo" height="30px" />

      <Typography variant="h1" fontSize="64px" lineHeight="76px">
        Come MAArch with us in our Account Abstraction hackathon.
      </Typography>

      <Box display="flex" gap={2} marginTop="32px">
        <Button variant="outlined" onClick={previousStep}>
          Back to Demo
        </Button>

        <Button
          variant="contained"
          href="https://dorahacks.io/hackathon/safe"
          target="_blank"
        >
          Join the Hackaton
        </Button>
      </Box>
    </Box>
  );
};

export default LastStep;
