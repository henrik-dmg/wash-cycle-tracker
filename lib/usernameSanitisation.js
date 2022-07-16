export function sanitiseUsername(username) {
  return username.split("|")[1]
}