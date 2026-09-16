// Thrown by `sendJson` when the response is not ok. `status` is the HTTP status code.
export class HttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message)
  }
}

// Sends the JSON body and returns the parsed response. Throws an HttpError with the server message if the request fails.
export async function sendJson<T>(url: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new HttpError(error?.message ?? 'Something went wrong', response.status)
  }
  return response.status === 204 ? (undefined as T) : response.json()
}
