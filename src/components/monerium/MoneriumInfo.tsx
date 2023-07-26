import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import LogoutIcon from '@mui/icons-material/LogoutRounded'

import { MoneriumInfo as Info } from 'src/utils/getMoneriumInfo'

type MoneriumInfoProps = {
  moneriumInfo: Info
  onLogout: () => void
}

function MoneriumInfo({ moneriumInfo, onLogout }: MoneriumInfoProps) {
  return (
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
        <Button startIcon={<LogoutIcon />} variant="contained" onClick={onLogout}>
          Logout
        </Button>
      </Tooltip>
    </>
  )
}

export default MoneriumInfo
