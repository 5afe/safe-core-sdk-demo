import { ethers } from 'ethers'
import erc20ABI from 'src/constants/erc20ABI.json'
import { ERC20Token } from 'src/models/erc20token'

/**
 * Retrieve infos for an ERC20 token by its contract address.
 * @param erc20Address ERC20 token contract address
 * @param provider web3 provider
 * @param accountAddress address to get the ERC20 token balance for
 * @returns the infos for the given token or undefined if no valid ERC20 address was provided
 */
export const getERC20Info = async (
  erc20Address: string,
  provider: ethers.BrowserProvider,
  accountAddress?: string
): Promise<ERC20Token | undefined> => {
  if (erc20Address === ethers.ZeroAddress) {
    return undefined
  }

  const contract = new ethers.Contract(erc20Address, erc20ABI, provider)

  const [balance, decimals, symbol] = await Promise.all([
    accountAddress != null ? contract.balanceOf(accountAddress) : Promise.resolve(),
    contract.decimals(),
    contract.symbol()
  ])

  return { address: erc20Address, balance, decimals, symbol }
}
