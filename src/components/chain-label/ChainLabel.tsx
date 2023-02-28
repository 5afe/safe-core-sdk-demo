import { styled } from "@mui/material/styles";

import Chain from "src/models/chain";

type ChainLabelProps = {
  chain: Chain;
};

const ChainLabel = ({ chain }: ChainLabelProps) => {
  const { label, color } = chain;
  return <Label color={color}>{label}</Label>;
};

export default ChainLabel;

const Label = styled("span")(
  ({ theme, color }) => `
    
    margin-right: 8px;
    border-radius: 4px;
    padding: 4px 12px;

    border: 1px solid #fff;
  
    background-color: ${color};
  
    color: ${theme.palette.getContrastText(color as string)};  
    `
);
