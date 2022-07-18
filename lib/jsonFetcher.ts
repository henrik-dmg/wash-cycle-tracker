export default async function jsonFetcher(uri: string) {
  const response = await fetch(uri)
  return response.json()
}
