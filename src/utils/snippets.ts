export const WEB3AUTH_SNIPPET = `import { Web3AuthModalPack } from '@safe-global/auth-kit'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'

const options: Web3AuthOptions = {
  clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: 'testnet',
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: chainId,
    rpcTarget: rpcTarget
  },
  uiConfig: {
    theme: 'dark',
    loginMethodsOrder: ['google', 'facebook']
  }
}

const modalConfig = {
  [WALLET_ADAPTERS.TORUS_EVM]: {
    label: 'torus',
    showOnModal: false
  },
  [WALLET_ADAPTERS.METAMASK]: {
    label: 'metamask',
    showOnDesktop: true,
    showOnMobile: false
  }
}

const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: 'mandatory'
  },
  adapterSettings: {
    uxMode: 'popup',
    whiteLabel: {
      name: 'Safe'
    }
  }
})

const web3AuthModalPack = new Web3AuthModalPack({
  txServiceUrl: 'https://safe-transaction-{chain}.safe.global',
})

await web3AuthModalPack.init({
  options,
  adapters: [openloginAdapter],
  modalConfig
})

// Allow to login and get the derived EOA
await web3AuthModalPack.signIn()

// Logout
await web3AuthModalPack.signOut()

// Get the provider
web3AuthModalPack.getProvider()
`

export const STRIPE_SNIPPET = `import { StripePack } from '@safe-global/onramp-kit'

const stripePack = new StripePack({
  stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
  onRampBackendUrl: process.env.REACT_APP_STRIPE_BACKEND_BASE_URL
})

await stripePack.init()

const sessionData = await stripePack.open({
  element: '#stripe-root',
  theme: 'light',
  defaultOptions: {
    transaction_details: {
      wallet_address: walletAddress,
      supported_destination_networks: ['ethereum', 'polygon'],
      supported_destination_currencies: ['usdc'],
      lock_wallet_address: true
    },
    customer_information: {
      email: 'john@doe.com'
    }
  }
}))

stripePack.subscribe('onramp_ui_loaded', () => {
  console.log('UI loaded')
})

stripePack.subscribe('onramp_session_updated', (e) => {
  console.log('Session Updated', e.payload)
})
`

export const MONERIUM_SNIPPET = `import { MoneriumPack } from '@safe-global/onramp-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import { OrderState } from '@monerium/sdk'

const safeOwner = web3Provider.getSigner()
const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: safeOwner })

const safeSdk = await Safe.create({
  ethAdapter: ethAdapter,
  safeAddress: safeSelected,
  isL1SafeMasterCopy: true
})

const moneriumPack = new MoneriumPack({
  clientId: process.env.REACT_APP_MONERIUM_CLIENT_ID || '',
  environment: 'sandbox'
})

await moneriumPack.init({
  safeSdk
})

const moneriumClient = await moneriumPack.open({
  redirectUrl: 'http://localhost:3000',
  authCode,
  refreshToken
})

const authContext = await moneriumClient.getAuthContext()
const profile = await moneriumClient.getProfile(authContext.defaultProfile)
const balances = await moneriumClient.getBalances()
const orders = await moneriumClient.getOrders()

if (moneriumClient.bearerProfile) {
  localStorage.setItem(MONERIUM_TOKEN, moneriumClient.bearerProfile.refresh_token)
}

moneriumPack.subscribe(OrderState.pending, (notification) => {
  console.log(notification.meta.state)
})

moneriumPack.subscribe(OrderState.placed, (notification) => {
  console.log(notification.meta.state)
})

moneriumPack.close()
`

export const GELATO_SNIPPET = `import { GelatoRelayPack } from '@safe-global/relay-kit'

const relayPack = new GelatoRelayPack()

relayPack.relayTransaction({
  target: '0x...', // the Safe address
  encodedTransaction: '0x...', // Encoded Safe transaction data
  chainId: 5
})`
