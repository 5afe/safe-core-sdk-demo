import axios, { RawAxiosRequestConfig } from "axios";
import { utils } from "ethers";

import chains from "src/chains/chains";

type BalanceType = {
  tokenAddress: null | string;
  token: {
    name: string;
    symbol: string;
    decimals: number;
    logoUri: string;
  };
  balance: string;
  ethValue: string;
  timestamp: string;
  fiatBalance: string;
  fiatConversion: string;
  fiatCode: string;
};

export type safeBalancesType = BalanceType[];

const getSafeBalances = async (
  safeAddress: string,
  connectedChainId: string,
  options?: RawAxiosRequestConfig
): Promise<safeBalancesType> => {
    // TODO: create get chain fn
  const chain = chains.find(({ id }) => id === connectedChainId);

  const address = utils.getAddress(safeAddress);

  const url = `${chain?.transactionServiceUrl}/api/v1/safes/${address}/balances/usd/`;

  const { data: safeInfo } = await axios.get(url, options);

  return safeInfo;
};

export default getSafeBalances;
