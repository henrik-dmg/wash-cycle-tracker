# Washing Machine Server

A self-hosted app for one person. It records the washes and cleanings of your washing machines, and shows the washes since the latest cleaning.

## Development

1. Install the dependencies with `pnpm install`.
2. Add `DATABASE_URL="file:./data/washing-machine.db"` to `.env`.
3. Apply the migrations with `pnpm exec prisma migrate deploy`.
4. Generate the Prisma client with `pnpm exec prisma generate`.
5. Start the development server with `pnpm dev`.

`pnpm seed` replaces all data with sample machines and entries.

`pnpm test` runs the Vitest suite.

## Docker

`docker compose up -d` builds the image from source and starts the app on port 3000. The container applies the migrations when it starts. The SQLite database is in the `db-data` volume.
