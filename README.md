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

## Deployment mode

`DEPLOYMENT_MODE` selects which site the app serves. It accepts `deployment` (the default) or `marketing`. Any other value stops the app at start with an error.

- `deployment`: `/` is the tracker. `/help` shows a status block (the version, whether the database directory is writable, and whether `APP_PASSWORD` is set) and tips to update, back up and fix the deployment. The landing page and `/demo` return 404.
- `marketing`: `/` is the landing page. All API routes and `/help` return 404, the app never opens a database, and the container does not run migrations.

## Docker

`docker compose up -d` builds the image from source and starts the app on port 3000. The container applies the migrations when it starts. The SQLite database is in the `db-data` volume.
