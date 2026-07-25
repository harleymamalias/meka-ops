# Local Development Setup — meka-ops

## Prerequisites

| Tool           | Version | Install                                        |
| -------------- | ------- | ---------------------------------------------- |
| Node.js        | 20+     | https://nodejs.org or `nvm install 20`         |
| pnpm           | Latest  | `npm install -g pnpm`                          |
| Docker         | Latest  | https://www.docker.com/products/docker-desktop |
| Docker Compose | v2+     | Bundled with Docker Desktop                    |
| Git            | Latest  | https://git-scm.com                            |

Verify:

```bash
node -v          # v20.x.x or higher
pnpm -v          # 8.x.x or higher
docker -v        # Docker version 24.x.x or higher
docker compose version  # Docker Compose version v2.x.x
git --version    # git version 2.x.x
```

---

## 1. Clone & Install

```bash
git clone https://github.com/harleymamalias/meka-ops.git
cd meka-ops
pnpm install
```

---

## 2. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and fill in the values:

```env
# App
PORT=4001
API_PREFIX=api
NODE_ENV=dev

# Database — must match docker-compose.yml postgres service
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=meka_user
DB_PASSWORD=meka_password
DB_NAME=meka_ops_db

# JWT — generate with: openssl rand -base64 48
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_minimum_32_characters_long
JWT_REFRESH_EXPIRES_IN=7d

# Throttling
THROTTLE_TTL=60
THROTTLE_LIMIT=50
```

### Generate Secure JWT Secrets

```bash
# Generate JWT_SECRET
openssl rand -base64 48

# Generate JWT_REFRESH_SECRET (run again for a different value)
openssl rand -base64 48
```

> ⚠️ Never commit `.env` to git. It's already in `.gitignore`.

---

## 3. Start PostgreSQL (Docker)

```bash
docker compose up -d postgres
```

Verify it's running:

```bash
docker compose ps
# Should show postgres service as "healthy" or "running"
```

Check logs if something is wrong:

```bash
docker compose logs postgres
```

Connect to the database manually (optional):

```bash
docker exec -it meka-ops-postgres-1 psql -U meka_user -d meka_ops_db
```

---

## 4. Run Database Migrations

Once the app has its migration files set up (Phase 0):

```bash
# Apply all pending migrations
pnpm run migration:run

# Generate a new migration after changing an entity
pnpm run migration:generate -- src/database/migrations/YourMigrationName

# Revert the last migration
pnpm run migration:revert
```

> During early Phase 0 development, you can temporarily use `synchronize: true` in the TypeORM config (dev only) to let TypeORM auto-create tables. Switch to migrations before Phase 1.

---

## 5. Start the Dev Server

```bash
pnpm run start:dev
```

Expected output:

```
[NestJS] Server started on http://localhost:4001
[NestJS] API available at http://localhost:4001/api
[NestJS] Swagger available at http://localhost:4001/api/docs
```

---

## 6. Access Points

| Service      | URL                              | Available        |
| ------------ | -------------------------------- | ---------------- |
| API Root     | http://localhost:4001/api        | Always           |
| Health Check | http://localhost:4001/api/health | After Phase 0    |
| Swagger UI   | http://localhost:4001/api/docs   | dev + stage only |
| PostgreSQL   | localhost:5432                   | Via Docker       |

---

## 7. Useful Docker Commands

```bash
# Start postgres in background
docker compose up -d postgres

# Stop all services
docker compose down

# Stop + remove volumes (wipes database!)
docker compose down -v

# View logs
docker compose logs -f postgres

# Restart postgres
docker compose restart postgres

# Open psql shell
docker exec -it meka-ops-postgres-1 psql -U meka_user -d meka_ops_db
```

---

## 8. Development Scripts

```bash
# Start with hot reload (use this daily)
pnpm run start:dev

# Start with VS Code debugger
pnpm run start:debug
# Then hit F5 in VS Code (launch.json already configured)

# Lint (ESLint + auto-fix)
pnpm run lint

# Format (Prettier)
pnpm run format

# Run unit tests
pnpm run test

# Run unit tests in watch mode
pnpm run test:watch

# Run E2E tests
pnpm run test:e2e

# Coverage report
pnpm run test:cov

# Build for production
pnpm run build
```

---

## 9. VS Code Debugging

`.vscode/launch.json` is already configured. To use it:

1. Start postgres: `docker compose up -d postgres`
2. Press `F5` in VS Code (or go to Run & Debug panel → select "backend")
3. Set breakpoints anywhere in `src/`

---

## 10. Environment Validation

If you start the app with a missing or invalid env var, it will crash immediately with a clear error:

```
Error: Config validation error: JWT_SECRET is required
```

This is intentional — the app must not start with bad configuration. Fix the `.env` value and restart.

---

## Common Issues

### "Connection refused" on startup

PostgreSQL isn't running. Run `docker compose up -d postgres`.

### "password authentication failed for user"

Your `.env` credentials don't match the Docker Compose postgres credentials. Check `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` against `docker-compose.yml`.

### Port 5432 already in use

You have a local PostgreSQL instance running. Either stop it or change `DB_PORT` in `.env` and the `ports` mapping in `docker-compose.yml`.

### Port 4001 already in use

Something is already on 4001. Either kill it or change `PORT` in `.env`.

```bash
# Find what's on port 4001 (macOS/Linux)
lsof -i :4001
kill -9 <PID>
```

### TypeORM migration errors

Ensure postgres is running and credentials in `.env` match before running migrations.
