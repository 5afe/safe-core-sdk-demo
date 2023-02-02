import axios, { RawAxiosRequestConfig } from "axios";
import { utils } from "ethers";

import chains from "src/chains/chains";

export type SafesOwnedType = {
  safes: string[];
};

const getSafesByOwner = async (
  owner: string,
  connectedChainId: string,
  options?: RawAxiosRequestConfig
): Promise<SafesOwnedType> => {
    // TODO: create get chain fn
  const chain = chains.find(({ id }) => id === connectedChainId);

  const address = utils.getAddress(owner);

  const url = `${chain?.transactionServiceUrl}/api/v1/owners/${address}/safes/`;

  const { data: safes } = await axios.get(url, options);

  return safes;
};

export default getSafesByOwner;
