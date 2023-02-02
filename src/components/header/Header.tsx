import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DarkThemeIcon from "@mui/icons-material/Brightness4";
import LightThemeIcon from "@mui/icons-material/Brightness7";
import styled from "@emotion/styled";

import ConnectedWalletLabel from "src/components/connected-wallet-label/ConnectedWalletLabel";
import safeLogo from "src/assets/safe-logo.svg";

type HeaderProps = {
  switchThemeMode: () => void;
  isDarkTheme: boolean;
};

function Header({ switchThemeMode, isDarkTheme }: HeaderProps) {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* App Logo */}
          <AppLogoHeader id="app-logo-header" src={safeLogo} alt="app logo" />

          {/* App Title */}
          <StyledAppTitle variant="h6" component="h1">
            Safe Account Abstraction POC
          </StyledAppTitle>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            flexGrow={1}
          >
            {/* connected Wallet */}
            <ConnectedWalletLabel />

            {/* Switch Theme mode button */}
            <Tooltip title="Switch Theme mode">
              <IconButton
                sx={{ marginLeft: 2 }}
                size="large"
                color="inherit"
                aria-label="switch theme mode"
                edge="end"
                onClick={switchThemeMode}
              >
                {isDarkTheme ? <LightThemeIcon /> : <DarkThemeIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;

const AppLogoHeader = styled("img")`
  height: 40px;
  pointer-events: none;

  animation: app-logo-spin infinite 20s linear;

  @keyframes app-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const StyledAppTitle: any = styled(Typography)<{
  variant: string;
  component: string;
}>`
  font-family: monospace;
  margin: 0 12px;
  letter-spacing: 0.3rem;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
