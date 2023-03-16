import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import AddressLabel from "src/components/address-label/AddressLabel";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";
import authLogo from "src/assets/web3Auth_logo.png";

// TODO: rename this to connected owner?
// TODO: Add logout icon
function ConnectedWalletLabel() {
  const { isAuthenticated, ownerAddress } = useAccountAbstraction();

  if (!isAuthenticated) {
    // TODO: ADD NO CONNECTED WALLET LABEL
    return null;
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1.5} component="span">
      <StyledImg src={authLogo} alt="connected Wallet logo" height={"50px"} />

      <Typography variant="body2">
        {ownerAddress && (
          <AddressLabel address={ownerAddress} showBlockExplorerLink />
        )}
      </Typography>
    </Stack>
  );
}

export default ConnectedWalletLabel;

const StyledImg = styled("img")`
  border-radius: 50%;
`;
