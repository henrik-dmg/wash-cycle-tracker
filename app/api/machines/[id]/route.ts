import { NextResponse, type NextRequest } from 'next/server'
import { deleteMachine, getMachine, MachineInputError, renameMachine, validateMachineName } from '../../../../lib/machine.service'

// Gets one machine with its entries.
export async function GET(_request: NextRequest, context: RouteContext<'/api/machines/[id]'>) {
  const { id } = await context.params
  const machineId = parseInt(id)
  if (!machineId) {
    return NextResponse.json({ message: 'Invalid machine ID' }, { status: 400 })
  }

  try {
    const machine = await getMachine(machineId)
    if (!machine) {
      return NextResponse.json({ message: 'Machine not found' }, { status: 404 })
    }
    return NextResponse.json(machine)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}

// Renames a machine. The body is `{ "name": string }`.
export async function PATCH(request: NextRequest, context: RouteContext<'/api/machines/[id]'>) {
  const { id } = await context.params
  const machineId = parseInt(id)
  if (!machineId) {
    return NextResponse.json({ message: 'Invalid machine ID' }, { status: 400 })
  }

  try {
    const name = validateMachineName(await request.json().catch(() => ({})))
    const machine = await renameMachine(machineId, name)
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
}

// Deletes a machine and its entries.
export async function DELETE(_request: NextRequest, context: RouteContext<'/api/machines/[id]'>) {
  const { id } = await context.params
  const machineId = parseInt(id)
  if (!machineId) {
    return NextResponse.json({ message: 'Invalid machine ID' }, { status: 400 })
  }

  try {
    const deleted = await deleteMachine(machineId)
    if (!deleted) {
      return NextResponse.json({ message: 'Machine not found' }, { status: 404 })
    }
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
