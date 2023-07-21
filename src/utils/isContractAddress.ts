import { providers } from 'ethers'

const isContractAddress = async (
  address: string,
  provider?: providers.Web3Provider
): Promise<boolean> => {
  try {
    const code = await provider?.getCode(address)

    return code !== '0x'
  } catch (error) {
    return false
  }
}

export default isContractAddress
