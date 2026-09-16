#!/bin/sh
set -e

chown nextjs:nodejs /app/data

if [ "$DEPLOYMENT_MODE" = "marketing" ]; then
  exec su -s /bin/sh nextjs -c 'exec pnpm start'
else
  exec su -s /bin/sh nextjs -c \
    'pnpm exec prisma migrate deploy --config prisma.config.ts && exec pnpm start'
fi
