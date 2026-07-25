# meka-ops

<p align="left">
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeORM-0.3-orange" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/pnpm-package_manager-F69220?logo=pnpm&logoColor=white" />
</p>

> **Production-grade Vehicle Service & Maintenance Operations API**
> Built from scratch as a solo backend engineering deep-dive — real architecture, real patterns, real production standards.

---

## What Is This?

**meka-ops** is a RESTful API backend for vehicle service shops — motorcycle shops, car PMS centers, small garages, and maintenance operations.

It manages the full lifecycle of a service job:

```
Customer brings vehicle → Service Advisor creates Service Request
→ Mechanic gets assigned → Works through statuses (PENDING → INSPECTING → IN_PROGRESS → COMPLETED)
→ Parts consumed from Inventory → Invoice generated with labor + parts cost
→ Maintenance Record saved to vehicle history
```

This project is intentionally built as a **learning vehicle** for production backend engineering fundamentals — not a tutorial, not a CRUD toy. Every decision has a reason. Every pattern has a tradeoff.

---

## Tech Stack

| Layer            | Technology                               |
| ---------------- | ---------------------------------------- |
| Framework        | NestJS 11                                |
| Language         | TypeScript 5.7                           |
| Database         | PostgreSQL 16                            |
| ORM              | TypeORM 0.3                              |
| Auth             | JWT (access + refresh), Passport, bcrypt |
| Validation       | class-validator, class-transformer, Joi  |
| Logging          | nestjs-pino (structured JSON logs)       |
| Rate Limiting    | @nestjs/throttler                        |
| API Docs         | Swagger / OpenAPI                        |
| Security         | Helmet, CORS                             |
| Package Manager  | pnpm                                     |
| Containerization | Docker + Docker Compose                  |
| CI/CD            | GitHub Actions                           |

---

## Architecture

Monolith with modular layered architecture. Each module is self-contained:

```
src/
├── common/               # Shared utilities (pagination, response, decorators)
├── config/               # Typed config namespaces (app, db, jwt, throttler)
├── database/             # TypeORM module, migrations, seeds
├── modules/
│   ├── auth/             # JWT auth, refresh tokens, strategies, guards
│   ├── users/            # User CRUD, profile, account management
│   ├── vehicles/         # Vehicle registration, ownership, mileage
│   ├── service-requests/ # Core workflow — create, assign, status tracking
│   ├── maintenance-records/ # Service history, audit records
│   ├── inventory/        # Parts, stock tracking, usage
│   └── invoices/         # Labor + parts billing, payment status
├── shared/               # Constants, enums, interfaces
└── main.ts               # Bootstrap — Helmet, CORS, Pino, Swagger, pipes
```

→ See [docs/backend/ARCHITECTURE.md](docs/backend/ARCHITECTURE.md) for the full design breakdown.

---

## Modules & Status

| Module                 | Status     | Key Features                                           |
| ---------------------- | ---------- | ------------------------------------------------------ |
| 🔧 Foundation          | ✅ Partial | Config, env validation, rate limiting                  |
| 🔐 Auth                | 🔲 Planned | Register, login, JWT access + refresh, logout, RBAC    |
| 👤 Users               | 🔲 Planned | CRUD, profile, activate/deactivate, search, pagination |
| 🚗 Vehicles            | 🔲 Planned | Register, assign owner, mileage, service intervals     |
| 🛠 Service Requests    | 🔲 Planned | Core workflow, mechanic assignment, status transitions |
| 📋 Maintenance Records | 🔲 Planned | History, filtering, audit logs                         |
| 📦 Inventory           | 🔲 Planned | Parts, stock, low-stock alerts, usage tracking         |
| 🧾 Invoices            | 🔲 Planned | Labor + parts cost, invoice gen, payment status        |

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Docker + Docker Compose

### 1. Clone & Install

```bash
git clone https://github.com/harleymamalias/meka-ops.git
cd meka-ops
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env — fill in DB credentials and JWT secrets
```

