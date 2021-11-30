import PrototypeMachine from '../models/prototype-machine'
import Machine from '../models/machine'
import { asyncQuery } from './database.service'
import * as query from '../helpers/query.helpers'

export async function createMachine(name: string): Promise<Machine> {
  const newMachine = new PrototypeMachine(name)
  const rows = await asyncQuery(query.makeInsertCodableQuery('development_machines'), newMachine)
  console.log(rows)
  if (rows.insertId) {
    return new Machine(name, rows.insertId)
  } else {
    throw 'Could not insert new machine'
  }
}