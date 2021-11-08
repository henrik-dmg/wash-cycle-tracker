import { helpers } from '../services/database.service'

export const maxWashCyclesWithoutCleaning = 5

export async function logWashCycle(request) {
  const username = request.session.machineID
  if (!username) {
    throw 'User is not signed in, should not get to this state'
  }

  const washCollection = helpers.database.collection(`${username}-wash-cycles`)
  const insertResult = await washCollection.insertOne({
    type: 'wash',
    date: Date.now(),
  })
  console.log('Inserted wash documents =>', insertResult)
}

export async function logCleanCycle(request) {
  const username = request.session.machineID
  if (!username) {
    throw 'User is not signed in, should not get to this state'
  }

  const cleanCollection = helpers.database.collection(`${username}-clean-cycles`)
  const insertResult = await cleanCollection.insertOne({
    type: 'clean',
    date: Date.now(),
  })
  console.log('Inserted clean documents =>', insertResult)
}

export async function numberOfWashCyclesSinceLastCleanCycle(request) {
  const username = request.session.machineID
  if (!username) {
    throw 'User is not signed in, should not get to this state'
  }

  const cleanCollection = helpers.database.collection(`${username}-clean-cycles`)
  const washCollection = helpers.database.collection(`${username}-wash-cycles`)
  const lastCleanCycle = await cleanCollection.find({}).sort({ date: -1 }).limit(1).toArray()

  if (lastCleanCycle[0] === null || lastCleanCycle.length == 0) {
    console.log('Returning all wash cycles')
    return await washCollection.count()
  } else {
    console.log('Returning filtered cycles')
    return await washCollection
      .find({
        date: {
          $gte: lastCleanCycle[0].date,
        },
      })
      .count()
  }
}
