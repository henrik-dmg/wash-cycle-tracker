import { NextResponse } from 'next/server'
import { withSessionEnsured } from '../../../../lib/session.utilities'
import { createMachine } from '../../../../lib/machine.service'

export const POST = withSessionEnsured(async (request, _context, session) => {
  try {
    const body = await request.json()
    const machine = await createMachine(body.name, body.description, session.user.sub)
    return NextResponse.json(machine)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
})
