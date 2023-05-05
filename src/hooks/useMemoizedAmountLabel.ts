import { useMemo } from 'react'

const DEFAULT_DECIMALS_DISPLAYED = 4

type useMemoizedAmountLabelType = (
  amount: string,
  tokenSymbol: string,
  decimalsDisplayed?: number
) => string

const useMemoizedAmountLabel: useMemoizedAmountLabelType = (
  amount,
  tokenSymbol,
  decimalsDisplayed = DEFAULT_DECIMALS_DISPLAYED
) => {
  const amountLabel = useMemo(() => {
    if (amount) {
      const [integerPart, decimalPart] = amount.split('.')

      const hasDecimal = !!decimalPart
      const decimalLabel = hasDecimal ? `.${decimalPart.slice(0, decimalsDisplayed)}` : ''

      return `${integerPart}${decimalLabel} ${tokenSymbol}`
    }

    return `0 ${tokenSymbol}`
  }, [amount, tokenSymbol, decimalsDisplayed])

  return amountLabel
}

export default useMemoizedAmountLabel
