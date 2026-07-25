# Contributing — meka-ops

> This project follows a structured workflow to keep the git history clean, changes traceable, and context easy to recover.

---

## Branch Strategy

```
main                  ← stable, deployed code only
  └── feat/*          ← new features (most branches)
  └── fix/*           ← bug fixes
  └── chore/*         ← tooling, deps, config, infra
  └── refactor/*      ← code improvements without behavior change
  └── test/*          ← adding or fixing tests
  └── docs/*          ← documentation only
```

### Branch Naming

```bash
feat/auth-module
feat/vehicles-crud
feat/service-request-status-machine
fix/plate-number-duplicate-check
fix/jwt-refresh-token-expiry
chore/docker-setup
chore/github-actions-ci
refactor/extract-pagination-utility
test/service-request-unit-tests
docs/architecture-update
```

### Rules

- Branch from `main`
- One feature/fix per branch
- Delete branch after merging
- Never commit directly to `main`

---

## Conventional Commits

Format:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type       | When to Use                                              |
| ---------- | -------------------------------------------------------- |
| `feat`     | New feature or capability                                |
| `fix`      | Bug fix                                                  |
| `chore`    | Build, tooling, deps, config — no production code change |
| `refactor` | Code restructure — no behavior change                    |
| `test`     | Adding or updating tests                                 |
| `docs`     | Documentation only                                       |
| `perf`     | Performance improvement                                  |
| `ci`       | CI/CD changes                                            |
| `style`    | Formatting only (prettier, whitespace)                   |

### Scope

The scope is the module or area being changed:

```
auth, users, vehicles, service-requests, maintenance-records, inventory, invoices,
common, config, database, docker, ci, deps, readme
```

### Examples

```bash
feat(auth): add JWT refresh token rotation
feat(vehicles): register vehicle with owner assignment
feat(service-requests): implement status state machine

fix(auth): resolve refresh token reuse vulnerability
fix(vehicles): prevent duplicate plate number registration
fix(inventory): stock quantity goes negative on concurrent requests

chore(docker): add postgres service to docker compose
chore(deps): upgrade typeorm to 0.3.28
chore(config): add JWT env validation to Joi schema

refactor(users): extract pagination helper to common utility
refactor(auth): separate refresh token strategy into own file

test(service-requests): add status transition unit tests
test(auth): add register and login e2e tests

docs(phases): add Phase 0 deliverables detail
docs(best-practices): add TypeORM transaction pattern
```

### Commit Body (When Needed)

Add a body when the why isn't obvious from the title:

```
fix(inventory): prevent negative stock on concurrent requests

Using a database-level row lock (SELECT FOR UPDATE) inside the
transaction to prevent race conditions when two service requests
try to consume the last unit simultaneously.

Closes #12
```

---

## Pre-Commit Checklist

Before every commit:

```bash
# 1. Lint your code
pnpm run lint

# 2. Format your code
pnpm run format

# Optional: verify formatting without changing files
pnpm run format:check

# 3. Run tests (at minimum the ones related to what you changed)
pnpm run test

# 4. Build — make sure it still compiles
pnpm run build
```

If any of these fail — fix it before committing.

---

## Pull Request (Self-Review) Checklist

Since this is a solo project, treat every branch merge as a PR review:

- [ ] Follows naming conventions (files, classes, methods, DTOs)
- [ ] No business logic in controllers
- [ ] No raw `any` types without justification
- [ ] All new entities have migrations (not just `synchronize: true`)
- [ ] DTOs have `@ApiProperty()` decorators
- [ ] New routes are role-protected or explicitly `@Public()`
- [ ] No sensitive data logged or returned in responses
- [ ] Tests cover the main happy path and at least one edge case
- [ ] No `console.log` left in production code
- [ ] No commented-out code committed

---

## Commit Frequency

Commit often. Small commits are better than large ones.

```bash
# Bad: one giant commit
chore: build entire auth module

# Good: progressive commits
feat(auth): add user registration endpoint
feat(auth): add login with JWT access token
feat(auth): add refresh token rotation
feat(auth): add logout endpoint
test(auth): add auth service unit tests
```

This makes git history a useful log of what happened and why.
