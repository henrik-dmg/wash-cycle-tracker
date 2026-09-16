import { randomBytes } from 'node:crypto'
import { Machine } from './generated/prisma/client'
import prisma from './prisma'
import safeJsonStringify from 'safe-json-stringify'
import { isSupportedCurrency, MAX_COST_PER_WASH } from './money'
import type { ActionEntry, ActionType, Member } from './statement'
import { sanitiseUsername } from './usernameSanitisation'

export interface MachineDetails {
  id: number
  name: string
  description: string
  createdAt: string
  costPerWash: number
  currency: string
  inviteCode: string
  members: Member[]
  actions: ActionEntry[]
}

export interface MachineInput {
  name: string
  description: string
  costPerWash: number
  currency: string
}

export class MachineInputError extends Error {}

function generateInviteCode(): string {
  return randomBytes(12).toString('base64url')
}

export async function isMember(userId: string, machineId: number): Promise<boolean> {
  const relationship = await prisma.usersOnMachines.findUnique({
    where: { machineId_userId: { machineId, userId } },
  })
  return relationship !== null
}

// Checks and cleans the input for a new or changed machine. Throws a MachineInputError for input that is not valid.
export function validateMachineInput(body: unknown): MachineInput {
  const input = (body ?? {}) as Record<string, unknown>
  const name = typeof input.name === 'string' ? input.name.trim() : ''
  const description = typeof input.description === 'string' ? input.description.trim() : ''
  const costPerWash = input.costPerWash
  const currency = input.currency

  if (!name || name.length > 100) {
    throw new MachineInputError('The name must have 1 to 100 characters')
  }
  if (description.length > 200) {
    throw new MachineInputError('The description must have 200 characters or fewer')
  }
  if (typeof costPerWash !== 'number' || !Number.isInteger(costPerWash) || costPerWash < 0 || costPerWash > MAX_COST_PER_WASH) {
    throw new MachineInputError('The cost per wash is not valid')
  }
  if (typeof currency !== 'string' || !isSupportedCurrency(currency)) {
    throw new MachineInputError('The currency is not supported')
  }
  return { name, description, costPerWash, currency }
}

export async function fetchMachineDetails(userId: string, machineId: number): Promise<MachineDetails | null> {
  if (!(await isMember(userId, machineId))) {
    return null
  }
  let machine = await prisma.machine.findUnique({
    where: { id: machineId },
    include: {
      users: { orderBy: { assignedAt: 'asc' } },
      actions: { orderBy: { date: 'asc' } },
    },
  })
  if (!machine) {
    return null
  }
  // Machines from before the invite feature have no code. Give them a code the first time a member opens them.
  if (!machine.inviteCode) {
    const { inviteCode } = await prisma.machine.update({
      where: { id: machineId },
      data: { inviteCode: generateInviteCode() },
    })
    machine = { ...machine, inviteCode }
  }

  // Load the names separately: old rows can have a user ID with no user row.
  const userIds = [...new Set([...machine.users.map((user) => user.userId), ...machine.actions.map((action) => action.userId)])]
  const users = await prisma.user.findMany({ where: { id: { in: userIds } } })
  const names = new Map(users.map((user) => [user.id, user.name]))
  const nameOf = (id: string) => names.get(id) ?? sanitiseUsername(id)

  return {
    id: machine.id,
    name: machine.name,
    description: machine.description,
    createdAt: machine.createdAt.toISOString(),
    costPerWash: machine.costPerWash,
    currency: machine.currency,
    inviteCode: machine.inviteCode as string,
    members: machine.users.map((user) => ({ userId: user.userId, name: nameOf(user.userId) })),
    actions: machine.actions.map((action) => ({
      id: action.id,
      userId: action.userId,
      actionType: action.actionType,
      cost: action.cost,
      date: action.date.toISOString(),
    })),
  }
}

export async function fetchMachinesForUser(userId: string): Promise<Array<Machine>> {
  const userMachineRelationships = await prisma.usersOnMachines.findMany({
    where: { userId: userId },
    include: { machine: true },
  })
  return userMachineRelationships.map((relationship) => safeEncodeMachine(relationship.machine))
}

export async function createMachine(input: MachineInput, userId: string): Promise<Machine> {
  const machine = await prisma.machine.create({
    data: {
      ...input,
      inviteCode: generateInviteCode(),
      users: { create: { userId, assignedBy: userId } },
    },
  })
  return safeEncodeMachine(machine)
}

// Changes the machine settings. Returns null if the user is not a member.
export async function updateMachine(machineId: number, input: MachineInput, userId: string): Promise<Machine | null> {
  if (!(await isMember(userId, machineId))) {
    return null
  }
  const machine = await prisma.machine.findUnique({ where: { id: machineId } })
  if (!machine) {
    return null
  }
  // Old entries keep their cost in the minor unit of the old currency, so a currency change would change old statements.
  if (input.currency !== machine.currency) {
    const pricedEntries = await prisma.action.count({ where: { machineId, cost: { gt: 0 } } })
    if (pricedEntries > 0) {
      throw new MachineInputError('You cannot change the currency after a wash with a cost is logged')
    }
  }
  const updated = await prisma.machine.update({ where: { id: machineId }, data: input })
  return safeEncodeMachine(updated)
}

// Adds the user to the machine of the invite code. Returns the machine ID, or null for an unknown code.
export async function joinMachine(inviteCode: string, userId: string): Promise<number | null> {
  const machine = await prisma.machine.findUnique({ where: { inviteCode } })
  if (!machine) {
    return null
  }
  await prisma.usersOnMachines.upsert({
    where: { machineId_userId: { machineId: machine.id, userId } },
    create: { machineId: machine.id, userId, assignedBy: 'invite' },
    update: {},
  })
  return machine.id
}

// Logs a cycle and stores the current cost per wash with it. Returns null if the user is not a member.
export async function logAction(actionType: ActionType, machineId: number, userId: string): Promise<ActionEntry | null> {
  if (!(await isMember(userId, machineId))) {
    return null
  }
  const machine = await prisma.machine.findUnique({ where: { id: machineId } })
  if (!machine) {
    return null
  }
  const action = await prisma.action.create({
    data: {
      machineId,
      userId,
      actionType,
      // A clean cycle is a care duty and costs nothing.
      cost: actionType === 'wash' ? machine.costPerWash : 0,
    },
  })
  return { ...action, date: action.date.toISOString() }
}

// Deletes an entry. Only the author of the entry can delete it, and only while the author is a member.
export async function deleteAction(actionId: number, machineId: number, userId: string): Promise<boolean> {
  if (!(await isMember(userId, machineId))) {
    return false
  }
  const { count } = await prisma.action.deleteMany({ where: { id: actionId, machineId, userId } })
  return count > 0
}

function safeEncodeMachine(machine: Machine): Machine {
  machine.createdAt = JSON.parse(safeJsonStringify(machine.createdAt))
  return machine
}
