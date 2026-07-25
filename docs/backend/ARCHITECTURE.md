# Architecture — meka-ops

## Overview

**meka-ops** is a **modular monolith**. One deployable unit. No microservices. No distributed overhead. The internal structure is module-based — each domain is isolated and self-contained, but they all run in one process and share one database.

This is the correct architecture for this stage:

- Fast to build and iterate as a solo dev
- Easy to debug (one process, one log stream)
- Still maintainable because of strict module boundaries
- Can be split into microservices later if needed (but won't be needed)

---

## Folder Structure

```
meka-ops/
├── src/
│   ├── common/
│   │   ├── decorators/          # Custom decorators (e.g. @CurrentUser, @Roles)
│   │   ├── dto/                 # Shared DTOs (PaginationQueryDto, etc.)
│   │   ├── filters/             # Global exception filter
│   │   ├── guards/              # Shared guards (JwtAuthGuard, RolesGuard)
│   │   ├── interceptors/        # Response transform, logging interceptors
│   │   ├── middleware/          # Request ID, logging middleware
│   │   └── utils/               # Pagination helper, response builder
│   │
│   ├── config/
│   │   ├── app.config.ts        # App port, prefix, env
│   │   ├── database.config.ts   # DB host, port, credentials
│   │   ├── jwt.config.ts        # JWT secret, expiry config
│   │   ├── throttler.config.ts  # Rate limit TTL/limit
│   │   └── app-validation.schema.ts  # Joi schema — validates all env vars at boot
│   │
│   ├── database/
│   │   ├── database.module.ts   # TypeORM async module init
│   │   ├── migrations/          # TypeORM migration files (auto-generated)
│   │   └── seeds/               # Optional seed data scripts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── strategies/      # PassportJS JWT strategy
│   │   │   ├── guards/          # JwtAuthGuard, RefreshTokenGuard
│   │   │   ├── dto/
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── users/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── entities/        # User entity (TypeORM)
│   │   │   ├── dto/
│   │   │   ├── repositories/    # Custom TypeORM repository (if needed)
│   │   │   └── users.module.ts
│   │   │
│   │   ├── vehicles/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   └── vehicles.module.ts
│   │   │
│   │   ├── service-requests/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   └── service-requests.module.ts
│   │   │
│   │   ├── maintenance-records/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   └── maintenance-records.module.ts
│   │   │
│   │   ├── inventory/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── entities/
│   │   │   ├── dto/
│   │   │   └── inventory.module.ts
│   │   │
│   │   └── invoices/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── entities/
│   │       ├── dto/
│   │       └── invoices.module.ts
│   │
│   ├── shared/
│   │   ├── constants/           # App-wide constants
│   │   ├── enums/               # Role, Status enums shared across modules
│   │   └── interfaces/          # Shared TypeScript interfaces
│   │
│   ├── app.module.ts            # Root module — wires everything together
│   └── main.ts                  # Bootstrap — Helmet, CORS, Pino, Swagger, pipes
│
├── test/                        # E2E test files
├── docs/                        # Project documentation
├── docker-compose.yml           # Local dev: PostgreSQL
├── Dockerfile                   # Production multi-stage build
└── .github/workflows/           # GitHub Actions CI/CD
```

---

## Layered Architecture (Per Module)

Every module follows the same vertical slice pattern:

```
HTTP Request
     │
     ▼
┌─────────────────────────┐
│       Middleware         │  Request ID injection, logging
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│         Guards           │  JwtAuthGuard → RolesGuard
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│       Interceptors       │  Response transform, request timing
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│        Controller        │  Route handlers, DTO binding, Swagger decorators
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│         Service          │  Business logic, orchestration, validation rules
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│     TypeORM Repository   │  Database queries via TypeORM EntityManager/Repository
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│         Entity           │  Database table definition (TypeORM decorators)
└─────────────────────────┘
             │
     PostgreSQL (Docker)
```

**Rule:** Data only flows downward. Services never call controllers. Repositories never call services.

---

## Request Lifecycle

```
Client Request
  → Rate Limiter (ThrottlerGuard — global)
  → Middleware (request ID, pino-http logging)
  → Route matching
  → Guard chain (JwtAuthGuard → RolesGuard)
  → Interceptor (pre: timing start)
  → Pipe (ValidationPipe — DTO validation + transform)
  → Controller method
  → Service method(s)
  → TypeORM query
  → Service returns data
  → Interceptor (post: wrap in standard response)
  → JSON response
  → (on error) → Global Exception Filter → standardized error response
```

---

## Module Dependency Graph

```
AppModule
├── ConfigModule (global)
├── ThrottlerModule (global)
├── DatabaseModule
├── AuthModule
│   └── UsersModule (for user lookup during auth)
├── UsersModule
├── VehiclesModule
│   └── UsersModule (vehicle → owner relationship)
├── ServiceRequestsModule
│   ├── VehiclesModule
│   ├── UsersModule (mechanic assignment)
│   └── InventoryModule (parts usage)
├── MaintenanceRecordsModule
│   ├── VehiclesModule
│   └── ServiceRequestsModule
├── InventoryModule
└── InvoicesModule
    ├── ServiceRequestsModule
    └── InventoryModule
```

**Rule:** No circular module dependencies. If two modules need each other, extract the shared logic to `common/` or `shared/`.

---

## Database Schema Overview

```
users
  ├── id (uuid, PK)
  ├── email (unique)
  ├── password_hash
  ├── role (ADMIN | SERVICE_ADVISOR | MECHANIC | CUSTOMER)
  ├── is_active
  └── timestamps

refresh_tokens
  ├── id (uuid, PK)
  ├── user_id (FK → users)
  ├── token_hash
  ├── expires_at
  └── timestamps

vehicles
  ├── id (uuid, PK)
  ├── owner_id (FK → users)
  ├── plate_number (unique)
  ├── brand, model, year
  ├── engine_type, mileage
  └── timestamps

service_requests
  ├── id (uuid, PK)
  ├── vehicle_id (FK → vehicles)
  ├── advisor_id (FK → users)
  ├── mechanic_id (FK → users, nullable)
  ├── status (PENDING | INSPECTING | IN_PROGRESS | COMPLETED | CANCELLED)
  ├── description, remarks
  ├── estimated_completion
  └── timestamps

maintenance_records
  ├── id (uuid, PK)
  ├── service_request_id (FK → service_requests)
  ├── vehicle_id (FK → vehicles)
  ├── service_type, description
  ├── mileage_at_service
  └── timestamps

inventory_items
  ├── id (uuid, PK)
  ├── name, sku (unique)
  ├── quantity, unit
  ├── unit_price
  ├── low_stock_threshold
  └── timestamps

service_request_parts (junction)
  ├── id (uuid, PK)
  ├── service_request_id (FK)
  ├── inventory_item_id (FK)
  ├── quantity_used
  └── unit_price_at_use (snapshot — price may change)

invoices
  ├── id (uuid, PK)
  ├── service_request_id (FK, unique)
  ├── labor_cost, parts_cost, total_amount
  ├── status (UNPAID | PAID | VOIDED)
  ├── payment_proof_url
  └── timestamps
```

---

## Key Design Decisions

### 1. UUIDs as Primary Keys

**Why:** Avoids sequential ID enumeration attacks. Safe to expose in URLs. Works across distributed environments if ever needed.
**Tradeoff:** Slightly larger than integers. Index performance marginally worse at extreme scale — irrelevant for this domain.

### 2. TypeORM over Prisma

**Why:** Teaches deeper ORM fundamentals — entities as classes, decorators, repository pattern, migrations as code, transactions via EntityManager. Prisma would be faster for productivity but teaches less.
**Tradeoff:** More boilerplate. Worth it for learning depth.

### 3. Soft Deletes on Critical Entities

**Why:** Vehicles, service requests, and users should never be hard-deleted. Historical data integrity matters. An invoice referencing a deleted vehicle must still be queryable.
**Implementation:** `@DeleteDateColumn()` on entities where applicable.

### 4. Price Snapshot on `service_request_parts`

**Why:** Inventory item prices change over time. An invoice from 6 months ago should reflect what the part cost then, not now.
**Implementation:** `unit_price_at_use` column copied at the time of use.

### 5. Status Transitions via Service Layer

**Why:** Status changes (e.g., `PENDING → INSPECTING`) have business rules. They must be validated in the service, not just any status update allowed via PATCH.
**Implementation:** Explicit transition methods in `ServiceRequestsService`, not a generic `update()`.

### 6. Global Exception Filter

**Why:** Consistent error responses across the entire API. All errors — validation, auth, not found, database — return the same envelope shape.
**Implementation:** `HttpExceptionFilter` + `AllExceptionsFilter` registered globally in `main.ts`.

### 7. Standard Response Envelope

All API responses follow this shape:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Service request retrieved",
  "data": { ... },
  "timestamp": "2025-01-01T00:00:00.000Z",
  "requestId": "uuid"
}
```

Pagination responses add:

```json
{
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

## Security Architecture

```
Layer 1: Network       — Rate limiting (ThrottlerGuard, global)
Layer 2: Transport     — HTTPS in production (reverse proxy / nginx)
Layer 3: HTTP Headers  — Helmet (removes X-Powered-By, sets CSP, etc.)
Layer 4: CORS          — Whitelist allowed origins
Layer 5: Auth          — JWT access token (15m TTL) + refresh token (7d TTL)
Layer 6: Authorization — RolesGuard checks user role against @Roles() decorator
Layer 7: Input         — ValidationPipe strips unknown props, validates types
Layer 8: Passwords     — bcrypt with cost factor 12
Layer 9: Config        — Joi validates all env vars at startup — app won't start with bad config
```

---

## Environment Strategy

| Variable            | dev           | stage      | prod        |
| ------------------- | ------------- | ---------- | ----------- |
| Swagger UI          | ✅ Enabled    | ✅ Enabled | ❌ Disabled |
| TypeORM synchronize | ✅ (optional) | ❌         | ❌          |
| TypeORM logging     | ✅            | ❌         | ❌          |
| Pino pretty print   | ✅            | ❌ JSON    | ❌ JSON     |
| NODE_ENV            | `dev`         | `stage`    | `prod`      |

---

## What This Architecture Teaches

- Modular NestJS design (not just files in one folder)
- Layered separation of concerns
- RBAC with guards and decorators
- TypeORM relationships, migrations, transactions
- JWT access + refresh token rotation
- Global cross-cutting concerns (logging, exceptions, response format)
- Security in depth (multiple layers, not just auth)
- Environment-aware configuration
- Production-grade bootstrap patterns
