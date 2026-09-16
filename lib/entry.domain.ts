// Pure domain logic for entries. No framework or database import, so the server and every
// client data store can use the same function.

export interface EntryLike {
  kind: 'wash' | 'cleaning'
  // ISO 8601 string.
  occurredAt: string
}

// Counts the washes on a machine after its latest cleaning, by occurred-at time, not by
// list order. Counts every wash when the machine has no cleaning.
export function washesSinceCleaning(entries: EntryLike[]): number {
  const sorted = [...entries].sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))
  const latestCleaning = sorted.find((entry) => entry.kind === 'cleaning')
  const threshold = latestCleaning ? Date.parse(latestCleaning.occurredAt) : -Infinity
  return sorted.filter((entry) => entry.kind === 'wash' && Date.parse(entry.occurredAt) > threshold).length
}
