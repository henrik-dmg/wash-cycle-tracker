// Money helpers. This file has no Prisma import, so client components can use it.

export const CURRENCIES = ['EUR', 'CHF', 'GBP', 'USD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK']

export const MAX_COST_PER_WASH = 1_000_000

export function isSupportedCurrency(currency: string): boolean {
  return CURRENCIES.includes(currency)
}

// Number of digits after the decimal point for the currency, for example 2 for EUR.
export function fractionDigits(currency: string): number {
  return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2
}

export function formatMoney(minorUnits: number, currency: string): string {
  const digits = fractionDigits(currency)
  // A fixed locale gives the same text on the server and in the browser.
  return new Intl.NumberFormat('en', { style: 'currency', currency }).format(minorUnits / 10 ** digits)
}

// Converts an amount in minor units to a plain decimal string, for example 250 -> "2.50".
export function toDecimalString(minorUnits: number, currency: string): string {
  const digits = fractionDigits(currency)
  return (minorUnits / 10 ** digits).toFixed(digits)
}

// Converts user input such as "2.50" or "2,5" to minor units. Returns null for input that is not a valid amount.
export function parseMoney(input: string, currency: string): number | null {
  const normalized = input.trim().replace(',', '.')
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null
  }
  const minorUnits = Math.round(Number(normalized) * 10 ** fractionDigits(currency))
  return minorUnits <= MAX_COST_PER_WASH ? minorUnits : null
}
