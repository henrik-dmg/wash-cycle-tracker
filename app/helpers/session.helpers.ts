import User from '../models/user'
import { Request } from 'express'

export function signInSession(user: User, request: Request) {
  request.session.loggedIn = true
  request.session.userID = user._id.toString()
}

export function signOutSession(request: Request) {
  request.session = null
}