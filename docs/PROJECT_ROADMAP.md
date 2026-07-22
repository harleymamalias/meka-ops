# MekaOps Project Roadmap

This document is the shared working plan for meka-ops. It records what is complete, what we are doing next, and the criteria for moving between milestones.

## Current State

### Backend

The NestJS backend is implemented across authentication, users, vehicles, service requests, maintenance records, inventory, and invoices.

Verified on 2026-07-22:

- All six database migrations are applied.
- `pnpm run migration:run` reports no pending migrations.
- `pnpm run build` passes.
- Unit tests pass: 5 tests.
- E2E smoke tests pass: 2 tests.
- The application boots and connects to PostgreSQL when valid JWT secrets are supplied.
- `/api`, `/api/health`, and `/api/docs` return HTTP 200.

### Backend Follow-ups

These are known issues or quality improvements, not reasons to block frontend setup:

- The local `.env` contains JWT secrets shorter than the required 32 characters, so normal `pnpm start` currently fails validation.
- Docker Compose has no running container during the latest verification; PostgreSQL was reachable through the configured local connection.
- Test coverage is approximately 20% and needs broader business-rule coverage.
- Nest emits a legacy wildcard-route warning from the request-ID middleware registration.
- CORS should use an explicit frontend origin before production deployment.

## Source Of Truth

The design and implementation references are:

1. [DESIGN_SYSTEM_SPEC.md](./DESIGN_SYSTEM_SPEC.md) for visual tokens, components, screens, and interaction direction.
2. [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) for frontend structure, ownership, and engineering rules.
3. The backend controllers, DTOs, response envelope, and Swagger document for API contracts.
4. This roadmap for sequencing, decisions, and completion criteria.

When these documents disagree with the running code, record the discrepancy and resolve it deliberately. Do not silently maintain conflicting assumptions.

## Agreed Direction

We will build the frontend as a separate `frontend/` application so the existing NestJS backend remains stable and independently runnable.

Target frontend stack:

- React and TypeScript with Vite
- Tailwind CSS
- shadcn/ui
- Geist font
- Lucide icons
- API client connected to the NestJS backend

The frontend will use the design-system specification as its code-first design source. Figma remains optional because the current Figma Starter workspace cannot reliably support the complete variable and library workflow.

## Milestones

### Milestone 1 — Frontend Foundation — Implemented Locally

Goal: establish a runnable frontend with the design system encoded in code.

Status: implemented locally on 2026-07-22. The foundation is available under `frontend/` and is ready for visual refinement and API-backed feature work.

Deliverables:

- `frontend/` application scaffold
- Tailwind theme variables matching the design specification
- shadcn configuration and base utilities
- Geist typography and Lucide icon setup
- Light theme foundation with a planned dark-theme path
- Shared primitives: button, input, label, badge, card, table, dialog, select, toast, and skeleton
- Responsive application shell with sidebar and header
- Local development instructions and API base URL configuration

Completion criteria:

- Frontend starts with one documented command.
- The shell is usable on desktop and mobile widths.
- Components use semantic tokens rather than hardcoded screen-specific colors.
- Loading, empty, error, and disabled states are represented in the shared components.

Verification completed:

- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm test` passes with 2 component tests.
- `pnpm build` passes.
- `pnpm build-storybook` passes.
- `pnpm test:e2e` passes with 2 browser tests.

### Milestone 2 — Authentication And Access

Goal: connect the frontend to the existing auth API.

Deliverables:

- Login screen
- Access-token and refresh-token handling
- Protected routes
- Logout flow
- Role-aware navigation and route protection
- Authenticated user profile state

Completion criteria:

- A user can log in, refresh the session, navigate protected screens, and log out.
- Expired or invalid sessions return the user to login cleanly.
- Users cannot access controls outside their role.

### Milestone 3 — Core Operations Screens

Implement screens in this order:

1. Service-request dashboard and list
2. Service-request detail and status workflow
3. Vehicles list, registration, and detail
4. Maintenance history
5. Inventory and restocking
6. Invoices and payment status
7. User administration

Each screen must include its complete workflow, not only its default success state.

Completion criteria for each screen:

- Uses real API data.
- Supports the API's pagination and filtering behavior where applicable.
- Handles loading, empty, validation, authorization, conflict, and server-error states.
- Matches the tokens and component patterns in the design specification.
- Has focused browser or integration coverage for its highest-risk workflow.

### Milestone 4 — Product Hardening

Goal: make the system dependable for regular use and deployment.

Deliverables:

- Playwright browser tests for login and core service-request workflows
- Expanded backend tests for authentication, RBAC, ownership, status transitions, inventory, and invoice rules
- CI checks for install, lint, build, unit tests, E2E tests, and migrations
- Production environment configuration
- Explicit CORS configuration
- Docker production setup and deployment documentation
- Updated README and phase-status documentation

## Working Agreement

- We decide the next milestone before implementation begins.
- Implementation stays scoped to the selected milestone.
- Each meaningful milestone ends with verification and a local conventional commit.
- No push to GitHub or remote branch occurs unless explicitly requested.
- Existing user changes are preserved.
- When a requirement changes, update this roadmap and the design specification before changing several modules.

## Immediate Next Step

The next approved work item is **Milestone 1 — Frontend Foundation**.

Before frontend authentication is connected, replace the invalid local JWT secrets and confirm the backend boots with the normal `.env` configuration.
