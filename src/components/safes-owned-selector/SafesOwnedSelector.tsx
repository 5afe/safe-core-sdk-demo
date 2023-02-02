import { useCallback, useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import getSafesByOwner from "src/api/getSafesByOwner";
import useApi from "src/hooks/useApi";

type SafesOwnedSelectorProps = {
  ownerAddress: string;
  chainId: string;
  safeSelected: string;
  handleChange: React.Dispatch<React.SetStateAction<string>>;
};

function SafesOwnedSelector({
  ownerAddress,
  chainId,
  safeSelected,
  handleChange,
}: SafesOwnedSelectorProps) {
  const [safes, setSafes] = useState<string[]>([]);

  const fetchSafesOwned = useCallback(
    async (signal: AbortSignal) => {
      const { safes } = await getSafesByOwner(ownerAddress, chainId, {
        signal,
      });

      setSafes(safes);
    },
    [chainId, ownerAddress]
  );

  const { isLoading } = useApi(fetchSafesOwned);

  useEffect(() => {
    const initialSafe = safes[0];
    if (initialSafe) {
      handleChange(initialSafe);
    }
  }, [safes, handleChange]);

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="owned-safes-selector-label">Safes owned</InputLabel>
        <Select
          labelId="owned-safes-selector-label"
          disabled={isLoading}
          id="owned-safes-selector"
          value={safeSelected}
          onChange={(event) => handleChange(event.target.value)}
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
    </div>
  );
}

export default SafesOwnedSelector;
