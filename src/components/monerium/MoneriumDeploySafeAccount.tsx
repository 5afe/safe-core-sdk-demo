import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

type MoneriumDeploySafeAccountProps = {
  isSafeDeployed: boolean
  onDeploy: () => void
}

function MoneriumDeploySafeAccount({ isSafeDeployed, onDeploy }: MoneriumDeploySafeAccountProps) {
  if (isSafeDeployed) {
    return (
      <Typography fontSize="14px" marginTop="16px" marginBottom="32px">
        You can login with Monerium and link the selected Safe Account{''}
      </Typography>
    )
  }

  return (
    <Typography fontSize="14px" marginTop="16px" marginBottom="32px">
      The Safe Account is not deployed yet. To use "Login with Monerium", deploy the Safe first by
      sending your first transaction using the{' '}
      <Link href="#" onClick={onDeploy}>
        Relay Kit
      </Link>{' '}
    </Typography>
  )
}

export default MoneriumDeploySafeAccount
