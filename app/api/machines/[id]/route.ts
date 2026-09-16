import { NextResponse } from 'next/server'
import { withSessionEnsured } from '../../../../lib/session.utilities'
import { MachineInputError, updateMachine, validateMachineInput } from '../../../../lib/machine.service'

export const PATCH = withSessionEnsured<RouteContext<'/api/machines/[id]'>>(async (request, context, session) => {
  const { id } = await context.params
  const machineId = parseInt(id)
  if (!machineId) {
    return NextResponse.json({ message: 'Invalid machine ID' }, { status: 400 })
  }

  try {
    const input = validateMachineInput(await request.json())
    const machine = await updateMachine(machineId, input, session.user.sub)
    if (!machine) {
      return NextResponse.json({ message: 'Machine not found' }, { status: 404 })
    }
    return NextResponse.json(machine)
  } catch (error) {
    if (error instanceof MachineInputError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
})
