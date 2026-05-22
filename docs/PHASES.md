# Development Phases — meka-ops

> **Philosophy:** Each phase is a shippable, functional increment. Don't move to the next phase until the current one is working, tested, and committed.

---

## Phase 0 — Foundation & Infrastructure

**Goal:** The app boots, connects to a real database, and is production-bootstrapped.
**Estimated Time:** 1–2 days

### Objectives
- Wire TypeORM to PostgreSQL
- Set up Docker Compose for local development (postgres)
- Complete `main.ts` bootstrap — Helmet, CORS, Pino, Swagger, global pipes/filters
- Set up migration CLI scripts
- Create `common/` scaffolding — response interceptor, exception filter

### Deliverables

| File | Purpose |
|---|---|
| `docker-compose.yml` | Local postgres service |
| `src/database/database.module.ts` | TypeORM async module |
| `src/common/filters/http-exception.filter.ts` | Global exception filter |
| `src/common/interceptors/response.interceptor.ts` | Standard response envelope |
| `src/common/interceptors/logging.interceptor.ts` | Request timing logs |
| `src/common/middleware/request-id.middleware.ts` | UUID per request |
| `src/common/dto/pagination-query.dto.ts` | Reusable pagination DTO |
| `src/common/utils/pagination.util.ts` | Pagination helper |
| `src/main.ts` | Complete bootstrap |
| `package.json` | Migration scripts added |

### What You Learn
- TypeORM async initialization with ConfigService
- NestJS middleware, interceptors, filters — their order and purpose
- Global pipes — `ValidationPipe` config (whitelist, transform, forbidNonWhitelisted)
- Structured logging with pino-http + request IDs
- Swagger setup conditional on environment

### Done Criteria
- [ ] `docker compose up -d postgres` — postgres running
- [ ] `pnpm run start:dev` — app boots, TypeORM connects, no errors
- [ ] `GET /api` returns standard response envelope
- [ ] `GET /api/docs` shows Swagger UI (dev/stage only)
- [ ] Invalid request body returns structured validation error
- [ ] All env vars validated at startup (Joi)
- [ ] Every request has an `X-Request-Id` header in response

---

## Phase 1 — Authentication Module

**Goal:** Secure JWT-based auth with access + refresh tokens, RBAC roles, and all guards in place.
**Estimated Time:** 3–5 days

### Objectives
- Implement register and login flows
- JWT access token (15m) + refresh token (7d)
- Password hashing with bcrypt (cost factor 12)
- Token refresh endpoint
- Logout (invalidate refresh token)
- PassportJS JWT strategy
- `JwtAuthGuard`, `RolesGuard`
- `@CurrentUser()`, `@Roles()`, `@Public()` decorators

### Deliverables

| File | Purpose |
|---|---|
| `src/modules/auth/auth.module.ts` | Auth module |
| `src/modules/auth/auth.controller.ts` | POST /auth/register, /login, /refresh, /logout |
| `src/modules/auth/auth.service.ts` | Core auth logic |
| `src/modules/auth/strategies/jwt.strategy.ts` | JWT access token strategy |
| `src/modules/auth/strategies/jwt-refresh.strategy.ts` | Refresh token strategy |
| `src/modules/auth/guards/jwt-auth.guard.ts` | Protects routes |
| `src/modules/auth/guards/refresh-token.guard.ts` | Refresh endpoint guard |
| `src/common/guards/roles.guard.ts` | RBAC enforcement |
| `src/common/decorators/current-user.decorator.ts` | Extract user from request |
| `src/common/decorators/roles.decorator.ts` | @Roles(Role.ADMIN) |
| `src/common/decorators/public.decorator.ts` | @Public() bypass auth |
| `src/shared/enums/role.enum.ts` | ADMIN, SERVICE_ADVISOR, MECHANIC, CUSTOMER |
| `src/modules/users/entities/user.entity.ts` | User + RefreshToken entities |
| `src/database/migrations/` | CreateUsersTable, CreateRefreshTokensTable |

### API Endpoints

```
POST /api/auth/register       → create account
POST /api/auth/login          → returns access + refresh token
POST /api/auth/refresh        → rotate refresh token
POST /api/auth/logout         → invalidate refresh token
GET  /api/auth/me             → current user profile (protected)
```

### What You Learn
- PassportJS strategy pattern in NestJS
- JWT payload design (sub, email, role — keep minimal)
- Refresh token rotation — why, how (hashed in DB)
- Global auth guard with `@Public()` opt-out
- RBAC: guard reads `@Roles()` metadata, compares to JWT role
- bcrypt cost factor — security vs performance tradeoff
- Never store raw tokens — hash refresh tokens in DB

