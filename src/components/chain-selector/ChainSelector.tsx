import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import chains from "src/chains/chains";

import ChainLabel from "src/components/chain-label/ChainLabel";
import { useAccountAbstraction } from "src/store/accountAbstractionContext";

const ChainSelector = () => {
  const { chain, setChainId } = useAccountAbstraction();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const switchChain = (chainId: string) => {
    setChainId(chainId);
    handleClose();
  };

  return (
    <div>
      <Button
        id="select-chain-button"
        aria-controls={open ? "select chain" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {chain && <ChainLabel chain={chain} />}
      </Button>
      <Menu
        id="chain-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "select-chain-button",
        }}
      >
        {chains.map((chain) => (
          <MenuItem
            onClick={() => switchChain(chain.id)}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <ChainLabel chain={chain} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ChainSelector;
