import 'dotenv/config'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '../lib/generated/prisma/client'
import { machines, actions, users, userMachineRelationships } from './data.js'

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL as string })
const prisma = new PrismaClient({ adapter })

const load = async () => {
  try {
    await prisma.action.deleteMany()
    console.log('Deleted records in actions table')
    await prisma.usersOnMachines.deleteMany()
    console.log('Deleted records in usersonmachines table')
    await prisma.machine.deleteMany()
    console.log('Deleted records in machines table')
    await prisma.user.deleteMany()
    console.log('Deleted records in users table')

    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'Action'`
    console.log('reset action auto increment to 1')
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'Machine'`
    console.log('reset machine auto increment to 1')

    await prisma.machine.createMany({
      data: machines,
    })
    console.log('Added machines data')

    await prisma.user.createMany({
      data: users,
    })
    console.log('Added users data')

    await prisma.action.createMany({
      data: actions,
    })
    console.log('Added actions data')

    await prisma.usersOnMachines.createMany({
      data: userMachineRelationships,
    })
    console.log('Added machine-user-relationship data')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()
