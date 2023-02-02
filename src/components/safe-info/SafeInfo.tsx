import { useCallback } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material";
import styled from "@emotion/styled";
import { utils } from "ethers";

import AddressLabel from "src/components/address-label/AddressLabel";
import AmountLabel from "src/components/amount-label/AmountLabel";
import getSafeInfo from "src/api/getSafeInfo";
import getSafeBalances from "src/api/getSafeBalances";
import chains from "src/chains/chains";
import useApi from "src/hooks/useApi";
import safeLogo from "src/assets/safe-logo.svg";
import { DARK_THEME, LIGHT_THEME } from "src/theme/theme";

type SafeInfoProps = {
  safeAddress: string;
  chainId: string;
};

function SafeInfo({ safeAddress, chainId }: SafeInfoProps) {
  const fetchInfo = useCallback(
    (signal: AbortSignal) => getSafeInfo(safeAddress, chainId, { signal }),
    [safeAddress, chainId]
  );

  const fetchBalances = useCallback(
    (signal: AbortSignal) => getSafeBalances(safeAddress, chainId, { signal }),
    [safeAddress, chainId]
  );

  const { isLoading: isLoadingInfo, data: safeInfo } = useApi(fetchInfo);
  const { isLoading: isLoadingBalance, data: balances } = useApi(fetchBalances);

  const isLoading = isLoadingInfo || isLoadingBalance;

  // TODO: create get chain fn
  const chain = chains.find(({ id }) => id === chainId);

  // console.log("safeInfo: ", safeInfo);
  // console.log("balances: ", balances);
  // console.log("isLoading: ", isLoading);

  // TODO: create get native token amount
  const amount = balances?.find(
    (balance) => balance.tokenAddress === null
  )?.balance;

  const owners = safeInfo?.owners;
  const threshold = safeInfo?.threshold;

  return (
    <SafeInfoContainer
      component={Paper}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      {/* Safe Address */}
      <Stack direction="row" alignItems="center" spacing={1} component="span">
        <img src={safeLogo} alt="connected Wallet logo" height={42} />

        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          component="span"
        >
          <Typography variant="body2">
            <AddressLabel address={safeAddress} showBlockExplorerLink />
          </Typography>

          <Typography variant="body2" mb="8px">
            <SafeSettingsLabel>
              {threshold}/{owners?.length}
            </SafeSettingsLabel>
          </Typography>
        </Stack>
      </Stack>

      {/* Safe Balance */}
      <AmountContainer>
        <Typography variant="body2">
          <AmountLabel
            amount={utils.formatEther(amount || "0")}
            tokenSymbol={chain?.token || ""}
          />
        </Typography>
      </AmountContainer>
    </SafeInfoContainer>
  );
}

export default SafeInfo;

const SafeInfoContainer = styled(Box)`
  max-width: 800px;
  margin: 0 auto;
  margin-top: 24px;
  padding: 16px;
`;

const SafeSettingsLabel = styled("span")<{
  theme?: Theme;
}>`
  border-radius: 4px;
  background-color: ${(props) =>
    props.theme.palette.mode === DARK_THEME ? "darkorange" : "orange"};
  padding: 2px 3px;
  letter-spacing: 2px;
  font-size: 12px;
  border: 1px solid
    ${(props) => (props.theme.palette.mode === DARK_THEME ? "#fff" : "#000000")};
`;

const AmountContainer = styled("div")<{
  theme?: Theme;
}>(
  ({ theme, onClick }) => `
  
  margin-right: 8px;
  border-radius: 4px;
  padding: 4px 12px;

  cursor: ${!!onClick ? "pointer" : "initial"};

  background-color: ${
    theme.palette.mode === LIGHT_THEME
      ? theme.palette.background.paper
      : theme.palette.grey["800"]
  };

  color: ${theme.palette.getContrastText(theme.palette.background.paper)};
  
  `
);
