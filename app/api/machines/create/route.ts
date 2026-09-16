import { NextResponse } from 'next/server'
import { createMachine, MachineInputError, validateMachineName } from '../../../../lib/machine.service'

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
