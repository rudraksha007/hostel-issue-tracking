FROM oven/bun:1.3.5 AS base
WORKDIR /app

FROM base AS prep
COPY . .
RUN bunx turbo prune backend --docker

FROM base AS builder
COPY --from=prep /app/out/json ./
RUN bun install
COPY --from=prep /app/out/full ./
RUN bun generate
RUN bun run build

FROM oven/bun:1.3.5 as runner
WORKDIR /app/packages/db
RUN bun add prisma
WORKDIR /app
RUN groupadd --system --gid 1001 bunjs && useradd --system --uid 1001 --gid bunjs bunjs
RUN mkdir -p /app/apps/backend/uploads
RUN chown -R bunjs:bunjs /app
USER bunjs
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder /app/packages/db/prisma.config.ts ./packages/db
COPY apps/backend/.env ./app/apps/backend/.env
COPY apps/backend/.env ./app/packages/db/.env

# reset the working directory for docker compose
WORKDIR /app 