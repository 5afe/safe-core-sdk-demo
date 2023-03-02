import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const LastStep = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Typography textAlign="center" variant="h2" component="h2">
        Thanks!
      </Typography>

      <Typography textAlign="center">
        Check our{" "}
        <Link
          href="https://docs.gnosis-safe.io/learn/safe-core-account-abstraction-sdk"
          target="_blank"
        >
          Safe &#123;Core&#125; Account abstraction SDK documentation
        </Link>{" "}
        for more details!
      </Typography>
    </Box>
  );
};

export default LastStep;
