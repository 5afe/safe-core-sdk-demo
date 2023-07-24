import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { ConnectedContainer } from 'src/components/styles'

type AuthenticateMessageProps = {
  message: string
  onConnect: () => void
}

function AuthenticateMessage({ message, onConnect }: AuthenticateMessageProps) {
  return (
    <ConnectedContainer
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={3}
      minHeight={265}
    >
      <Typography variant="h4" component="h3" fontWeight="700">
        {message}
      </Typography>

      <Button variant="contained" onClick={onConnect}>
        Connect
      </Button>
    </ConnectedContainer>
  )
}

export default AuthenticateMessage
