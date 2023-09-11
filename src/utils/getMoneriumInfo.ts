import { AuthContext, Profile, Balances, Balance, Currency } from '@monerium/sdk'

export type MoneriumInfo = {
  name: string
  email: string
  iban: string
  balance?: string
}

function getAmountForCurrency(balances?: Balances): string {
  if (!balances) return '0'

  return (
    balances.balances.find((balance: Balance) => balance.currency === Currency.eur)?.amount ?? '0'
  )
}

function getIban(profile: Profile, safeAddress: string) {
  return (
    profile.accounts.find((account) => account.address === safeAddress && account.iban)?.iban ?? ''
  )
}

function getMoneriumInfo(
  safeAddress: string,
  authContext: AuthContext,
  profile: Profile,
  balances: Balances | Balances[]
): MoneriumInfo {
  return {
    name: authContext.name,
    email: authContext.name,
    iban: getIban(profile, safeAddress),
    balance: Array.isArray(balances)
      ? getAmountForCurrency(balances.find((balance: Balances) => balance.address === safeAddress))
      : getAmountForCurrency(balances)
  }
}

export default getMoneriumInfo
