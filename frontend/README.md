# MekaOps Frontend

React and TypeScript operations console for the MekaOps API.

## Development

```bash
pnpm install
cp .env.example .env
pnpm dev
```

The app runs at `http://localhost:5173` and expects the API at `http://localhost:4001/api`.

## Commands

```bash
pnpm dev              # Vite development server
pnpm typecheck        # TypeScript project checks
pnpm lint             # Oxlint checks
pnpm test             # Vitest component and unit tests
pnpm test:e2e         # Playwright browser tests
pnpm build            # Production frontend build
pnpm storybook        # Component workbench at :6006
pnpm build-storybook  # Static Storybook build
```

See the repository-level [frontend architecture](../docs/frontend/FRONTEND_ARCHITECTURE.md) and [design system specification](../docs/frontend/DESIGN_SYSTEM_SPEC.md) for ownership rules and visual tokens.
