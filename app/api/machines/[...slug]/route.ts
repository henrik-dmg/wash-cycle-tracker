import { NextResponse } from 'next/server'
import { withSessionEnsured } from '../../../../lib/session.utilities'
import { logAction } from '../../../../lib/machine.service'

interface Context {
  params: Promise<{ slug: string[] }>
}

export const POST = withSessionEnsured<Context>(async (_request, context, session) => {
  const { user } = session
  const { slug } = await context.params

  const machineId = parseInt(slug[0])
  const action = slug[1]

  try {
    if (!machineId) {
      throw 'Invalid path called, machine id should come after /machines'
    }
    if (action === 'clean' || action === 'wash') {
      const washAction = await logAction(action, machineId, user.sub)
      return NextResponse.json(washAction)
    } else {
      throw `Invalid action ${action} was passed`
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
})
