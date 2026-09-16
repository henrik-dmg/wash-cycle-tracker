import { NextResponse } from 'next/server'
import { withSessionEnsured } from '../../../../../lib/session.utilities'
import { logAction } from '../../../../../lib/machine.service'
import { isActionType } from '../../../../../lib/statement'

// Logs a wash or clean cycle. The body is `{ "actionType": "wash" | "clean" }`.
export const POST = withSessionEnsured<RouteContext<'/api/machines/[id]/actions'>>(async (request, context, session) => {
  const { id } = await context.params
  const machineId = parseInt(id)

  try {
    const body = await request.json().catch(() => ({}))
    const actionType = typeof body.actionType === 'string' ? body.actionType : ''
    if (!machineId || !isActionType(actionType)) {
      return NextResponse.json({ message: 'Invalid machine ID or action type' }, { status: 400 })
    }
    const action = await logAction(actionType, machineId, session.user.id)
    if (!action) {
      return NextResponse.json({ message: 'Machine not found' }, { status: 404 })
    }
    return NextResponse.json(action)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
})
