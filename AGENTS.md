# MekaOps Agent Workflow

## Mission

Build MekaOps as a modular NestJS API and a separate React dashboard. Keep the
backend and frontend independently runnable, production-oriented, and aligned
with the documented architecture and design system.

## Source Of Truth

- Backend architecture: `docs/backend/ARCHITECTURE.md`
- Backend practices and references: `docs/backend/BEST_PRACTICES.md`, `docs/backend/REFERENCES.md`
- Frontend architecture: `docs/frontend/FRONTEND_ARCHITECTURE.md`
- Design system: `docs/frontend/DESIGN_SYSTEM_SPEC.md`
- Project plan: `docs/PROJECT_ROADMAP.md`
- Contribution rules: `docs/CONTRIBUTING.md`

Read the relevant document before changing an architectural boundary.

## Project Boundary

This guidance applies only to `/Users/harleymamalias/Projects/meka-ops` and its
children. Do not apply MekaOps architecture, design, naming, or workflow rules
to sibling repositories or unrelated workspaces. Do not infer requirements from
another repository's documentation. External repositories may be inspected as
references only when the user explicitly requests it, and must not be modified.

## Agent Ownership

| Agent       | Owns                                                                | Does not normally edit                            |
| ----------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| Backend     | `src/`, `test/`, backend package scripts, migrations, API contracts | `frontend/`                                       |
| Frontend    | `frontend/`, frontend-facing documentation                          | `src/`, backend migrations                        |
| Coordinator | Requirements, shared contracts, integration, final validation       | Domain implementation unless explicitly delegated |

The backend owns API behavior and OpenAPI contracts. The frontend consumes the
contract through typed API modules and must not silently redefine DTOs, enums,
or response envelopes.

## Parallel Work Rules

1. Parallelize only tasks with clear ownership boundaries.
2. If both agents need a shared contract, define that contract first and make
   the backend agent the owner of the API change.
3. Prefer one isolated worktree and branch per write agent. If work must happen
   in one worktree, agents must stay inside their ownership paths and must not
   run repository-wide formatters or broad autofix commands.
4. The coordinator integrates changes, resolves conflicts, and runs the full
   verification suite after both agents finish.
5. Never reset, discard, stage, commit, push, or rewrite history unless the
   user explicitly authorizes that operation in the current task.
6. Preserve existing user changes. Inspect `git status` before editing.

## Validation

Backend agent:

```bash
pnpm run format:check
pnpm run lint
pnpm run test
pnpm run build
```

Frontend agent:

```bash
pnpm run format:check
pnpm --dir frontend run typecheck
pnpm --dir frontend run lint
pnpm --dir frontend run test
pnpm --dir frontend run build
```

The coordinator should also run the relevant E2E suites and `git diff --check`.

## Change Discipline

- Keep changes scoped to the requested workflow.
- Follow existing naming and separation-of-concerns rules.
- Do not introduce a new state library, UI framework, or abstraction without a
  documented need.
- Use Tailwind semantic tokens and local shadcn source components for frontend
  UI; do not add feature-specific global CSS.
- Return a concise summary with changed files, validation results, contract
  changes, and any follow-up needed by the coordinator.
