# ─────────────────────────────────────────────────────────────
# Stage 1: Builder
# Install all deps (dev + prod) and compile TypeScript
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files first — layer cache: only re-run install if deps change
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDeps for build)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Compile TypeScript
RUN pnpm run build

# ─────────────────────────────────────────────────────────────
# Stage 2: Production
# Lean image — only compiled output + production dependencies
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output from builder
COPY --from=builder /app/dist ./dist

# Set ownership to non-root user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port (must match PORT env var)
EXPOSE 4001

# Health check — adjust path after implementing health endpoint in Phase 0
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4001/api/health || exit 1

# Run the compiled app
CMD ["node", "dist/main"]
