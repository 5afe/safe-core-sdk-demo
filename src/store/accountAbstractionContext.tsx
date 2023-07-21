import AccountAbstraction from '@safe-global/account-abstraction-kit-poc'
import { Web3AuthModalPack } from '@safe-global/auth-kit'
import { StripePack } from '@safe-global/onramp-kit'
import { GelatoRelayPack } from '@safe-global/relay-kit'
import { MetaTransactionData, MetaTransactionOptions } from '@safe-global/safe-core-sdk-types'
import { ethers, utils } from 'ethers'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import { Web3AuthOptions } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { initialChain } from 'src/chains/chains'
import usePolling from 'src/hooks/usePolling'
import Chain from 'src/models/chain'
import getChain from 'src/utils/getChain'

type accountAbstractionContextValue = {
  ownerAddress?: string
  chainId: string
  safes: string[]
  chain?: Chain
  isAuthenticated: boolean
  web3Provider?: ethers.providers.Web3Provider
  loginWeb3Auth: () => void
  logoutWeb3Auth: () => void
  setChainId: (chainId: string) => void
  safeSelected?: string
  safeBalance?: string
  setSafeSelected: React.Dispatch<React.SetStateAction<string>>
  isRelayerLoading: boolean
  relayTransaction: () => Promise<void>
  gelatoTaskId?: string
  openStripeWidget: () => Promise<void>
  closeStripeWidget: () => Promise<void>
}

const initialState = {
  isAuthenticated: false,
  loginWeb3Auth: () => {},
  logoutWeb3Auth: () => {},
  relayTransaction: async () => {},
  setChainId: () => {},
  setSafeSelected: () => {},
  onRampWithStripe: async () => {},
  safes: [],
  chainId: initialChain.id,
  isRelayerLoading: true,
  openStripeWidget: async () => {},
  closeStripeWidget: async () => {}
}

const accountAbstractionContext = createContext<accountAbstractionContextValue>(initialState)

const useAccountAbstraction = () => {
  const context = useContext(accountAbstractionContext)

  if (!context) {
    throw new Error('useAccountAbstraction should be used within a AccountAbstraction Provider')
  }

  return context
}

