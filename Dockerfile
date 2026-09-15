# ------------------------------------------------------------------------------
# Build / Base Stage
# ------------------------------------------------------------------------------
FROM node:24-alpine AS base

WORKDIR /usr/src/app

# Install dependencies needed for native modules (if any)
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install production and build dependencies
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# ------------------------------------------------------------------------------
# Production Runner Stage
# ------------------------------------------------------------------------------
FROM node:24-alpine AS runner

WORKDIR /usr/src/app

# Ensure OpenSSL for Prisma engine binary
RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root system user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=base /usr/src/app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY src ./src

# Change ownership to non-root user
USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "src/server.js"]
