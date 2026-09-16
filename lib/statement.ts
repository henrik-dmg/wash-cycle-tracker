// Monthly cost split. This file has no Prisma import, so the machine page and the CSV route use the same calculation.

export type ActionType = 'wash' | 'clean'

export interface ActionEntry {
  id: number
  userId: string
  actionType: string
  cost: number
  // ISO 8601 date string.
  date: string
}

export interface Member {
  userId: string
  name: string
}

export interface StatementRow {
  userId: string
  name: string
  washes: number
  cleans: number
  amount: number
}

export interface Statement {
  month: string
  rows: StatementRow[]
  totalWashes: number
  totalCleans: number
  totalAmount: number
}

const MONTH_KEY_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/

export function isActionType(value: string): value is ActionType {
  return value === 'wash' || value === 'clean'
}

export function isMonthKey(value: string): boolean {
  return MONTH_KEY_PATTERN.test(value)
}

// Returns the UTC month of the date as "YYYY-MM".
export function monthKey(date: Date | string): string {
  return new Date(date).toISOString().slice(0, 7)
}

export function shiftMonth(month: string, delta: number): string {
  const [year, monthIndex] = month.split('-').map(Number)
  return monthKey(new Date(Date.UTC(year, monthIndex - 1 + delta, 1)))
}

export function formatMonth(month: string): string {
  const [year, monthIndex] = month.split('-').map(Number)
  return new Date(Date.UTC(year, monthIndex - 1, 1)).toLocaleDateString('en', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

// Adds up the washes, cleans and costs of each person for the month. Every member gets a row, also with no cycles.
// A person who is not a member but has entries in the month also gets a row.
export function buildStatement(actions: ActionEntry[], members: Member[], month: string): Statement {
  const rows = new Map<string, StatementRow>()
  for (const member of members) {
    rows.set(member.userId, { userId: member.userId, name: member.name, washes: 0, cleans: 0, amount: 0 })
  }

  for (const action of actions) {
    if (monthKey(action.date) !== month) {
      continue
    }
    let row = rows.get(action.userId)
    if (!row) {
      row = { userId: action.userId, name: action.userId, washes: 0, cleans: 0, amount: 0 }
      rows.set(action.userId, row)
    }
    if (action.actionType === 'wash') {
      row.washes += 1
      row.amount += action.cost
    } else if (action.actionType === 'clean') {
      row.cleans += 1
    }
  }

  const sortedRows = [...rows.values()].sort((a, b) => b.amount - a.amount || a.name.localeCompare(b.name))
  return {
    month,
    rows: sortedRows,
    totalWashes: sortedRows.reduce((sum, row) => sum + row.washes, 0),
    totalCleans: sortedRows.reduce((sum, row) => sum + row.cleans, 0),
    totalAmount: sortedRows.reduce((sum, row) => sum + row.amount, 0),
  }
}