### Done Criteria
- [ ] Register → Login → get access + refresh token
- [ ] Access token expires at 15m
- [ ] Refresh token rotates on use
- [ ] Protected route returns 401 without valid token
- [ ] ADMIN-only route returns 403 for MECHANIC role
- [ ] Logout invalidates refresh token — reuse returns 401
- [ ] Passwords never returned in any response
- [ ] Unit tests: auth.service.spec.ts (register, login, refresh)

---

## Phase 2 — Users Module & RBAC

**Goal:** Full user management with role-based access, pagination, and account lifecycle.
**Estimated Time:** 2–3 days

### Objectives
- CRUD for users (ADMIN only for most operations)
- Profile update (self)
- Activate / deactivate accounts
- Search by name/email
- Reusable pagination

### Deliverables

| File | Purpose |
|---|---|
| `src/modules/users/users.module.ts` | Users module |
| `src/modules/users/users.controller.ts` | REST routes |
| `src/modules/users/users.service.ts` | Business logic |
| `src/modules/users/entities/user.entity.ts` | User entity |
| `src/modules/users/dto/create-user.dto.ts` | Admin create user DTO |
| `src/modules/users/dto/update-user.dto.ts` | Partial update DTO |
| `src/modules/users/dto/user-query.dto.ts` | Search + pagination DTO |

### API Endpoints

```
GET    /api/users             → list users (paginated, search) [ADMIN]
GET    /api/users/:id         → get user by ID [ADMIN, self]
PATCH  /api/users/:id         → update user [ADMIN, self]
DELETE /api/users/:id         → deactivate account [ADMIN]
PATCH  /api/users/:id/activate   → activate account [ADMIN]
PATCH  /api/users/:id/deactivate → deactivate account [ADMIN]
```

