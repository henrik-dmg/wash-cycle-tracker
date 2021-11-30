import { asyncQuery } from './database.service'
import { Request } from 'express'
import { fetchUserByID } from './user.service'
import { makeInsertCodableQuery } from '../helpers/query.helpers'
import Cycle from '../models/cycle'

export const maxWashCyclesWithoutCleaning = 5

export async function logWashCycle(request: Request) {
  const user = await fetchUserByID(request.oidc.user.sub)
  const rows = await asyncQuery(makeInsertCodableQuery('development_cycles'), new Cycle(user.machine))
  if (rows.insertId) {
    console.log('Successfully logged wash count')
  }
}

export async function logCleanCycle(request: Request) {
  const user = await fetchUserByID(request.oidc.user.sub)
  const rows = await asyncQuery(makeInsertCodableQuery('development_cleanings'), new Cycle(user.machine))
  if (rows.insertId) {
    console.log('Successfully logged wash count')
  }
}

export async function numberOfWashCyclesSinceLastCleanCycle(request: Request): Promise<number> {
  const user = await fetchUserByID(request.oidc.user.sub)

  const query = `SELECT * FROM development_cycles WHERE machine = ${user.machine} AND date >= (SELECT date from development_cleanings where machine = ${user.machine} ORDER BY date DESC LIMIT 1)`
  console.log(query)
  const rows = await asyncQuery(query)

  return rows.length

  // const username = request.session.userID
  // if (!username) {
  //   throw 'User is not signed in, should not get to this state'
  // }

  // const cleanCollection = helpers.database.collection(`${username}-clean-cycles`)
  // const washCollection = helpers.database.collection(`${username}-wash-cycles`)
  // const lastCleanCycle = await cleanCollection.find({}).sort({ date: -1 }).limit(1).toArray()

  // if (lastCleanCycle[0] === null || lastCleanCycle.length == 0) {
  //   console.log('Returning all wash cycles')
  //   return await washCollection.count()
  // } else {
  //   console.log('Returning filtered cycles')
  //   return await washCollection
  //     .find({
  //       date: {
  //         $gte: lastCleanCycle[0].date,
  //       },
  //     })
  //     .count()
  // }
}
