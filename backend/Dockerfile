# Base
FROM node:22-alpine AS base

# Install libc compat + OpenSSL for Prisma
RUN apk add --no-cache libc6-compat openssl curl

WORKDIR /app

# Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Development
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
EXPOSE ${BACKEND_PORT:-4000}
CMD ["npm", "run", "start:dev"]

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production
FROM base AS production
ENV NODE_ENV=production

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Add entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nestjs \
    && chown -R nestjs:nodejs /app
USER nestjs

EXPOSE ${BACKEND_PORT:-4000}        
CMD ["./entrypoint.sh"]