import { ObjectId } from 'bson'
import Machine from '../models/machine'
import { collections } from './database.service'
import { hashPlaintextPassword } from './password.service'

/**
 * @throws {Error}
 */
export async function createNewMachine(name: string, plaintextPassword: string): Promise<Machine> {
  const hashedPassword = await hashPlaintextPassword(plaintextPassword)
  const machine = new Machine(name, hashedPassword)
  const result = await collections.washingMachines.insertOne(machine)
  if (result) {
    machine.id = result.insertedId
    return machine
  } else {
    throw `Could not create new machine with name ${name}`
  }
}

export async function fetchExistingMachine(name: string): Promise<Machine> {
  return (await collections.washingMachines.findOne({ name: name })) as Machine
}

/**
 * @throws {Error}
 */
export async function updatePasswordForMachine(machine: Machine, newPlaintextPassword: string): Promise<Machine> {
  const newHashedPassword = await hashPlaintextPassword(newPlaintextPassword)
  const updatedMachine = machine
  updatedMachine.passwordHash = newHashedPassword
  const updateResult = await collections.washingMachines.findOneAndUpdate({ _id: new ObjectId(machine.id) }, updatedMachine)
  if (updateResult.ok) {
    return updatedMachine
  } else {
    throw `Could not update password for machine ${machine.id}`
  }
}
