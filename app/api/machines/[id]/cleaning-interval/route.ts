import { NextResponse, type NextRequest } from 'next/server'
import { MachineInputError, setCleaningInterval, validateCleaningInterval } from '../../../../../lib/machine.service'

// Sets or clears the cleaning interval of a machine. The body is `{ "cleaningInterval": number | null }`.
export async function PATCH(request: NextRequest, context: RouteContext<'/api/machines/[id]/cleaning-interval'>) {
  const { id } = await context.params
  const machineId = parseInt(id)
  if (!machineId) {
    return NextResponse.json({ message: 'Invalid machine ID' }, { status: 400 })
  }

  try {
    const cleaningInterval = validateCleaningInterval(await request.json().catch(() => ({})))
    const machine = await setCleaningInterval(machineId, cleaningInterval)
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
