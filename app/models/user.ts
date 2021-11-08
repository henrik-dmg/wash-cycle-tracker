import { ObjectId } from 'mongodb'

export default class User {
  constructor(public name: string, public passwordHash: string, public _id?: ObjectId) {}
}
