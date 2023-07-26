import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

type MoneriumChainWarningProps = {
  onUpdateChain: () => void
}

function MoneriumChainWarning({ onUpdateChain }: MoneriumChainWarningProps) {
  return (
    <Typography fontSize="14px" marginTop="16px" marginBottom="32px">
      The Monerium payments are only enabled in Goerli chain.{' '}
      <Link href="#" onClick={onUpdateChain}>
        Update the chosen chain
      </Link>{' '}
    </Typography>
  )
}

export default MoneriumChainWarning
