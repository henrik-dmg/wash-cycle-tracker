import {Request, Response} from 'express'
import { AuthState, bannerForAuthState } from './authstate'
import { bannerForQueryError, QueryError } from './queryerror'

export function customRender(view: string, request: Request, response: Response, otherContents?: any) {
  let mergedContents = otherContents
  if (request.query.authState) {
    const state: AuthState = AuthState[request.query.authState as keyof typeof AuthState]
    if (state) {
      const stateObject: any = bannerForAuthState(state)
      mergedContents = {...mergedContents, ...stateObject}
    } else {
      console.log(`invalid authState ${request.query.authState}`)
    }
  }
  if (request.query.error) {
    const queryError: QueryError = QueryError[request.query.error as keyof typeof QueryError]
    if (queryError) {
      const stateObject: any = bannerForQueryError(queryError)
      mergedContents = {...mergedContents, ...stateObject}
    } else {
      console.log(`invalid error ${request.query.error}`)
    }
  }
  response.render(view, mergedContents)
}