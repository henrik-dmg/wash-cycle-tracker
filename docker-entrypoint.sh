#!/bin/sh
set -e

chown nextjs:nodejs /app/data

exec su -s /bin/sh nextjs -c \
  'pnpm exec prisma migrate deploy --config prisma.config.ts && exec pnpm start'
