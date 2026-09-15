#!/bin/sh
set -e

chown nextjs:nodejs /app/data

exec su -s /bin/sh nextjs -c \
  'pnpm exec prisma db push --config prisma.config.ts && exec pnpm start'
