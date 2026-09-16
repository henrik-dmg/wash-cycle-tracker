import { NextResponse, type NextRequest } from 'next/server'
import { guardApiRequest } from '../../../lib/api-guard'

// Lists all machines.
export async function GET(request: NextRequest) {
  const guard = guardApiRequest(request)
  if (guard) {
    return guard
  }

  const { listMachines } = await import('../../../lib/machine.service')
  try {
    const machines = await listMachines()
    return NextResponse.json(machines)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

// Creates a machine. The body is `{ "name": string }`.
export async function POST(request: NextRequest) {
  const guard = guardApiRequest(request)
  if (guard) {
    return guard
  }

  const { createMachine, MachineInputError, validateMachineName } = await import('../../../lib/machine.service')
  try {
    const name = validateMachineName(await request.json().catch(() => ({})))
    const machine = await createMachine(name)
    return NextResponse.json(machine)
  } catch (error) {
    if (error instanceof MachineInputError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
