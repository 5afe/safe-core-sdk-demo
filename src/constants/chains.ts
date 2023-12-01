import Chain from 'src/models/chain'

export const gnosisChain: Chain = {
  id: '0x64',
  token: 'xDai',
  shortName: 'gno',
  label: 'Gnosis Chain',
  rpcUrl: 'https://rpc.gnosischain.com',
  blockExplorerUrl: 'https://gnosisscan.io',
  color: '#3e6957',
  transactionServiceUrl: 'https://safe-transaction-gnosis-chain.safe.global',
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  supportedErc20Tokens: [
    '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83' // USDC
  ]
}

export const goerliChain: Chain = {
  id: '0x5',
  token: 'gETH',
  label: 'Görli',
  shortName: 'gor',
  rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  blockExplorerUrl: 'https://goerli.etherscan.io',
  color: '#fbc02d',
  transactionServiceUrl: 'https://safe-transaction-goerli.safe.global',
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: true,
  supportedErc20Tokens: [
    '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6' // WETH
  ]
}

export const mainnetChain: Chain = {
  id: '0x1',
  token: 'ETH',
  label: 'Ethereum',
  shortName: 'eth',
  rpcUrl: 'https://cloudflare-eth.com',
  blockExplorerUrl: 'https://etherscan.io',
  color: '#DDDDDD',
  transactionServiceUrl: 'https://safe-transaction-mainnet.safe.global',
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  supportedErc20Tokens: [
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' // USDC
  ]
}

export const polygonChain: Chain = {
  id: '0x89',
  token: 'matic',
  shortName: 'matic',
  label: 'Polygon',
  rpcUrl: 'https://polygon-rpc.com',
  blockExplorerUrl: 'https://polygonscan.com',
  color: '#8248E5',
  transactionServiceUrl: 'https://safe-transaction-polygon.safe.global',
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  supportedErc20Tokens: [
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' // USDC
  ]
}

export const mumbaiChain: Chain = {
  id: '0x13881',
  token: 'matic',
  shortName: 'matic',
  label: 'Mumbai',
  rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
  blockExplorerUrl: 'https://mumbai.polygonscan.com',
  color: '#8248E5',
  isStripePaymentsEnabled: true,
  isMoneriumPaymentsEnabled: false,
  faucetUrl: 'https://mumbaifaucet.com/',
  supportedErc20Tokens: [
    '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889' // WMATIC
  ]
}

export const sepoliaChain: Chain = {
  id: '0xaa36a7',
  token: 'SepoliaETH',
  shortName: 'eth',
  label: 'Sepolia',
  rpcUrl: 'https://ethereum-sepolia.publicnode.com/',
  blockExplorerUrl: 'https://sepolia.polygonscan.com',
  color: '#AA36A7',
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: false,
  faucetUrl: 'https://sepoliafaucet.com/',
  supportedErc20Tokens: ['0x8267cF9254734C6Eb452a7bb9AAF97B392258b21']
}

const chains: Chain[] = [
  gnosisChain,
  goerliChain,
  mainnetChain,
  mumbaiChain,
  polygonChain,
  sepoliaChain
]

export const initialChain = mumbaiChain

export default chains
