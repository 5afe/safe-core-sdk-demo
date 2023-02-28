import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import QuestionMarkRoundedIcon from "@mui/icons-material/QuestionMarkRounded";

import AddressLabel from "src/components/address-label/AddressLabel";

import { LIGHT_THEME } from "src/theme/theme";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";


// TODO: rename this to connected owner?
function ConnectedWalletLabel() {
  const { isOwnerConnected, walletLogo, ownerAddress } = useAccountAbstraction();

  if (!isOwnerConnected) {
    // TODO: ADD NO CONNECTED WALLET LABEL
    return null;
  }

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
          {ownerAddress && (
            <AddressLabel address={ownerAddress} showBlockExplorerLink />
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
