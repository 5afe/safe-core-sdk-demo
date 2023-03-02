import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";

import Intro from "src/pages/Intro";
import AuthKitDemo from "src/pages/AuthKitDemo";
import OnRampKitDemo from "src/pages/OnRampKitDemo";
import RelayerKitDemo from "src/pages/RelayerKitDemo";
import LastStep from "src/pages/LastStep";
import Header from "src/components/header/Header";
import Providers from "src/components/providers/Providers";
import Stepper from "src/components/stepper/Stepper";

function App() {
  return (
    <Providers>
      <>
        <CssBaseline />

        {/* App header */}
        <Header />

        {/* App Title */}
        <StyledAppTitle variant="h4" component="h1">
          Safe Account Abstraction Demo
        </StyledAppTitle>

        {/* Stepper */}
        <Stepper
          labels={["Intro", "Auth kit", "Onramp kit", "Relay kit", "Thanks!"]}
        >
          {/* Intro Step */}
          <Intro />

          {/* Auth kit Step */}
          <AuthKitDemo />

          {/* Onramp kit Step */}
          <OnRampKitDemo />

          {/* Relay kit Step */}
          <RelayerKitDemo />

          {/* Final Screen */}
          <LastStep />
        </Stepper>
      </>
    </Providers>
  );
}

export default App;

const StyledAppTitle = styled(Typography)<{
  variant: string;
  component: string;
}>`
  margin-top: 64px !important;

  text-align: center;
  font-family: monospace;
  margin: 0 12px;
  letter-spacing: 0.3rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