### What You Learn
- Reusable pagination pattern — `PaginationQueryDto` + `paginate()` utility
- `PartialType` from `@nestjs/mapped-types` — DRY DTOs
- Filtering on TypeORM with `FindOptionsWhere`
- RBAC at route level — who can do what
- Never expose `password_hash` in responses — serialization with `@Exclude()`
- Soft delete pattern (deactivate, don't delete)

### Done Criteria
- [ ] Admin can list, search, create, deactivate users
- [ ] User can update their own profile (not role, not password via this endpoint)
- [ ] `password_hash` never appears in any API response
- [ ] Pagination returns correct `meta` (total, page, totalPages)
- [ ] Searching by name and email works
- [ ] Inactive users cannot log in

---

## Phase 3 — Vehicles Module

**Goal:** Register and manage customer vehicles with owner assignment and mileage tracking.
**Estimated Time:** 2–3 days

### Objectives
- Vehicle registration by service advisor or customer
- Assign owner (customer user)
- Vehicle details — plate, brand, model, year, mileage, engine type
- List vehicles per customer
- Search by plate number

### API Endpoints

```
POST   /api/vehicles              → register vehicle [ADMIN, SERVICE_ADVISOR, CUSTOMER]
GET    /api/vehicles              → list vehicles (paginated) [ADMIN, SERVICE_ADVISOR]
GET    /api/vehicles/:id          → get vehicle [ADMIN, SERVICE_ADVISOR, owner]
PATCH  /api/vehicles/:id          → update vehicle details [ADMIN, SERVICE_ADVISOR]
GET    /api/vehicles/:id/history  → maintenance history for vehicle [ADMIN, SERVICE_ADVISOR, owner]
GET    /api/customers/:id/vehicles → list vehicles for a customer [ADMIN, SERVICE_ADVISOR, owner]
```

### What You Learn
- OneToMany / ManyToOne TypeORM relationships
- Ownership checks in service layer (not just role checks)
- Plate number uniqueness — database constraint + application-level check
- Relations in query — when to use `relations: ['owner']` vs joins
- DTO field validation — plate format, year range, mileage non-negative

### Done Criteria
- [ ] Vehicle registered and linked to owner
- [ ] Plate number unique — duplicate returns 409 Conflict
- [ ] Customer can only see their own vehicles
- [ ] Mechanic cannot register vehicles (403)
- [ ] Invalid plate format rejected at DTO level

---

## Phase 4 — Service Requests (Core Module)

**Goal:** The central workflow module — the core of the application.
**Estimated Time:** 4–7 days

### Objectives
- Create service request for a vehicle
- Assign mechanic
- Status machine — explicit transitions with validation
- Remarks and notes
- Estimated completion date
- Timeline/history of status changes
- Role-based visibility

### Status Machine

```
PENDING
  └─→ INSPECTING    (SERVICE_ADVISOR, ADMIN)
        └─→ IN_PROGRESS  (SERVICE_ADVISOR, ADMIN — after mechanic assigned)
              └─→ COMPLETED   (SERVICE_ADVISOR, ADMIN)
              └─→ CANCELLED   (SERVICE_ADVISOR, ADMIN)
  └─→ CANCELLED     (SERVICE_ADVISOR, ADMIN)
```

Invalid transitions are rejected with a 422 Unprocessable Entity.

### API Endpoints

```
POST   /api/service-requests                       → create [SERVICE_ADVISOR, ADMIN]
GET    /api/service-requests                       → list (filtered, paginated) [ADMIN, SA]
GET    /api/service-requests/:id                   → detail [ADMIN, SA, assigned mechanic, vehicle owner]
PATCH  /api/service-requests/:id/assign-mechanic   → assign mechanic [ADMIN, SA]
PATCH  /api/service-requests/:id/status            → transition status [ADMIN, SA]
PATCH  /api/service-requests/:id/remarks           → add/update remarks [ADMIN, SA, MECHANIC]
GET    /api/service-requests/:id/timeline          → status change history
DELETE /api/service-requests/:id                   → cancel [ADMIN only]
```

### What You Learn
- State machine patterns in service layer
- Business rule enforcement — not just CRUD
- Audit trail for status changes (ServiceRequestTimeline entity)
- Complex RBAC — role + ownership combined
- Filtering by status, mechanic, date range
- Transactions — multiple DB operations in one atomic unit

### Done Criteria
- [ ] Cannot skip status steps (PENDING → IN_PROGRESS rejects)
- [ ] Cannot assign mechanic unless they have MECHANIC role
- [ ] COMPLETED request cannot be modified
- [ ] Timeline records every status change with timestamp + user
- [ ] Filtering by status, mechanic, date range works
- [ ] Customer can see their vehicle's service request but not others
- [ ] Integration tests: full workflow PENDING → COMPLETED

---

## Phase 5 — Maintenance Records

**Goal:** Permanent, append-only history of all completed services per vehicle.
**Estimated Time:** 2–3 days

### Objectives
- Auto-create maintenance record when service request → COMPLETED
- Manual maintenance record entry (for historical data import)
- Filter by vehicle, service type, date range
- Mileage tracking per service

### API Endpoints

```
GET  /api/maintenance-records                  → list all [ADMIN, SA]
GET  /api/maintenance-records/:id              → detail
GET  /api/vehicles/:id/maintenance-records     → history for vehicle
POST /api/maintenance-records                  → manual entry [ADMIN, SA]
```

### What You Learn
- Event-driven patterns within a monolith (NestJS EventEmitter or direct service call)
- Append-only records — no updates, no deletes (audit integrity)
- TypeORM query building for date range filtering
- Historical data modeling — snapshots vs live references

### Done Criteria
- [ ] Maintenance record auto-created when service request completes
- [ ] Manual entry works for historical records
- [ ] Date range filtering works
- [ ] Records cannot be updated or deleted (405 Method Not Allowed)
- [ ] Vehicle maintenance history sorted by date desc

---

## Phase 6 — Inventory Module

**Goal:** Track parts and supplies used in service jobs.
**Estimated Time:** 2–3 days

### Objectives
- Parts CRUD (ADMIN only for create/update/delete)
- Stock quantity tracking
- Low-stock flag/alert
- Link parts usage to service requests
- Usage history per part

### API Endpoints

```
POST   /api/inventory              → add item [ADMIN]
GET    /api/inventory              → list items (with low-stock filter) [ADMIN, SA, MECHANIC]
GET    /api/inventory/:id          → item detail
PATCH  /api/inventory/:id          → update item [ADMIN]
DELETE /api/inventory/:id          → remove item [ADMIN]
POST   /api/inventory/:id/restock  → add stock [ADMIN]
POST   /api/service-requests/:id/parts → add parts to service request [SA, MECHANIC]
```

### What You Learn
- Transaction patterns — decrement stock + record usage atomically
- Low-stock threshold business rule
- Junction table with extra columns (quantity_used, price_at_use)
- Preventing negative stock (application + DB constraint)
- SKU uniqueness enforcement

### Done Criteria
- [ ] Stock decrements when part added to service request
- [ ] Cannot use more stock than available — 422 with clear message
- [ ] Low-stock items flagged in list response
- [ ] price_at_use snapshot stored at time of use (not live price)
- [ ] Restock increments quantity correctly
- [ ] Unit tests: inventory.service — stock decrement edge cases

---

## Phase 7 — Invoices & Payments

**Goal:** Generate invoices for completed service requests, track payment.
**Estimated Time:** 3–5 days

### Objectives
- Auto-generate invoice when service request → COMPLETED (or manually)
- Labor cost + parts cost → total
- Payment status tracking
- Payment proof upload (URL for now)
- Invoice cannot be created for incomplete service request

### API Endpoints

```
POST   /api/invoices               → generate invoice [ADMIN, SA]
GET    /api/invoices               → list invoices [ADMIN, SA]
GET    /api/invoices/:id           → invoice detail
PATCH  /api/invoices/:id/mark-paid → mark as paid with proof [ADMIN, SA]
PATCH  /api/invoices/:id/void      → void invoice [ADMIN]
GET    /api/service-requests/:id/invoice → get invoice for service request
```

### What You Learn
- Financial data integrity — transactions for invoice creation
- Decimal precision — never use JS floats for money (use string/decimal in DB)
- One invoice per service request (unique constraint)
- State transitions — UNPAID → PAID / VOIDED (no reverse)
- Parts cost auto-calculated from service_request_parts at time of invoicing

### Done Criteria
- [ ] Invoice created only for COMPLETED service request
- [ ] Total = labor_cost + sum(parts quantity * price_at_use)
- [ ] Duplicate invoice creation returns 409
- [ ] PAID invoice cannot be voided (business rule)
- [ ] VOIDED invoice cannot be marked PAID
- [ ] Monetary values stored as DECIMAL(10,2) — no float drift
- [ ] Unit tests: invoice calculation logic

---

## Phase 8 — CI/CD & Deployment

**Goal:** Automated pipeline + production deployment on a VPS.
**Estimated Time:** 3–5 days

### Objectives
- GitHub Actions: lint → test → build on PR
- GitHub Actions: build Docker image → push to registry → deploy on merge to main
- Dockerfile multi-stage build (builder + production stages)
- Docker Compose for production (postgres + api + nginx)
- Reverse proxy with nginx (HTTPS via Let's Encrypt — optional)
- Environment secrets via GitHub Secrets

### Deliverables

| File | Purpose |
|---|---|
| `.github/workflows/ci.yml` | PR pipeline: lint, test, build |
| `.github/workflows/cd.yml` | Deploy on merge to main |
| `Dockerfile` | Multi-stage production build |
| `docker-compose.prod.yml` | Production compose (api + postgres) |
| `nginx/nginx.conf` | Reverse proxy config |

### What You Learn
- Multi-stage Docker builds — why and how (smaller image, no dev deps)
- GitHub Actions secrets, environments
- SSH deployment via GitHub Actions
- Docker registry (GHCR or Docker Hub)
- Nginx reverse proxy fundamentals
- Zero-downtime consideration (even for monolith)

### Done Criteria
- [ ] PR triggers lint + test — fails on error
- [ ] Merge to main builds and pushes Docker image
- [ ] VPS deploys new image via GitHub Actions
- [ ] Swagger disabled in prod (`NODE_ENV=prod`)
- [ ] Env vars injected via Docker env_file (not baked into image)
- [ ] Health check endpoint returns 200 in production

---

## Phase Summary

| Phase | Est. Days | Key Learning |
|---|---|---|
| 0 — Foundation | 1–2 | Bootstrap, TypeORM, middleware stack |
| 1 — Auth | 3–5 | JWT, Passport, RBAC, token rotation |
| 2 — Users | 2–3 | CRUD patterns, pagination, serialization |
| 3 — Vehicles | 2–3 | Relations, ownership, validation |
| 4 — Service Requests | 4–7 | State machine, business rules, audit trail |
| 5 — Maintenance Records | 2–3 | Append-only, event patterns, filtering |
| 6 — Inventory | 2–3 | Transactions, stock control, junction tables |
| 7 — Invoices | 3–5 | Financial integrity, decimal precision |
| 8 — CI/CD | 3–5 | Docker, GitHub Actions, deployment |
| **Total** | **~4–6 weeks** | Full production backend stack |

> A healthy solo pace. Don't rush phases — understanding the WHY matters more than shipping fast.
