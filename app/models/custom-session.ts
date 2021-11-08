import express from 'express'

declare module 'express-session' {
  interface SessionData {
    userID: string
    loggedIn: boolean
  }
}
