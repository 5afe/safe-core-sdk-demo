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

import { useAccountAbstraction } from 'src/store/accountAbstractionContext'
import { MONERIUM_SNIPPET, STRIPE_SNIPPET } from 'src/utils/snippets'
import isContractAddress from 'src/utils/isContractAddress'

import Code from 'src/components/code/Code'
import AuthenticateMessage from 'src/components/authenticate-message/AuthenticateMessage'
import { ConnectedContainer } from 'src/components/styles'
import SafeAccount from 'src/components/safe-account/SafeAccount'
import MoneriumDeploySafeAccount from 'src/components/monerium/MoneriumDeploySafeAccount'
import MoneriumChainWarning from 'src/components/monerium/MoneriumChainWarning'
import MoneriumInfo from 'src/components/monerium/MoneriumInfo'

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

        <Link href="https://docs.safe.global/safe-core-aa-sdk/onramp-kit" target="_blank">
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
          <SafeAccount flex={1} minHeight={265} />

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
                  <MoneriumInfo moneriumInfo={moneriumInfo} onLogout={closeMoneriumFlow} />
                ) : (
                  <>
                    {!chain?.isMoneriumPaymentsEnabled ? (
                      <MoneriumChainWarning onUpdateChain={() => setStep(0)} />
                    ) : (
                      <MoneriumDeploySafeAccount
                        isSafeDeployed={isSafeDeployed}
                        onDeploy={() => setStep(3)}
                      />
                    )}
                    <Tooltip title="Login">
                      <Button
                        startIcon={<LoginIcon />}
                        variant="contained"
                        onClick={() => startMoneriumFlow()}
                        disabled={!chain?.isMoneriumPaymentsEnabled || !isSafeDeployed}
                      >
                        Login
                        {!chain?.isMoneriumPaymentsEnabled && ' (only in Goerli chain)'}
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
