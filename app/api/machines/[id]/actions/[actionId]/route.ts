import { NextResponse } from 'next/server'
import { withSessionEnsured } from '../../../../../../lib/session.utilities'
import { deleteAction } from '../../../../../../lib/machine.service'

export const DELETE = withSessionEnsured<RouteContext<'/api/machines/[id]/actions/[actionId]'>>(async (_request, context, session) => {
  const { id, actionId } = await context.params
  const machineId = parseInt(id)
  const parsedActionId = parseInt(actionId)
  if (!machineId || !parsedActionId) {
    return NextResponse.json({ message: 'Invalid machine or entry ID' }, { status: 400 })
  }

  try {
    const deleted = await deleteAction(parsedActionId, machineId, session.user.id)
    if (!deleted) {
      return NextResponse.json({ message: 'Entry not found' }, { status: 404 })
    }
    return new Response(null, { status: 204 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
})
