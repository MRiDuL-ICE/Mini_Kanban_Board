# # Base
# FROM node:22-alpine AS base
# WORKDIR /app
# RUN apk add --no-cache libc6-compat

# # Dependencies
# FROM base AS deps
# COPY package*.json ./
# RUN npm ci

# # Development
# FROM base AS development
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# RUN npx prisma generate
# EXPOSE 4000
# CMD ["npm", "run", "start:dev"]

# # Builder
# FROM base AS builder
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# RUN npx prisma generate
# RUN npm run build

# # Production
# FROM base AS production
# ENV NODE_ENV=production

# COPY --from=deps /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# RUN addgroup --system --gid 1001 nodejs \
#     && adduser --system --uid 1001 nestjs \
#     && chown -R nestjs:nodejs /app
# USER nestjs

# EXPOSE 4000
# CMD ["node", "dist/main"]

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/main"]