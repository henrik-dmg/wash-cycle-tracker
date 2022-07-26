export default async function jsonFetcher<T>(uri: string, method: string) {
  // Form the request for sending data to the server.
  const options = {
    // The method is POST because we are sending data.
    method: method.toUpperCase,
    // Tell the server we're sending JSON.
    headers: {
      'Content-Type': 'application/json',
    },
  }

  // Send the form data to our forms API on Vercel and get a response.
  const response = await fetch(options, uri)

  // Get the response data from server as JSON.
  // If server returns the name submitted, that means the form works.
  return await response.json()
}
