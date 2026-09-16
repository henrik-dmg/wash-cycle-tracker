import { NextResponse, type NextRequest } from 'next/server'
import { apiNotFoundOutsideDeploymentMode } from '../../../../lib/api-guard'

// Gets one machine with its entries.
export async function GET(_request: NextRequest, context: RouteContext<'/api/machines/[id]'>) {
  const guard = apiNotFoundOutsideDeploymentMode()
  if (guard) {
    return guard
  }

  const { id } = await context.params
  const machineId = parseInt(id)
  if (!machineId) {
    return NextResponse.json({ message: 'Invalid machine ID' }, { status: 400 })
  }

  const { getMachine } = await import('../../../../lib/machine.service')
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
  const guard = apiNotFoundOutsideDeploymentMode()
  if (guard) {
    return guard
  }

  const { id } = await context.params
  const machineId = parseInt(id)
  if (!machineId) {
    return NextResponse.json({ message: 'Invalid machine ID' }, { status: 400 })
  }

  const { MachineInputError, renameMachine, validateMachineName } = await import('../../../../lib/machine.service')
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
  const guard = apiNotFoundOutsideDeploymentMode()
  if (guard) {
    return guard
  }

  const { id } = await context.params
  const machineId = parseInt(id)
  if (!machineId) {
    return NextResponse.json({ message: 'Invalid machine ID' }, { status: 400 })
  }

  const { deleteMachine } = await import('../../../../lib/machine.service')
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
