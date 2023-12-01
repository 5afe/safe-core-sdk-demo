export const WEB3AUTH_SNIPPET = (chainId: string) => `import { SafeAuthPack, SafeAuthInitOptions } from '@safe-global/auth-kit'

const safeAuthPack = new SafeAuthPack()

const options: SafeAuthInitOptions = {
  enableLogging: true,
  showWidgetButton: false,
  chainConfig: {
    chainId: ${chainId},
    rpcTarget: 'https://your-rpc-url'
  }
}

await safeAuthPack.init(options)

// Log in and get the derived EOA
await safeAuthPack.signIn()

// Logout
await safeAuthPack.signOut()

// Get the provider
safeAuthPack.getProvider()
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

export const GELATO_SNIPPET = `import { ethers } from 'ethers'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import { MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types'

const RPC_URL = 'https://...'
const signerPrivateKey = process.env.OWNER_1_PRIVATE_KEY!
const safeAddress = '0x...' // Safe from which the transaction will be sent

const provider = new ethers.JsonRpcProvider(RPC_URL)
const signer = new ethers.Wallet(signerPrivateKey, provider)
const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer })

// Initialize the kits
const protocolKit = await Safe.create({ ethAdapter, safeAddress })
const relayKit = new GelatoRelayPack({ protocolKit, apiKey }) // apiKey is mandatory only for 1Balance

// Prepare the transaction
const transactions: MetaTransactionData[] = [{
  to: '0x...', // the destination address
  data: '0x',
  value: withdrawAmount,
  operation: OperationType.Call
}]

const safeTransaction = await relayKit.createRelayedTransaction({ transactions })
const signedSafeTransaction = await protocolKit.signTransaction(safeTransaction)

// Send the signed transaction to the relay
relayKit.executeRelayTransaction(signedSafeTransaction)`
