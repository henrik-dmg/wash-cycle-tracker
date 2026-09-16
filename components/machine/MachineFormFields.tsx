'use client'

export interface MachineFormValues {
  name: string
}

// Reads the values of `MachineFormFields`.
export function readMachineForm(form: HTMLFormElement): MachineFormValues {
  const data = new FormData(form)
  return { name: ((data.get('name') as string | null) ?? '').trim() }
}

export const inputClasses =
  'mt-1 w-full rounded-lg border border-zinc-300 bg-white/80 px-3 py-2 text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-white'

const labelClasses = 'block text-sm font-semibold text-zinc-700 dark:text-zinc-200'

interface Props {
  name?: string
}

// Form fields for a new machine. Read the values with `readMachineForm`.
export default function MachineFormFields({ name = '' }: Props) {
  return (
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
        placeholder="Home"
      />
    </div>
  )
}
