export function makeFindByIDQuery(id: string): string {
  return `SELECT * FROM development_users WHERE id = '${id}' LIMIT 1`
}

export function makeFindByNameQuery(name: string): string {
  return `SELECT * FROM development_users WHERE name = '${name}' LIMIT 1`
}