'use client'

import { CURRENCIES, parseMoney, toDecimalString } from '../../lib/money'

export interface MachineFormValues {
  name: string
  description: string
  costPerWash: number
  currency: string
}

// Reads the values of `MachineFormFields`. A disabled currency field sends no value, so `currentCurrency` is the fallback.
export function readMachineForm(form: HTMLFormElement, currentCurrency = 'EUR'): MachineFormValues {
  const data = new FormData(form)
  const currency = (data.get('currency') as string | null) ?? currentCurrency
  const costPerWash = parseMoney((data.get('costPerWash') as string | null) ?? '', currency)
  if (costPerWash === null) {
    throw new Error('Enter a valid cost per wash, for example 0.80')
  }
  return {
    name: ((data.get('name') as string | null) ?? '').trim(),
    description: ((data.get('description') as string | null) ?? '').trim(),
    costPerWash,
    currency,
  }
}

export const inputClasses =
  'mt-1 w-full rounded-lg border border-zinc-300 bg-white/80 px-3 py-2 text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-white'

const labelClasses = 'block text-sm font-semibold text-zinc-700 dark:text-zinc-200'

interface Props {
  name?: string
  description?: string
  costPerWash?: number
  currency?: string
  // True if old entries have a cost, so the currency cannot change.
  currencyLocked?: boolean
}

// Form fields for a new or changed machine. Read the values with `readMachineForm`.
export default function MachineFormFields({ name = '', description = '', costPerWash, currency = 'EUR', currencyLocked = false }: Props) {
  return (
    <>
      <div>
        <label htmlFor="name" className={labelClasses}>
          Machine name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          maxLength={100}
          defaultValue={name}
          className={inputClasses}
          placeholder="Flat 3B washer"
        />
      </div>
      <div>
        <label htmlFor="description" className={labelClasses}>
          Description <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <input
          type="text"
          id="description"
          name="description"
          maxLength={200}
          defaultValue={description}
          className={inputClasses}
          placeholder="Front-loader in the bathroom"
        />
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div>
          <label htmlFor="costPerWash" className={labelClasses}>
            Cost per wash
          </label>
          <input
            type="text"
            inputMode="decimal"
            id="costPerWash"
            name="costPerWash"
            required
            pattern="\d+([.,]\d+)?"
            defaultValue={costPerWash === undefined ? '' : toDecimalString(costPerWash, currency)}
            className={inputClasses}
            placeholder="0.80"
          />
        </div>
        <div>
          <label htmlFor="currency" className={labelClasses}>
            Currency
          </label>
          <select id="currency" name="currency" defaultValue={currency} disabled={currencyLocked} className={inputClasses}>
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Include water, electricity, detergent and wear. A clean cycle is free and counts as a care duty.
        {currencyLocked && ' The currency is locked because entries with a cost exist.'}
      </p>
    </>
  )
}
