import { Machine } from '@prisma/client'
import prisma from './prisma'
import safeJsonStringify from 'safe-json-stringify'

export async function fetchMachine(id: number): Promise<Machine | null> {
  const machine = await prisma.machine.findUnique({
    where: { id: id },
  })
  if (machine) {
    safeEncodeMachine(machine)
  }
  return machine
}

export async function fetchMachinesForUser(userId: string): Promise<Array<Machine>> {
  const userMachineRelationships = await prisma.usersOnMachines.findMany({
    where: { userId: userId },
    include: { machine: true },
  })
  return userMachineRelationships.map((relationship) => relationship.machine)
}

function safeEncodeMachine(machine: Machine): Machine {
  machine.createdAt = JSON.parse(safeJsonStringify(machine.createdAt))
  return machine
}
