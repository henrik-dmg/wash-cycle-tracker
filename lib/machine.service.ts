import { Machine } from '@prisma/client'
import prisma from './prisma'
import safeJsonStringify from 'safe-json-stringify'

export async function fetchMachine(id: number): Promise<Machine | null> {
  const machine = await prisma.machine.findUnique({ where: { id: id } })
  if (machine) {
    machine.createdAt = JSON.parse(safeJsonStringify(machine.createdAt))
  }
  return machine
}

export async function fetchMachines(): Promise<Array<Machine>> {
  const machines = await prisma.machine.findMany()
  machines.map((machine) => {
    machine.createdAt = JSON.parse(safeJsonStringify(machine.createdAt))
  })
  return machines
}
