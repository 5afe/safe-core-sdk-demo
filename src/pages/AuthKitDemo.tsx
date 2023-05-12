import styled from '@emotion/styled'
import { Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { CodeBlock, atomOneDark } from 'react-code-blocks'

import ConnectedWalletLabel from 'src/components/connected-wallet-label/ConnectedWalletLabel'
import SafeInfo from 'src/components/safe-info/SafeInfo'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'

const AuthKitDemo = () => {
  const { loginWeb3Auth, isAuthenticated, safeSelected, chainId } = useAccountAbstraction()

  return (
    <>
      <Typography variant="h2" component="h1">
        The Auth Kit
      </Typography>

      <Typography marginTop="16px">
        Generate or authenticate a blockchain account using an email address, social media account,
        or traditional crypto wallets like Metamask.
      </Typography>

      <Typography marginTop="24px" marginBottom="8px">
        Find more info at:
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Link
          href="https://github.com/safe-global/account-abstraction-sdk/tree/main/packages/auth-kit"
          target="_blank"
        >
          Github
        </Link>

        <Link
          href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk/auth-kit"
          target="_blank"
        >
          Documentation
        </Link>
      </Stack>

      <Divider style={{ margin: '32px 0 28px 0' }} />

      {/* Auth Demo */}
      <Typography variant="h4" component="h2" fontWeight="700" marginBottom="16px">
        Interactive demo
      </Typography>

      {isAuthenticated ? (
        <Box display="flex" gap={3}>
          {/* safe Account */}
          <ConnectedContainer>
            <Typography fontWeight="700">Safe Account</Typography>

            <Typography fontSize="14px" marginTop="8px" marginBottom="32px">
              Your Safe account (Smart Contract) holds and protects your assets.
            </Typography>

            {/* Safe Info */}
            {safeSelected && <SafeInfo safeAddress={safeSelected} chainId={chainId} />}
          </ConnectedContainer>

          {/* owner ID */}
          <ConnectedContainer>
            <Typography fontWeight="700">Owner ID</Typography>

            <Typography fontSize="14px" marginTop="8px" marginBottom="32px">
              Your Owner account signs transactions to unlock your assets.
            </Typography>

            {/* Owner details */}
            <ConnectedWalletLabel />
          </ConnectedContainer>
        </Box>
      ) : (
        <ConnectContainer display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Typography variant="h4" component="h3" fontWeight="700">
            Create a safe using the Auth Kit
          </Typography>

          <Button variant="contained" onClick={loginWeb3Auth}>
            Connect
          </Button>
        </ConnectContainer>
      )}

      <Divider style={{ margin: '40px 0 30px 0' }} />

      <Typography variant="h3" component="h2" fontWeight="700" marginBottom="16px">
        How to use it
      </Typography>

      {/* TODO: create a component for this? */}
      <CodeContainer>
        <CodeBlock
          text={code}
          language={'javascript'}
          showLineNumbers
          startingLineNumber={96}
          theme={atomOneDark}
        />
      </CodeContainer>
    </>
  )
}

export default AuthKitDemo

const code = `import { SafeAuthKit, Web3AuthModalPack } from '@safe-global/auth-kit'

const options: Web3AuthOptions = {
  clientId: <REACT_APP_WEB3AUTH_CLIENT_ID>,
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

const web3AuthModalPack = new Web3AuthModalPack(options, [openloginAdapter], modalConfig)

const safeAuthKit = await SafeAuthKit.init(web3AuthModalPack)

// Allow to login and get the derived eoa
safeAuthKit.signIn()

// Logout
safeAuthKit.signOut()

// Get the provider
safeAuthKit.getProvider()

`

const ConnectContainer = styled(Box)<{
  theme?: Theme
}>(
  ({ theme }) => `
  
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 50px;
`
)

const CodeContainer = styled(Box)<{
  theme?: Theme
}>(
  ({ theme }) => `
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 16px;
`
)

const ConnectedContainer = styled(Box)<{
  theme?: Theme
}>(
  ({ theme }) => `
  
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 40px 32px;
`
)
