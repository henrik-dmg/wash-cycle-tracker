import { NextResponse, type NextRequest } from 'next/server'
import { apiNotFoundOutsideDeploymentMode } from '../../../../../lib/api-guard'

// Logs a wash or a cleaning. The body is `{ "kind": "wash" | "cleaning", "occurredAt"?: string }`.
// Uses the current time when occurredAt is not given.
export async function POST(request: NextRequest, context: RouteContext<'/api/machines/[id]/entries'>) {
  const guard = apiNotFoundOutsideDeploymentMode()
  if (guard) {
    return guard
  }

  const { id } = await context.params
  const machineId = parseInt(id)
  if (!machineId) {
    return NextResponse.json({ message: 'Invalid machine ID' }, { status: 400 })
  }

  const { logEntry, MachineInputError, validateEntryInput } = await import('../../../../../lib/machine.service')
  try {
    const { kind, occurredAt } = validateEntryInput(await request.json().catch(() => ({})))
    const entry = await logEntry(machineId, kind, occurredAt)
    if (!entry) {
      return NextResponse.json({ message: 'Machine not found' }, { status: 404 })
    }
    return NextResponse.json(entry)
  } catch (error) {
    if (error instanceof MachineInputError) {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