const AccountAbstractionProvider = ({ children }: { children: JSX.Element }) => {
  // owner address from the email  (provided by web3Auth)
  const [ownerAddress, setOwnerAddress] = useState<string>('')

  // safes owned by the user
  const [safes, setSafes] = useState<string[]>([])

  // chain selected
  const [chainId, setChainId] = useState<string>(initialChain.id)

  // web3 provider to perform signatures
  const [web3Provider, setWeb3Provider] = useState<ethers.providers.Web3Provider>()

  const isAuthenticated = !!ownerAddress && !!chainId
  const chain = getChain(chainId) || initialChain

  // reset React state when you switch the chain
  useEffect(() => {
    setOwnerAddress('')
    setSafes([])
    setChainId(chain.id)
    setWeb3Provider(undefined)
    setSafeSelected('')
  }, [chain])

  // authClient
  const [web3AuthModalPack, setWeb3AuthModalPack] = useState<Web3AuthModalPack>()

  // onRampClient
  const [stripePack, setStripePack] = useState<StripePack>()

  // auth-kit implementation
  const loginWeb3Auth = useCallback(async () => {
    try {
      const options: Web3AuthOptions = {
        clientId: process.env.REACT_APP_WEB3AUTH_CLIENT_ID || '',
        web3AuthNetwork: 'testnet',
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: chain.id,
          rpcTarget: chain.rpcUrl
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
        txServiceUrl: chain.transactionServiceUrl
      })

      await web3AuthModalPack.init({
        options,
        adapters: [openloginAdapter],
        modalConfig
      })

      if (web3AuthModalPack) {
        const { safes, eoa } = await web3AuthModalPack.signIn()
        const provider = web3AuthModalPack.getProvider() as ethers.providers.ExternalProvider

        // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
        setChainId(chain.id)
        setOwnerAddress(eoa)
        setSafes(safes || [])
        setWeb3Provider(new ethers.providers.Web3Provider(provider))
        setWeb3AuthModalPack(web3AuthModalPack)
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }, [chain])

  const logoutWeb3Auth = () => {
    web3AuthModalPack?.signOut()
    setOwnerAddress('')
    setSafes([])
    setChainId(chain.id)
    setWeb3Provider(undefined)
    setSafeSelected('')
    setGelatoTaskId(undefined)
  }

  // TODO: add disconnect owner wallet logic ?

  // current safe selected by the user
  const [safeSelected, setSafeSelected] = useState<string>('')

  // conterfactual safe Address if its not deployed yet
  useEffect(() => {
    const getSafeAddress = async () => {
      if (web3Provider) {
        const signer = web3Provider.getSigner()
        const relayPack = new GelatoRelayPack()
        const safeAccountAbstraction = new AccountAbstraction(signer)

        await safeAccountAbstraction.init({ relayPack })

        const hasSafes = safes.length > 0

        const safeSelected = hasSafes ? safes[0] : await safeAccountAbstraction.getSafeAddress()

        setSafeSelected(safeSelected)
      }
    }

    getSafeAddress()
  }, [safes, web3Provider])

  const [isRelayerLoading, setIsRelayerLoading] = useState<boolean>(false)
  const [gelatoTaskId, setGelatoTaskId] = useState<string>()

  // refresh the Gelato task id
  useEffect(() => {
    setIsRelayerLoading(false)
    setGelatoTaskId(undefined)
  }, [chainId])

  // relay-kit implementation using Gelato
  const relayTransaction = async () => {
    if (web3Provider) {
      setIsRelayerLoading(true)

      const signer = web3Provider.getSigner()
      const relayPack = new GelatoRelayPack()
      const safeAccountAbstraction = new AccountAbstraction(signer)

      await safeAccountAbstraction.init({ relayPack })

      // we use a dump safe transfer as a demo transaction
      const dumpSafeTransafer: MetaTransactionData[] = [
        {
          to: safeSelected,
          data: '0x',
          value: utils.parseUnits('0.01', 'ether').toString(),
          operation: 0 // OperationType.Call,
        }
      ]

      const options: MetaTransactionOptions = {
        isSponsored: false,
        gasLimit: '600000', // in this alfa version we need to manually set the gas limit
        gasToken: ethers.constants.AddressZero // native token
      }

      const gelatoTaskId = await safeAccountAbstraction.relayTransaction(dumpSafeTransafer, options)

      setIsRelayerLoading(false)
      setGelatoTaskId(gelatoTaskId)
    }
  }

  // onramp-kit implementation
  const openStripeWidget = async () => {
    const stripePack = new StripePack({
      stripePublicKey: process.env.REACT_APP_STRIPE_PUBLIC_KEY || '',
      onRampBackendUrl: process.env.REACT_APP_STRIPE_BACKEND_BASE_URL || ''
    })

    await stripePack.init()

    const sessionData = await stripePack.open({
      // sessionId: sessionId, optional parameter
      element: '#stripe-root',
      defaultOptions: {
        transaction_details: {
          wallet_address: safeSelected,
          supported_destination_networks: ['ethereum', 'polygon'],
          supported_destination_currencies: ['usdc'],
          lock_wallet_address: true
        },
        customer_information: {
          email: 'john@doe.com'
        }
      }
    })

    setStripePack(stripePack)

    console.log('Stripe sessionData: ', sessionData)
  }

  const closeStripeWidget = async () => {
    stripePack?.close()
  }

  // we can pay Gelato tx relayer fees with native token & USDC
  // TODO: ADD native Safe Balance polling
  // TODO: ADD USDC Safe Balance polling

  // fetch safe address balance with polling
  const fetchSafeBalance = useCallback(async () => {
    const balance = await web3Provider?.getBalance(safeSelected)

    return balance?.toString()
  }, [web3Provider, safeSelected])

  const safeBalance = usePolling(fetchSafeBalance)

  const state = {
    ownerAddress,
    chainId,
    chain,
    safes,

    isAuthenticated,

    web3Provider,

    loginWeb3Auth,
    logoutWeb3Auth,

    setChainId,

    safeSelected,
    safeBalance,
    setSafeSelected,

    isRelayerLoading,
    relayTransaction,
    gelatoTaskId,

    openStripeWidget,
    closeStripeWidget
  }

  return (
    <accountAbstractionContext.Provider value={state}>
      {children}
    </accountAbstractionContext.Provider>
  )
}

export { useAccountAbstraction, AccountAbstractionProvider }
