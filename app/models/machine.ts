import { ObjectId } from 'mongodb'

export default class Machine {
  constructor(public name: string, public passwordHash: string, public id?: ObjectId) {}
}
