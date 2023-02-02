import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { useWallets } from "@web3-onboard/react";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";

import AddressLabel from "src/components/address-label/AddressLabel";
import metamaskLogo from "src/assets/Metamask_logo.svg";
import walletConnectLogo from "src/assets/WalletConnect_logo.png";
import { LIGHT_THEME } from "src/theme/theme";

const logos: Record<string, string> = {
  WalletConnect: walletConnectLogo,
  MetaMask: metamaskLogo,
};

function ConnectedWalletLabel() {
  const [connectedWallet] = useWallets();

  if (!connectedWallet) {
    // TODO: ADD NO CONNECTED WALLET LABEL
    return null;
  }

  const walletLogo = logos[connectedWallet?.label];
  const walletAddress = connectedWallet?.accounts?.[0]?.address;

  return (
    <Container>
      <Stack direction="row" alignItems="center" spacing={0.5} component="span">
        {walletLogo ? (
          <img src={walletLogo} alt="connected Wallet logo" height={24} />
        ) : (
          <Tooltip title="Unknown connected Wallet">
            <QuestionMarkRoundedIcon />
          </Tooltip>
        )}

        <Typography variant="body2">
          {walletAddress && (
            <AddressLabel address={walletAddress} showBlockExplorerLink />
          )}
        </Typography>
      </Stack>
    </Container>
  );
}

export default ConnectedWalletLabel;

const Container = styled("div")(
  ({ theme }) => `
    margin-right: 8px;
    border-radius: 4px;
    padding: 4px 12px;
  
    background-color: ${
      theme.palette.mode === LIGHT_THEME
        ? theme.palette.background.paper
        : theme.palette.grey["800"]
    };
  
    color: ${theme.palette.getContrastText(theme.palette.background.paper)};
    
    `
);
