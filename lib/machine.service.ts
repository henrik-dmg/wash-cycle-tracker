import { Machine } from '@prisma/client'
import prisma from './prisma'
import safeJsonStringify from 'safe-json-stringify'

export async function fetchMachine(userId: string, machineId: number): Promise<Machine | null> {
  const userMachineRelationships = await prisma.usersOnMachines.findMany({
    where: {
      userId: userId,
      machineId: machineId,
    },
    include: { machine: true },
  })
  if (userMachineRelationships.length > 1) {
    console.error('A user should only have a one-to-one relationship to a machine')
    return null
  }
  if (userMachineRelationships.length === 0) {
    return null
  }
  return safeEncodeMachine(userMachineRelationships[0].machine)
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

function safeEncodeMachine(machine: Machine): Machine {
  machine.createdAt = JSON.parse(safeJsonStringify(machine.createdAt))
  return machine
}
