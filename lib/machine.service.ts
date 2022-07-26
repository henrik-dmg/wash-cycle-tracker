import { Action, Machine } from '@prisma/client'
import prisma from './prisma'
import safeJsonStringify from 'safe-json-stringify'

export type MachineWithActions = Machine & {
  actions: Action[]
}

export async function fetchMachine(userId: string, machineId: number): Promise<MachineWithActions | null> {
  const userMachineRelationships = await prisma.usersOnMachines.findMany({
    where: {
      userId: userId,
      machineId: machineId,
    },
    include: {
      machine: {
        include: {
          actions: true,
        },
      },
    },
  })
  if (userMachineRelationships.length > 1) {
    console.error('A user should only have a one-to-one relationship to a machine')
    return null
  }
  if (userMachineRelationships.length === 0) {
    return null
  }
  return safeEncodeMachineWithActions(userMachineRelationships[0].machine)
}

export async function fetchMachinesForUser(userId: string): Promise<Array<Machine>> {
  const userMachineRelationships = await prisma.usersOnMachines.findMany({
    where: { userId: userId },
    include: { machine: true },
  })
  return userMachineRelationships.map((relationship) => safeEncodeMachine(relationship.machine))
}

export async function createMachine(name: string, description: string, userId: string): Promise<Machine | null> {
  const newMachine = {
    name: name,
    description: description,
  }
  const machine = await prisma.machine.create({ data: newMachine })
  const newRelationship = {
    userId: userId,
    machineId: machine.id,
    assignedBy: 'admin',
  }
  await prisma.usersOnMachines.create({ data: newRelationship })
  return safeEncodeMachine(machine)
}

export async function logAction(actionType: string, machineId: number, userId: string): Promise<Action | null> {
  const newAction = {
    machineId: machineId,
    userId: userId,
    actionType: actionType,
  }
  return await prisma.action.create({ data: newAction })
}

function safeEncodeMachineWithActions(machine: MachineWithActions): MachineWithActions {
  machine.createdAt = JSON.parse(safeJsonStringify(machine.createdAt))
  machine.actions.forEach((action) => {
    action.date = JSON.parse(safeJsonStringify(action.date))
  })
  return machine
}

function safeEncodeMachine(machine: Machine): Machine {
  machine.createdAt = JSON.parse(safeJsonStringify(machine.createdAt))
  return machine
}
