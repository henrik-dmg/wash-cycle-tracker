const { PrismaClient } = require('@prisma/client')
const { machines, actions } = require('./data.js')
const prisma = new PrismaClient()

const load = async () => {
  try {
    await prisma.action.deleteMany()
    console.log('Deleted records in development_cleanings table')

    await prisma.machine.deleteMany()
    console.log('Deleted records in development_machines table')

    await prisma.$queryRaw`ALTER TABLE Action AUTO_INCREMENT = 1`
    console.log('reset action auto increment to 1')

    await prisma.$queryRaw`ALTER TABLE Machine AUTO_INCREMENT = 1`
    console.log('reset machine auto increment to 1')

    await prisma.machine.createMany({
      data: machines,
    })
    console.log('Added machines data')

    await prisma.action.createMany({
      data: actions,
    })
    console.log('Added actions data')
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

load()