import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";

const LastStep = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      component={Paper}
      sx={{ border: "1px solid #fff" }}
      padding="18px"
    >
      <Typography textAlign="center" variant="h2" component="h2">
        Thanks!
      </Typography>

      <Typography textAlign="center">
        Check our{" "}
        <Link
          href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk"
          target="_blank"
        >
          Safe&#123;Core&#125; Account abstraction SDK documentation
        </Link>{" "}
        for more details!
      </Typography>
    </Box>
  );
};

export default LastStep;
