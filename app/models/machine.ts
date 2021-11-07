import { ObjectId } from 'mongodb'

export default class Machine {
  constructor(public name: string, public passwordHash: number, public users: [ObjectId], public id?: ObjectId) {}
}
