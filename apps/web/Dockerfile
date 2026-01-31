FROM oven/bun:1.3.5 AS base
WORKDIR /app

FROM base AS prep
COPY . .
RUN bunx turbo prune web --docker

FROM base AS builder
COPY --from=prep /app/out/json ./
RUN bun install
COPY --from=prep /app/out/full ./
RUN bun generate
RUN bun run build

FROM oven/bun:1.3.5 as runner
WORKDIR /app
RUN groupadd --system --gid 1001 bunjs && useradd --system --uid 1001 --gid bunjs bunjs
RUN chown -R bunjs:bunjs /app
USER bunjs
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/package.json ./package.json
# reset the working directory for docker compose
WORKDIR /app