### 3. Start PostgreSQL (Docker)

```bash
docker compose up -d postgres
```

### 4. Run Migrations

```bash
pnpm run migration:run
```

### 5. Start Dev Server

```bash
pnpm run start:dev
```

### 6. Access

| Service      | URL                              |
| ------------ | -------------------------------- |
| API          | http://localhost:4001/api        |
| Health Check | http://localhost:4001/api/health |
| Swagger UI   | http://localhost:4001/api/docs   |

→ Full setup guide: [docs/backend/SETUP.md](docs/backend/SETUP.md)

---

## Scripts

```bash
pnpm run start:dev         # Start with hot reload
pnpm run start:debug       # Start with debugger
pnpm run build             # Compile TypeScript
pnpm run start:prod        # Run compiled output

pnpm run lint              # ESLint check + fix
pnpm run format            # Format backend and frontend with Prettier
pnpm run format:check      # Verify formatting without changing files

pnpm run test              # Unit tests
pnpm run test:e2e          # E2E tests
pnpm run test:cov          # Coverage report

pnpm run migration:generate -- src/database/migrations/MigrationName
pnpm run migration:run     # Apply pending migrations
pnpm run migration:revert  # Revert last migration
```

---

## Development Phases

| Phase   | Name                                    | Status         |
| ------- | --------------------------------------- | -------------- |
| Phase 0 | Foundation — Docker, TypeORM, Bootstrap | 🔲 In Progress |
| Phase 1 | Authentication Module                   | 🔲 Planned     |
| Phase 2 | Users & RBAC                            | 🔲 Planned     |
| Phase 3 | Vehicles Module                         | 🔲 Planned     |
| Phase 4 | Service Requests (Core)                 | 🔲 Planned     |
| Phase 5 | Maintenance Records                     | 🔲 Planned     |
| Phase 6 | Inventory Module                        | 🔲 Planned     |
| Phase 7 | Invoices & Payments                     | 🔲 Planned     |
| Phase 8 | CI/CD & Deployment                      | 🔲 Planned     |

→ See [docs/backend/PHASES.md](docs/backend/PHASES.md) for objectives, deliverables, and done criteria per phase.

---

## Documentation

| Document                                                                    | Description                                                          |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [backend/ARCHITECTURE.md](docs/backend/ARCHITECTURE.md)                     | System design, module structure, request lifecycle, design decisions |
| [backend/PHASES.md](docs/backend/PHASES.md)                                 | Phased development plan with objectives and done criteria            |
| [backend/SETUP.md](docs/backend/SETUP.md)                                   | Local dev setup, Docker, migrations, environment config              |
| [PROJECT_ROADMAP.md](docs/PROJECT_ROADMAP.md)                               | Shared implementation plan, milestones, and working agreement        |
| [frontend/FRONTEND_ARCHITECTURE.md](docs/frontend/FRONTEND_ARCHITECTURE.md) | Production frontend structure and engineering practices              |
| [frontend/DESIGN_SYSTEM_SPEC.md](docs/frontend/DESIGN_SYSTEM_SPEC.md)       | Visual tokens, components, screens, and interaction rules            |
| [backend/BEST_PRACTICES.md](docs/backend/BEST_PRACTICES.md)                 | Backend coding standards, naming conventions, and patterns           |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md)                                     | Branch strategy, conventional commits, PR checklist                  |
| [backend/REFERENCES.md](docs/backend/REFERENCES.md)                         | Backend framework, database, and infrastructure references           |
| [frontend/REFERENCES.md](docs/frontend/REFERENCES.md)                       | Frontend framework and official styling references                   |

---

## Repository

- **GitHub:** https://github.com/harleymamalias/meka-ops
- **Branch strategy:** `main` (stable) ← PRs from `feat/*`, `fix/*`, `chore/*`
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/)

---

## License

Private — personal learning and portfolio project.
