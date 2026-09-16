import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../lib/generated/prisma/client'

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL as string })
const prisma = new PrismaClient({ adapter })

const DAY = 24 * 60 * 60 * 1000

// Returns a date the given number of days before now.
function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY)
}

const load = async () => {
  try {
    // The delete of a machine also deletes its entries.
    await prisma.machine.deleteMany()
    console.log('Deleted all machines and entries')

    await prisma.machine.create({
      data: {
        name: 'Home',
        cleaningInterval: 10,
        entries: {
          create: [
            { kind: 'cleaning', occurredAt: daysAgo(20) },
            ...[18, 15, 12, 9, 6, 3, 1].map((days) => ({ kind: 'wash' as const, occurredAt: daysAgo(days) })),
          ],
        },
      },
    })
    await prisma.machine.create({
      data: {
        name: 'Holiday flat',
        entries: { create: [{ kind: 'wash', occurredAt: daysAgo(40) }] },
      },
    })
    console.log('Added sample machines and entries')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()
