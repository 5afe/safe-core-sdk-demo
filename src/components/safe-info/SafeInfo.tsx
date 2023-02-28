import { useCallback, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { Theme } from "@mui/material";
import styled from "@emotion/styled";
import { providers, utils } from "ethers";

import AddressLabel from "src/components/address-label/AddressLabel";
import AmountLabel from "src/components/amount-label/AmountLabel";
import getSafeInfo from "src/api/getSafeInfo";
import getSafeBalances from "src/api/getSafeBalances";
import chains from "src/chains/chains";
import useApi from "src/hooks/useApi";
import safeLogo from "src/assets/safe-logo.svg";
import { DARK_THEME, LIGHT_THEME } from "src/theme/theme";
import getChain from "src/utils/getChain";
import { useWallet } from "src/store/walletContext";

type SafeInfoProps = {
  safeAddress: string;
  chainId: string;
};

function SafeInfo({ safeAddress, chainId }: SafeInfoProps) {
  const { web3Provider, chain, safes } = useWallet();

  const [balance, setBalance] = useState<string>();

  useEffect(() => {
    web3Provider?.getBalance(safeAddress).then((balance) => {
      setBalance(balance.toString());
    });
  }, [web3Provider, safeAddress]);

  const fetchInfo = useCallback(
    (signal: AbortSignal) => getSafeInfo(safeAddress, chainId, { signal }),
    [safeAddress, chainId]
  );

  // const fetchBalances = useCallback(
  //   (signal: AbortSignal) => getSafeBalances(safeAddress, chainId, { signal }),
  //   [safeAddress, chainId]
  // );

  const { isLoading: isLoadingInfo, data: safeInfo } = useApi(fetchInfo);
  // const { isLoading: isLoadingBalance, data: balances } = useApi(fetchBalances);

  // const isLoading = isLoadingInfo || isLoadingBalance;

  // TODO: create get native token amount
  // const amount =
  //   balances?.find((balance) => balance.tokenAddress === null)?.balance ||
  //   walletBalance;

  const owners = safeInfo?.owners;
  const threshold = safeInfo?.threshold;

  // TODO: implement get code?

  const isDeployed =
    safes.length > 0 ||
    (web3Provider && isContractAddress(safeAddress, web3Provider));

  return (
    <SafeInfoContainer
      component={Paper}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
    >
      {/* Safe address */}
      <Stack direction="row" alignItems="center" spacing={1} component="span">
        {/* Safe Logo */}
        <img src={safeLogo} alt="connected Wallet logo" height={42} />

        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          component="span"
        >
          {/* Safe address label */}
          <Typography variant="body2">
            <AddressLabel address={safeAddress} showBlockExplorerLink />
          </Typography>

          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            component="span"
            gap={1}
          >
            {/* Threshold & owners label */}
            {isDeployed && (
              <Typography variant="body2" mb="8px">
                <SafeSettingsLabel>
                  {threshold || 1}/{owners?.length || 1}
                </SafeSettingsLabel>
              </Typography>
            )}

            {/* Safe not deployed label */}
            {!isDeployed && (
              <Tooltip title="This Safe is not deployed yet, it will be deployed when you execute the first transaction">
                <Typography variant="body2" mb="8px">
                  <SafeStatusLabel>Creation pending</SafeStatusLabel>
                </Typography>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* Safe Balance */}
      <AmountContainer>
        <Typography variant="body2">
          <AmountLabel
            amount={utils.formatEther(balance || "0")}
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

const SafeStatusLabel = styled("span")<{
  theme?: Theme;
}>`
  border-radius: 4px;
  background-color: ${(props) =>
    props.theme.palette.mode === DARK_THEME ? "darkorange" : "orange"};
  padding: 2px 3px;
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
      ? theme.palette.grey["200"]
      : theme.palette.grey["800"]
  };

  color: ${theme.palette.getContrastText(theme.palette.background.paper)};
  
  `
);

const isContractAddress = async (
  address: string,
  provider: providers.Web3Provider
): Promise<boolean> => {
  try {
    const code = await provider.getCode(address);

    return code !== "0x";
  } catch (error) {
    return false;
  }
};
