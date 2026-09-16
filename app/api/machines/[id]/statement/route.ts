import { NextResponse } from 'next/server'
import { withSessionEnsured } from '../../../../../lib/session.utilities'
import { fetchMachineDetails } from '../../../../../lib/machine.service'
import { toDecimalString } from '../../../../../lib/money'
import { buildStatement, isMonthKey, monthKey } from '../../../../../lib/statement'

// Writes a number or a decimal amount as it is, and quotes all other text.
// Text with a leading "=", "+", "-" or "@" gets a "'" prefix, so a spreadsheet does not run a name as a formula.
function csvCell(value: string | number): string {
  const text = String(value)
  if (/^\d+(\.\d+)?$/.test(text)) {
    return text
  }
  const safeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return `"${safeText.replaceAll('"', '""')}"`
}

// Returns the monthly cost split as a CSV file: GET /api/machines/:id/statement?month=YYYY-MM
export const GET = withSessionEnsured<RouteContext<'/api/machines/[id]/statement'>>(async (request, context, session) => {
  const { id } = await context.params
  const machineId = parseInt(id)
  const month = request.nextUrl.searchParams.get('month') ?? monthKey(new Date())
  if (!machineId || !isMonthKey(month)) {
    return NextResponse.json({ message: 'Invalid machine ID or month' }, { status: 400 })
  }

  try {
    const machine = await fetchMachineDetails(session.user.sub, machineId)
    if (!machine) {
      return NextResponse.json({ message: 'Machine not found' }, { status: 404 })
    }
    const statement = buildStatement(machine.actions, machine.members, month)
    const lines = [
      ['Member', 'Washes', 'Cleans', 'Amount', 'Currency'],
      ...statement.rows.map((row) => [row.name, row.washes, row.cleans, toDecimalString(row.amount, machine.currency), machine.currency]),
      ['Total', statement.totalWashes, statement.totalCleans, toDecimalString(statement.totalAmount, machine.currency), machine.currency],
    ]
    const csv = lines.map((line) => line.map(csvCell).join(',')).join('\r\n') + '\r\n'
    const fileName = `statement-machine-${machine.id}-${month}.csv`

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
})
