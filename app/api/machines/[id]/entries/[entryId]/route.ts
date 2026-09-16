import { NextResponse, type NextRequest } from 'next/server'
import { guardApiRequest } from '../../../../../../lib/api-guard'

export async function DELETE(request: NextRequest, context: RouteContext<'/api/machines/[id]/entries/[entryId]'>) {
  const guard = guardApiRequest(request)
  if (guard) {
    return guard
  }

  const { id, entryId } = await context.params
  const machineId = parseInt(id)
  const parsedEntryId = parseInt(entryId)
  if (!machineId || !parsedEntryId) {
    return NextResponse.json({ message: 'Invalid machine or entry ID' }, { status: 400 })
  }

  const { deleteEntry } = await import('../../../../../../lib/machine.service')
  try {
    const deleted = await deleteEntry(machineId, parsedEntryId)
    if (!deleted) {
      return NextResponse.json({ message: 'Entry not found' }, { status: 404 })
    }
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
