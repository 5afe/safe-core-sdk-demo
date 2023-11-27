type Chain = {
  id: string
  token: string
  rpcUrl: string
  shortName: string
  label: string
  color?: string
  icon?: string
  blockExplorerUrl: string
  transactionServiceUrl?: string
  isStripePaymentsEnabled: boolean // only available in Mumbai chain
  isMoneriumPaymentsEnabled: boolean // only available in Goerli chain
  faucetUrl?: string
  supportedErc20Tokens?: string[] // erc20 token contract addresses that can be used to pay transaction fees
}

export default Chain
