export function sanitiseUsername(username: string) {
  return username.replace('auth|', '')
}
