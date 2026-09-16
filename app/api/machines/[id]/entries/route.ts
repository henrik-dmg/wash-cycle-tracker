import { NextResponse, type NextRequest } from 'next/server'
import { isEntryKind, logEntry } from '../../../../../lib/machine.service'

// Logs a wash or a cleaning at the current time. The body is `{ "kind": "wash" | "cleaning" }`.
export async function POST(request: NextRequest, context: RouteContext<'/api/machines/[id]/entries'>) {
  const { id } = await context.params
  const machineId = parseInt(id)

  try {
    const body = await request.json().catch(() => ({}))
    if (!machineId || !isEntryKind(body.kind)) {
      return NextResponse.json({ message: 'Invalid machine ID or entry kind' }, { status: 400 })
    }
    const entry = await logEntry(machineId, body.kind)
    if (!entry) {
      return NextResponse.json({ message: 'Machine not found' }, { status: 404 })
    }
    return NextResponse.json(entry)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
