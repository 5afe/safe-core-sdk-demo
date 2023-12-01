import Typography from '@mui/material/Typography'
import SafeInfo from 'src/components/safe-info/SafeInfo'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import AddressLabel from 'src/components/address-label/AddressLabel'

import { ConnectedContainer } from 'src/components/styles'
import { useAccountAbstraction } from 'src/store/accountAbstractionContext'
import { InputLabel } from '@mui/material'

function SafeAccount(props: BoxProps) {
  const { safeSelected, chainId, safes, setSafeSelected } = useAccountAbstraction()

  return (
    <ConnectedContainer {...props}>
      <Typography fontWeight="700">Safe Account</Typography>

      <Typography fontSize="14px" marginTop="8px" marginBottom="32px">
        Your Safe account (Smart Contract) holds and protects your assets.
      </Typography>

      {!!safes && safes.length > 1 && (
        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <InputLabel id="switch-address-selector-label">Select Safe</InputLabel>
          <Select
            color="success"
            aria-label="safe address selector"
            id="switch-address-selector"
            labelId="switch-address-selector-label"
            label="Select Safe"
            value={safeSelected}
            onChange={(event: SelectChangeEvent) => setSafeSelected(event.target.value as string)}
          >
            {safes.map((safeAddress) => (
              <MenuItem
                key={safeAddress}
                value={safeAddress}
                onClick={() => setSafeSelected(safeAddress)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <AddressLabel address={safeAddress} />
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Safe Info */}
      {safeSelected && <SafeInfo safeAddress={safeSelected} chainId={chainId} />}
    </ConnectedContainer>
  )
}

export default SafeAccount
