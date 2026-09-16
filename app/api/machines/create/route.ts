import { NextResponse } from 'next/server'
import { withSessionEnsured } from '../../../../lib/session.utilities'
import { createMachine, MachineInputError, validateMachineInput } from '../../../../lib/machine.service'

export const POST = withSessionEnsured(async (request, _context, session) => {
  try {
    const input = validateMachineInput(await request.json())
    const machine = await createMachine(input, session.user)
    return NextResponse.json(machine)
  } catch (error) {
    if (error instanceof MachineInputError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
})
