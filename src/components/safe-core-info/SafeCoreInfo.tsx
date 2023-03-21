import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";

import introVideo from "src/assets/intro-chip.webm";
import introImage from "src/assets/intro-chip.png";

const SafeCoreInfo = () => {
  return (
    <div>
      {/* video loop */}
      <video autoPlay loop muted height="500px" width="500px">
        <source src={introVideo} />
        <img src={introImage} alt="safe core img" />
      </video>

      {/* Links */}
      <Typography marginLeft={"42px"} marginTop={"24px"}>
        More information about the SDK:
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        marginTop={"8px"}
        marginLeft={"42px"}
      >
        <Link
          href="https://github.com/safe-global/account-abstraction-sdk"
          target="_blank"
        >
          Github
        </Link>

        <Link
          href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk"
          target="_blank"
        >
          Documentation
        </Link>

        <Link href="https://chat.safe.global" target="_blank">
          Discord
        </Link>
      </Stack>
    </div>
  );
};

export default SafeCoreInfo;
