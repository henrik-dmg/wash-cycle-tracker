export enum QueryError {
  generic = 'generic',
}

export function bannerForQueryError(error: QueryError): any {
  return { error: 'Something went wrong. Please try again' }
}