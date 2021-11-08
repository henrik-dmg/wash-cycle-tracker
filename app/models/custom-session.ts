import express from 'express'

declare module 'express-session' {
  interface SessionData {
    machineID: string
    loggedIn: boolean
  }
}
