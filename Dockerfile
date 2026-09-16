# syntax=docker/dockerfile:1

FROM node:24-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
ENV COREPACK_HOME=/opt/corepack
RUN corepack enable \
  && corepack prepare pnpm@10.32.1 --activate \
  && chmod -R a+rX /opt/corepack

FROM base AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 build-essential \
  && rm -rf /var/lib/apt/lists/*
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG DATABASE_URL="file:./data/washing-machine.db"
ENV DATABASE_URL=$DATABASE_URL
RUN pnpm exec prisma generate --config prisma.config.ts
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
# A default that points at the data volume, so a plain `docker run` of the published image works.
# DEPLOYMENT_MODE stays unset, so the image defaults to the deployment mode.
ENV DATABASE_URL="file:/app/data/washing-machine.db"
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs --home /home/nextjs --shell /bin/sh nextjs \
  && mkdir -p /home/nextjs /app/data \
  && chown -R nextjs:nodejs /home/nextjs /app/data
ENV HOME=/home/nextjs
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/lib/generated ./lib/generated
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --chmod=755 docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENTRYPOINT ["docker-entrypoint.sh"]
