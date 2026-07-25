# Agentic Development Workflow

This repository supports parallel Codex work through two project-scoped agents:
`meka_backend` and `meka_frontend`. The coordinator remains responsible for
requirements, shared contracts, integration, and final verification.

## Recommended Task Shape

Use parallel agents only when the work can be split into independent slices:

```text
Coordinator
├── Backend agent: API, database, authorization, tests
└── Frontend agent: routes, features, UI, API adapters, tests
        ↓
Coordinator: contract review, integration, full validation
```

Do not ask both agents to edit the same file. In particular, avoid assigning
root `package.json`, shared documentation, API response contracts, or generated
files to both agents at the same time.

## First-Time Setup

The project configuration is in `.codex/config.toml`, and the specialist
profiles are in `.codex/agents/`. Codex loads these project-scoped files when
the repository is trusted.

In Codex Desktop:

1. Open the MekaOps repository.
2. Start a new task from the repository root.
3. Ask explicitly for two parallel agents.
4. Name the backend and frontend scope in the prompt.
5. Review both summaries before asking the coordinator to integrate them.

In Codex CLI, use the same repository and inspect active agent threads with
`/agent`. Multi-agent workflows are enabled by the project configuration.

## Worktrees And Branches

Write-heavy parallel work should use isolated worktrees. Establish a clean
checkpoint first, then create one branch per agent:

```bash
git worktree add ../meka-ops-backend -b codex/backend-task main
git worktree add ../meka-ops-frontend -b codex/frontend-task main
```

Each agent works only in its assigned worktree. The coordinator reviews and
integrates the branches after validation. Do not create worktrees from an
unclean working tree unless the current changes have intentionally been
checkpointed and are available to both branches.

For small changes with completely disjoint paths, the agents may share one
worktree, but they must not run repository-wide formatters or autofix commands.

## Prompt Template

```text
Act as coordinator for MekaOps. Delegate two independent agents in parallel.

Backend agent:
- Own src/ and test/ only.
- Implement [backend slice].
- Preserve and document the API contract.
- Run backend validation and return changed files, contract changes, and results.

Frontend agent:
- Own frontend/ only.
- Implement [frontend slice] against the existing API contract.
- Follow the frontend architecture and design system.
- Run frontend validation and return changed files, assumptions, and results.

Wait for both agents. Review their summaries, resolve contract mismatches, and
run the full integration validation. Do not commit or push.
```

## Contract-First Coordination

When a feature crosses the API boundary:

1. The coordinator defines the user-visible acceptance criteria.
2. The backend agent implements the endpoint, DTO, validation, authorization,
   response envelope, and tests.
3. The frontend agent consumes the documented contract through `frontend/src/api/`.
4. The coordinator runs backend and frontend checks together.

If the backend contract is not ready, the frontend agent may build isolated
presentational states or MSW fixtures, but it must clearly mark assumptions and
must not invent a production endpoint.

## Cost And Quality Controls

- Keep concurrency at two specialists; more agents add coordination overhead.
- Give each agent a bounded task and a required summary format.
- Prefer read-only exploration agents for discovery and review.
- Ask for structured output: changed files, contract changes, tests, blockers.
- Start with focused tests and finish with the complete validation suite.
- Keep write approvals enabled for migrations, dependency changes, deletes, and
  all cross-boundary edits.
