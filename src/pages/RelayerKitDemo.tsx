import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded'
import SendIcon from '@mui/icons-material/SendRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { utils } from 'ethers'
import { useState } from 'react'

import AddressLabel from 'src/components/address-label/AddressLabel'
import AuthenticateMessage from 'src/components/authenticate-message/AuthenticateMessage'
import Code from 'src/components/code/Code'
import GelatoTaskStatusLabel from 'src/components/gelato-task-status-label/GelatoTaskStatusLabel'
import SafeAccount from 'src/components/safe-account/SafeAccount'
import { ConnectedContainer } from 'src/components/styles'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'
import { GELATO_SNIPPET } from 'src/utils/snippets'

const transferAmount = 0.01

const RelayerKitDemo = () => {
  const {
    chainId,
    chain,

    safeSelected,
    safeBalance,

    isRelayerLoading,
    relayTransaction,
    gelatoTaskId,

    isAuthenticated,
    loginWeb3Auth
  } = useAccountAbstraction()

  const [transactionHash, setTransactionHash] = useState<string>('')

  // TODO: ADD PAY FEES USING USDC TOKEN

  const hasNativeFunds =
    !!safeBalance && Number(utils.formatEther(safeBalance || '0')) > transferAmount

  return (
    <>
      <Typography variant="h2" component="h1">
        The Relay Kit
      </Typography>

      <Typography marginTop="16px">
        Allow users to pay fees using any ERC-20 tokens, without having to manage gas. Sponsor
        transactions on behalf of your users. On your first relayed transaction, a Safe Account will
        be automatically deployed and your address will be assigned as the Safe owner.
      </Typography>

      <Typography marginTop="24px" marginBottom="8px">
        Find more info at:
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2}>
        <Link
          href="https://github.com/safe-global/safe-core-sdk/tree/main/packages/relay-kit"
          target="_blank"
        >
          Github
        </Link>

        <Link href="https://docs.safe.global/safe-core-aa-sdk/relay-kit" target="_blank">
          Documentation
        </Link>
      </Stack>

      <Divider sx={{ margin: '32px 0 28px 0' }} />

      {/* Relay Demo */}
      <Typography variant="h4" component="h2" fontWeight="700" marginBottom="16px">
        Interactive demo
      </Typography>

      {!isAuthenticated ? (
        <AuthenticateMessage
          message="To use the Relay Kit you need to be authenticated"
          onConnect={loginWeb3Auth}
        />
      ) : (
        <Box display="flex" gap={3}>
          {/* safe Account */}
          <SafeAccount flex={1} />

          {/* Relay Transaction */}
          <ConnectedContainer
            display="flex"
            flex={2}
            flexDirection="column"
            gap={2}
            alignItems="flex-start"
            flexShrink={0}
          >
            <Typography fontWeight="700">Relayed transaction</Typography>

            {/* Gelato status label */}
            {gelatoTaskId && (
              <GelatoTaskStatusLabel
                gelatoTaskId={gelatoTaskId}
                chainId={chainId}
                setTransactionHash={setTransactionHash}
                transactionHash={transactionHash}
              />
            )}

            {isRelayerLoading && <LinearProgress sx={{ alignSelf: 'stretch' }} />}

            {!isRelayerLoading && !gelatoTaskId && (
              <>
                <Typography fontSize="14px">
                  Check the status of your relayed transaction.
                </Typography>

                {/* send fake transaction to Gelato relayer */}
                <Button
                  startIcon={<SendIcon />}
                  variant="contained"
                  disabled={!hasNativeFunds}
                  onClick={relayTransaction}
                >
                  Send Transaction
                </Button>

                {!hasNativeFunds && (
                  <Typography color="error">
                    Insufficient funds. Send some funds to the Safe Account
                  </Typography>
                )}

                {!hasNativeFunds && chain?.faucetUrl && (
                  <Link href={chain.faucetUrl} target="_blank">
                    Request 0.5 {chain.token}.
                  </Link>
                )}
              </>
            )}

            {/* Transaction details */}
            <Stack gap={0.5} display="flex" flexDirection="column">
              <Typography>
                Transfer {transferAmount} {chain?.token}
              </Typography>

              {safeSelected && (
                <Stack gap={0.5} display="flex" flexDirection="row">
                  <AddressLabel address={safeSelected} showCopyIntoClipboardButton={false} />

                  <ArrowRightAltRoundedIcon />

                  <AddressLabel address={safeSelected} showCopyIntoClipboardButton={false} />
                </Stack>
              )}
            </Stack>
          </ConnectedContainer>
        </Box>
      )}

      <Divider style={{ margin: '40px 0 30px 0' }} />

      <Typography variant="h3" component="h2" fontWeight="700" marginBottom="16px">
        How to use it
      </Typography>

      <Code text={GELATO_SNIPPET} language={'javascript'} />
    </>
  )
}

export default RelayerKitDemo
