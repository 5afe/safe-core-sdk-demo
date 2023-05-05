import { useMemo } from 'react'

const CHAR_DISPLAYED = 6

const useMemoizedAddressLabel = (address: string) => {
  const addressLabel = useMemo(() => {
    if (address) {
      const firstPart = address.slice(0, CHAR_DISPLAYED)
      const lastPart = address.slice(address.length - CHAR_DISPLAYED)

      return `${firstPart}...${lastPart}`
    }

    return address
  }, [address])

  return addressLabel
}

export default useMemoizedAddressLabel
