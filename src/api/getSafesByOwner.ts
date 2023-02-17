import axios, { RawAxiosRequestConfig } from "axios";
import { utils } from "ethers";


import getChain from "src/utils/getChain";

export type SafesOwnedType = {
  safes: string[];
};

const getSafesByOwner = async (
  owner: string,
  connectedChainId: string,
  options?: RawAxiosRequestConfig
): Promise<SafesOwnedType> => {
  const chain = getChain(connectedChainId)

  const address = utils.getAddress(owner);

  const url = `${chain?.transactionServiceUrl}/api/v1/owners/${address}/safes/`;

  const { data: safes } = await axios.get(url, options);

  return safes;
};

export default getSafesByOwner;
