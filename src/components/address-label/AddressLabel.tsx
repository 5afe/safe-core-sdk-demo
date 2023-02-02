import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { useWallets } from "@web3-onboard/react";
import OpenInNew from "@mui/icons-material/OpenInNew";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import { styled } from "@mui/material/styles";

import useMemoizedAddressLabel from "src/hooks/useMemoizedAddressLabel";
import chains from "src/chains/chains";

type AddressLabelProps = {
  address: string;
  showBlockExplorerLink?: boolean;
  showCopyIntoClipboardButton?: boolean;
};

const AddressLabel = ({
  address,
  showBlockExplorerLink,
  showCopyIntoClipboardButton,
}: AddressLabelProps) => {
  const [connectedWallet] = useWallets();

  // TODO: create get chain fn
  const chain = chains.find(
    (chain) => chain.id === connectedWallet?.chains?.[0]?.id
  );

  const addressLabel = useMemoizedAddressLabel(address);

  const blockExplorerLink = `${chain?.blockExplorerUrl}/address/${address}`;

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      component="span"
    >
      <Tooltip title={address}>
        <span>{addressLabel}</span>
      </Tooltip>

      {/* Button to copy into clipboard */}
      {showCopyIntoClipboardButton && (
        <Tooltip title={"Copy address into clipboard"}>
          <StyledIconButton
            onClick={() => navigator?.clipboard?.writeText?.(address)}
            size={"small"}
            color="inherit"
          >
            <FileCopyOutlinedIcon sx={{ fontSize: "14px" }} color="inherit" />
          </StyledIconButton>
        </Tooltip>
      )}

      {/* Button to etherscan */}
      {showBlockExplorerLink && blockExplorerLink && (
        <Tooltip title={"view details on block Explorer"}>
          <IconButton
            component="a"
            href={blockExplorerLink}
            target="_blank"
            rel="noopener"
            size={"small"}
            color="inherit"
          >
            <OpenInNew sx={{ fontSize: "14px" }} color="inherit" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};

export default AddressLabel;

const StyledIconButton = styled(IconButton)`
  margin-left: 0px;
`;
