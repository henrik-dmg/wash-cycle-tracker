const database = require('../database/database.js')

const maxWashCyclesWithoutCleaning = 5

logWashCycle = async (request) => {
  const username = request.session.userID
  if (!username) {
    throw 'User is not signed in, should not get to this state'
  }

  const washCollection = database.database.collection(`${username}-wash-cycles`)
  const insertResult = await washCollection.insertOne({
    type: 'wash',
    date: Date.now(),
  })
  console.log('Inserted wash documents =>', insertResult)
}

logCleanCycle = async (request) => {
  const username = request.session.userID
  if (!username) {
    throw 'User is not signed in, should not get to this state'
  }

  const cleanCollection = database.database.collection(`${username}-clean-cycles`)
  const insertResult = await cleanCollection.insertOne({
    type: 'clean',
    date: Date.now(),
  })
  console.log('Inserted clean documents =>', insertResult)
}

numberOfWashCyclesSinceLastCleanCycle = async (request) => {
  const username = request.session.userID
  if (!username) {
    throw 'User is not signed in, should not get to this state'
  }

  const cleanCollection = database.database.collection(`${username}-clean-cycles`)
  const washCollection = database.database.collection(`${username}-wash-cycles`)
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

module.exports = {
  maxWashCyclesWithoutCleaning,
  logWashCycle,
  logCleanCycle,
  numberOfWashCyclesSinceLastCleanCycle,
}
