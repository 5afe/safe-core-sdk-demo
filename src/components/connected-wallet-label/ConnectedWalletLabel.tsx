import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { Theme } from '@mui/material'
import LogoutIcon from '@mui/icons-material/LogoutRounded'

import AddressLabel from 'src/components/address-label/AddressLabel'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'
import authLogo from 'src/assets/web3Auth_logo.png'

// TODO: rename this to connected owner?
function ConnectedWalletLabel() {
  const { isAuthenticated, ownerAddress, logoutWeb3Auth } = useAccountAbstraction()

  if (!isAuthenticated) {
    // TODO: ADD NO CONNECTED WALLET LABEL
    return null
  }

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <StyledImg src={authLogo} alt="connected Wallet logo" height={'50px'} />

        <Typography variant="body2">
          {ownerAddress && <AddressLabel address={ownerAddress} showBlockExplorerLink />}
        </Typography>
      </Stack>

      {/* logout button */}
      <Tooltip title="Logout">
        <LogoutIconButton onClick={logoutWeb3Auth}>
          <LogoutIcon fontSize="small" />
        </LogoutIconButton>
      </Tooltip>
    </Stack>
  )
}

export default ConnectedWalletLabel

const StyledImg = styled('img')`
  border-radius: 50%;
`

const LogoutIconButton = styled(IconButton)<{
  theme?: Theme
}>(
  ({ theme }) => `
  border: 1px solid ${theme.palette.border.main};
`
)
