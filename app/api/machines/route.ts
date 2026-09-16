import { NextResponse } from 'next/server'
import { createMachine, listMachines, MachineInputError, validateMachineName } from '../../../lib/machine.service'

// Lists all machines.
export async function GET() {
  try {
    const machines = await listMachines()
    return NextResponse.json(machines)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

// Creates a machine. The body is `{ "name": string }`.
export async function POST(request: Request) {
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
