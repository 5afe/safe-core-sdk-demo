import { useEffect, useState } from 'react'
import WalletIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import LoginIcon from '@mui/icons-material/Login'
import CloseIcon from '@mui/icons-material/CloseRounded'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import LogoutIcon from '@mui/icons-material/LogoutRounded'

import { useAccountAbstraction } from 'src/store/accountAbstractionContext'
import { MONERIUM_SNIPPET, STRIPE_SNIPPET } from 'src/utils/snippets'
import isContractAddress from 'src/utils/isContractAddress'

import SafeInfo from 'src/components/safe-info/SafeInfo'
import Code from 'src/components/code/Code'
import AuthenticateMessage from 'src/components/authenticate-message/AuthenticateMessage'
import { ConnectedContainer } from 'src/components/styles'

type OnRampKitDemoProps = {
  setStep: (newStep: number) => void
}

const OnRampKitDemo = ({ setStep }: OnRampKitDemoProps) => {
  const {
    web3Provider,
    openStripeWidget,
    closeStripeWidget,
    safeSelected,
    chain,
    chainId,
    isAuthenticated,
    loginWeb3Auth,
    startMoneriumFlow,
    closeMoneriumFlow,
    moneriumInfo
  } = useAccountAbstraction()
  const [isSafeDeployed, setIsSafeDeployed] = useState<boolean>(false)

  const [tabsValue, setTabsValue] = useState(0)

  useEffect(() => {
    ;(async () => {
      if (!safeSelected) return

      const isDeployed = await isContractAddress(safeSelected, web3Provider)

      setIsSafeDeployed(isDeployed)
    })()
  }, [web3Provider, safeSelected])

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
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
        <AuthenticateMessage
          message="To use the Onramp Kit you need to be authenticated"
          onConnect={loginWeb3Auth}
        />
      ) : (
        <Box display="flex" gap={3} alignItems="flex-wrap">
          {/* safe Account */}
          <ConnectedContainer flex={1} minHeight={265}>
            <Typography fontWeight="700">Safe Account</Typography>

            <Typography fontSize="14px" marginTop="8px" marginBottom="32px">
              Your Safe account (Smart Contract) holds and protects your assets.
            </Typography>

            {/* Safe Info */}
            {safeSelected && <SafeInfo safeAddress={safeSelected} chainId={chainId} />}
          </ConnectedContainer>

          {/* Provider widget */}
          <ConnectedContainer flex={2} minHeight={265}>
            <Tabs
              value={tabsValue}
              onChange={handleTabChange}
              aria-label="basic tabs example"
              sx={{ marginTop: '-15px' }}
            >
              <Tab label="Monerium" sx={{ fontWeight: 'bold' }} />
              <Tab label="Stripe" sx={{ fontWeight: 'bold' }} />
            </Tabs>

            {tabsValue === 0 && (
              <>
                {moneriumInfo ? (
                  <>
                    <Typography fontSize="14px" marginTop="8px" marginBottom="16px">
                      🔥 {moneriumInfo.name}, you are logged in using Monerium !!
                    </Typography>
                    <Typography fontSize="14px" marginTop="8px" marginBottom="16px">
                      Your account{' '}
                      <Typography component="span" color="primary">
                        {moneriumInfo.iban.replace(/\s/g, '')}
                      </Typography>{' '}
                      balance is{' '}
                      <Typography component="span" fontWeight="bold">
                        {moneriumInfo.balance + 'EUR'}
                      </Typography>
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
                    {!chain?.isMoneriumPaymentsEnabled ? (
                      <Typography fontSize="14px" marginTop="16px" marginBottom="32px">
                        The Monerium payments are only enabled in Goerli chain.{' '}
                        <Link href="#" onClick={() => setStep(0)}>
                          Update the chosen chain
                        </Link>{' '}
                      </Typography>
                    ) : (
                      <>
                        {isSafeDeployed && (
                          <Typography fontSize="14px" marginTop="16px" marginBottom="32px">
                            You can login with Monerium and link the selected Safe Account{''}
                          </Typography>
                        )}

                        {!isSafeDeployed && (
                          <Typography fontSize="14px" marginTop="16px" marginBottom="32px">
                            The Safe Account is not deployed yet. To use "Login with Monerium",
                            deploy the Safe first by sending your first transaction using the{' '}
                            <Link href="#" onClick={() => setStep(3)}>
                              Relay Kit
                            </Link>{' '}
                          </Typography>
                        )}
                      </>
                    )}

                    <Tooltip title={'Login'}>
                      <Button
                        startIcon={<LoginIcon />}
                        variant="contained"
                        onClick={() => startMoneriumFlow()}
                        disabled={!chain?.isMoneriumPaymentsEnabled || !isSafeDeployed}
                      >
                        Login
                        {!chain?.isMoneriumPaymentsEnabled ? ' (only in Goerli chain)' : ''}
                      </Button>
                    </Tooltip>
                  </>
                )}
              </>
            )}

            {tabsValue === 1 && (
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
          </ConnectedContainer>
        </Box>
      )}

      <Divider style={{ margin: '40px 0 30px 0' }} />

      <Typography variant="h3" component="h2" fontWeight="700" marginBottom="16px">
        How to use it
      </Typography>

      <Code text={tabsValue === 0 ? MONERIUM_SNIPPET : STRIPE_SNIPPET} language={'javascript'} />
    </>
  )
}

export default OnRampKitDemo
