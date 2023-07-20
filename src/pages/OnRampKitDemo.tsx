import styled from '@emotion/styled'
import WalletIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import LoginIcon from '@mui/icons-material/Login'
import CloseIcon from '@mui/icons-material/CloseRounded'
import { Tab, Tabs, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { CodeBlock, atomOneDark } from 'react-code-blocks'
import LogoutIcon from '@mui/icons-material/LogoutRounded'

import { useState } from 'react'
import SafeInfo from 'src/components/safe-info/SafeInfo'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'
import { MONERIUM_SNIPPET, STRIPE_SNIPPET } from 'src/utils/snippets'
import Code from 'src/components/code/Code'

const OnRampKitDemo = () => {
  const {
    openStripeWidget,
    closeStripeWidget,
    safeSelected,
    chain,
    chainId,
    isAuthenticated,
    loginWeb3Auth,
    startMoneriumFlow,
    closeMoneriumFlow,
    moneriumAuthContext
  } = useAccountAbstraction()

  const [tabsValue, setTabsValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue)
  }

  const [showStripeWidget, setShowStripeWidget] = useState<boolean>(false)

  return (
    <>
      <Typography variant="h2" component="h1">
        The Onramp Kit
      </Typography>

      <Typography marginTop="16px">
        Allow users to buy cryptocurrencies using a credit card and other payment options directly
        within your app. Click on "Buy USDC" to on-ramp funds to your Safe using the Stripe widget!
      </Typography>

      <Typography marginTop="24px" marginBottom="8px">
        Find more info at:
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Link
          href="https://github.com/safe-global/safe-core-sdk/tree/main/packages/onramp-kit"
          target="_blank"
        >
          Github
        </Link>

        <Link
          href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk/onramp-kit"
          target="_blank"
        >
          Documentation
        </Link>
      </Stack>

      <Divider style={{ margin: '32px 0 28px 0' }} />

      {/* OnRamp Demo */}
      <Typography variant="h4" component="h2" fontWeight="700" marginBottom="16px">
        Interactive demo
      </Typography>

      {!isAuthenticated ? (
        <ConnectedContainer
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap={3}
        >
          <Typography variant="h4" component="h3" fontWeight="700">
            To use the Onramp Kit you need to be authenticated
          </Typography>

          <Button variant="contained" onClick={loginWeb3Auth}>
            Connect
          </Button>
        </ConnectedContainer>
      ) : (
        <Box display="flex" gap={3} alignItems="flex-start">
          {/* safe Account */}
          <ConnectedContainer>
            <Typography fontWeight="700">Safe Account</Typography>

            <Typography fontSize="14px" marginTop="8px" marginBottom="32px">
              Your Safe account (Smart Contract) holds and protects your assets.
            </Typography>

            {/* Safe Info */}
            {safeSelected && <SafeInfo safeAddress={safeSelected} chainId={chainId} />}
          </ConnectedContainer>

          {/* Stripe widget */}
          <ConnectedContainer>
            <Tabs value={tabsValue} onChange={handleTabChange} aria-label="basic tabs example">
              <Tab label="Stripe" />
              <Tab label="Monerium" />
            </Tabs>

            {tabsValue === 0 && (
              <>
                <Typography fontSize="14px" marginTop="8px" marginBottom="32px">
                  This widget is on testmode, you will need to use{' '}
                  <Link
                    href="https://docs.safe.global/learn/safe-core-account-abstraction-sdk/onramp-kit#considerations-and-limitations"
                    target="_blank"
                  >
                    fake data
                  </Link>{' '}
                  in order to simulate the process. Available only in the United States.
                </Typography>

                {!showStripeWidget ? (
                  <Tooltip title={'buy USDC to your Safe address using Stripe payment provider'}>
                    {/* Buy USDC with our OnRamp kit */}
                    <Button
                      startIcon={<WalletIcon />}
                      variant="contained"
                      onClick={async () => {
                        setShowStripeWidget(true)
                        await openStripeWidget()
                      }}
                      disabled={!chain?.isStripePaymentsEnabled}
                    >
                      Buy USDC
                      {!chain?.isStripePaymentsEnabled ? ' (only in Mumbai chain)' : ''}
                    </Button>
                  </Tooltip>
                ) : (
                  <Stack display="flex" flexDirection="column" alignItems="center" gap={1}>
                    <Tooltip title={'close Stripe Widget'}>
                      <IconButton
                        size="small"
                        color="primary"
                        sx={{ alignSelf: 'flex-end' }}
                        onClick={async () => {
                          setShowStripeWidget(false)
                          await closeStripeWidget()
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    {/* Stripe root widget */}
                    <div id="stripe-root"></div>
                  </Stack>
                )}
              </>
            )}

            {tabsValue === 1 && (
              <>
                {moneriumAuthContext ? (
                  <>
                    <Typography fontSize="14px" marginTop="8px" marginBottom="32px">
                      {moneriumAuthContext.name}, you are logged in using Monerium
                    </Typography>
                    <Tooltip title={'Logout'}>
                      <Button
                        startIcon={<LogoutIcon />}
                        variant="contained"
                        onClick={() => closeMoneriumFlow()}
                      >
                        Logout
                      </Button>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Typography fontSize="14px" marginTop="8px" marginBottom="32px">
                      You can login with Monerium and link the selected Safe with your account
                    </Typography>
                    <Tooltip title={'Login with Monerium'}>
                      <Button
                        startIcon={<LoginIcon />}
                        variant="contained"
                        onClick={() => startMoneriumFlow()}
                        disabled={!chain?.isMoneriumPaymentsEnabled}
                      >
                        Login with Monerium
                        {!chain?.isMoneriumPaymentsEnabled ? ' (only in Goerli chain)' : ''}
                      </Button>
                    </Tooltip>
                  </>
                )}
              </>
            )}
          </ConnectedContainer>
        </Box>
      )}

      <Divider style={{ margin: '40px 0 30px 0' }} />

      <Typography variant="h3" component="h2" fontWeight="700" marginBottom="16px">
        How to use it
      </Typography>

      <Code text={tabsValue === 0 ? STRIPE_SNIPPET : MONERIUM_SNIPPET} language={'javascript'} />
    </>
  )
}

export default OnRampKitDemo

const ConnectedContainer = styled(Box)<{
  theme?: Theme
}>(
  ({ theme }) => `
  
  border-radius: 10px;
  border: 1px solid ${theme.palette.border.light};
  padding: 40px 32px;

  min-height: 265px;
`
)
