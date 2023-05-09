import Tooltip from '@mui/material/Tooltip'

import useMemoizedAmountLabel from 'src/hooks/useMemoizedAmountLabel'

type AmountLabelType = {
  amount: string
  tokenSymbol: string
  decimalsDisplayed?: number
}

function AmountLabel({ amount, tokenSymbol, decimalsDisplayed }: AmountLabelType) {
  const amountLabel = useMemoizedAmountLabel(amount, tokenSymbol, decimalsDisplayed)

  return (
    <Tooltip title={`${amount} ${tokenSymbol}`}>
      <span>{amountLabel}</span>
    </Tooltip>
  )
}

export default AmountLabel
