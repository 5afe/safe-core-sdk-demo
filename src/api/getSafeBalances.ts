import axios, { RawAxiosRequestConfig } from "axios";
import { utils } from "ethers";

import getChain from "src/utils/getChain";

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

// TODO: remove this fn?
const getSafeBalances = async (
  safeAddress: string,
  connectedChainId: string,
  options?: RawAxiosRequestConfig
): Promise<safeBalancesType> => {
  const chain = getChain(connectedChainId);

  const address = utils.getAddress(safeAddress);

  const url = `${chain?.transactionServiceUrl}/api/v1/safes/${address}/balances/usd/`;

  const { data: safeInfo } = await axios.get(url, options);

  return safeInfo;
};

export default getSafeBalances;
