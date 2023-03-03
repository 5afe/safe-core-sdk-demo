import axios, { RawAxiosRequestConfig } from "axios";
import { utils } from "ethers";

import getChain from "src/utils/getChain";

export type SafeInfoType = {
  address: string;
  nonce: number;
  threshold: number;
  owners: string[];
};

const getSafeInfo = async (
  safeAddress: string,
  connectedChainId: string,
  options?: RawAxiosRequestConfig
): Promise<SafeInfoType> => {
  const chain = getChain(connectedChainId);

  const address = utils.getAddress(safeAddress);

  const url = `${chain?.transactionServiceUrl}/api/v1/safes/${address}/`;

  const { data: safeInfo } = await axios.get(url, options);

  return safeInfo;
};

export default getSafeInfo;
