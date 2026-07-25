# MekaOps Documentation

Use the documentation area that matches the code being changed. Shared project
decisions stay at this level; backend and frontend implementation guidance is
kept separate so agents do not apply unrelated conventions.

## Backend

Located in `docs/backend/`:

- `ARCHITECTURE.md`: NestJS modular-monolith structure and request lifecycle
- `BEST_PRACTICES.md`: backend naming, DTO, entity, service, security, and test rules
- `PHASES.md`: backend development phases and completion criteria
- `REFERENCES.md`: NestJS, TypeORM, PostgreSQL, security, and Docker references
- `SETUP.md`: local environment, PostgreSQL, migrations, and runtime setup

## Frontend

Located in `docs/frontend/`:

- `FRONTEND_ARCHITECTURE.md`: React application structure, ownership, routing, state, and testing
- `DESIGN_SYSTEM_SPEC.md`: visual tokens, components, screens, and interaction rules
- `REFERENCES.md`: official React, Vite, Tailwind, shadcn, testing, and UI references

## Shared

- `PROJECT_ROADMAP.md`: cross-layer milestones and decisions
- `CONTRIBUTING.md`: branch, commit, pull-request, and validation conventions
- `AGENTIC_WORKFLOW.md`: coordinator, backend-agent, and frontend-agent workflow

When a document conflicts with running code, record the discrepancy and resolve
it deliberately. Do not use a document from the other layer as an implicit
implementation contract.
