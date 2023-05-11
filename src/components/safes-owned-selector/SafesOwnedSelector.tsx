import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

import { useAccountAbstraction } from 'src/store/accountAbstractionContext'

type SafesOwnedSelectorProps = {
  safeSelected: string
  onSelectSafe: React.Dispatch<React.SetStateAction<string>>
}

function SafesOwnedSelector({ safeSelected, onSelectSafe }: SafesOwnedSelectorProps) {
  const { safes } = useAccountAbstraction()

  const showDerivedSafeAddress = safes.length === 0

  if (showDerivedSafeAddress) {
    return null
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 80 }}>
      <InputLabel id="owned-safes-selector-label">Safes owned</InputLabel>
      <Select
        labelId="owned-safes-selector-label"
        id="owned-safes-selector"
        value={safeSelected}
        onChange={(event) => onSelectSafe(event.target.value)}
        autoWidth
        label="Safes owned"
      >
        {safes.map((safe) => (
          <MenuItem key={safe} value={safe}>
            {safe}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SafesOwnedSelector
