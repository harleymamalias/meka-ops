# MekaOps Frontend Architecture

This document defines the production-oriented structure and engineering rules for the MekaOps frontend. It complements [DESIGN_SYSTEM_SPEC.md](./DESIGN_SYSTEM_SPEC.md) and [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md).

## Architectural Decisions

The frontend will be a separate `frontend/` application with its own package manifest and build pipeline. The backend at the repository root remains an independently runnable NestJS API.

| Concern | Decision |
|---|---|
| UI runtime | React + TypeScript |
| Build tool | Vite |
| Routing | React Router data router with nested layouts and route-level error boundaries |
| Styling | Tailwind CSS theme variables |
| Components | shadcn/ui source components, customized locally |
| Icons | Lucide |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod schemas |
| API types | Generated from the backend OpenAPI document where practical |
| Client state | React state first; context only for true cross-tree UI state |
| Browser tests | Playwright |
| Component tests | Vitest + Testing Library |

The application is an operational dashboard, so the architecture favors predictable data ownership, explicit workflows, accessible controls, and small feature boundaries over a large global abstraction layer.

## Target Folder Structure

```text
frontend/
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
├── components.json
├── index.html
├── public/
│   ├── favicon.svg
│   └── ...static assets
├── e2e/
│   ├── auth.spec.ts
│   └── service-requests.spec.ts
├── src/
│   ├── app/
│   │   ├── main.tsx                 # React root and DOM mounting
│   │   ├── router.tsx               # Route tree and lazy route boundaries
│   │   ├── providers.tsx            # Query, theme, and notification providers
│   │   ├── config/
│   │   │   └── navigation.ts        # Role-aware navigation metadata
│   │   ├── guards/
│   │   │   ├── protected-route.tsx
│   │   │   └── role-route.tsx
│   │   └── layouts/
│   │       ├── auth-layout.tsx
│   │       ├── app-layout.tsx
│   │       └── error-layout.tsx
│   ├── components/
│   │   ├── ui/                      # shadcn primitives; no domain logic
│   │   ├── layout/                  # Sidebar, header, breadcrumbs, mobile nav
│   │   ├── data-display/            # DataTable, pagination, empty state
│   │   └── feedback/                # Error state, skeleton, confirmation dialog
│   ├── features/
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── schemas/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── service-requests/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── schemas/
│   │   │   ├── routes/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── vehicles/
│   │   ├── maintenance-records/
│   │   ├── inventory/
│   │   ├── invoices/
│   │   └── users/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts             # Fetch wrapper and common headers
│   │   │   ├── errors.ts             # Normalized API error type
│   │   │   ├── response.ts           # MekaOps response envelope helpers
│   │   │   └── generated.ts          # Generated OpenAPI types/client output
│   │   ├── auth/
│   │   │   ├── token-store.ts
│   │   │   └── session.ts
│   │   ├── env.ts                    # Validated VITE_* configuration
│   │   ├── query-client.ts            # TanStack Query defaults
│   │   └── utils.ts                  # cn() and small framework utilities
│   ├── styles/
│   │   └── globals.css               # Tailwind imports and semantic tokens
│   ├── types/
│   │   └── common.ts                 # Truly cross-feature types only
│   └── test/
│       ├── setup.ts
│       ├── mocks/
│       └── utils.tsx
└── README.md
```

## Ownership Rules

### `app/`

Owns application composition only: providers, routing, layouts, route guards, and global navigation. It does not own vehicle, invoice, or service-request business logic.

### `components/ui/`

Contains shadcn/ui components and their local styling changes. These components must remain reusable and domain-neutral. A `Button` can know about variants, but it must not know what a service request is.

### `components/`

Contains reusable cross-feature presentation patterns such as a paginated table, status badge shell, confirmation dialog, or page header. If a component only makes sense for one domain, it belongs in that feature instead.

### `features/`

Each feature owns its API functions, query keys, mutations, schemas, types, workflow components, and route-level screens. A feature may consume shared UI components, but shared components must not import from a feature.

Recommended feature shape:

```text
features/service-requests/
├── api/
│   ├── get-service-requests.ts
│   ├── get-service-request.ts
│   ├── create-service-request.ts
│   └── update-service-status.ts
├── components/
│   ├── service-request-table.tsx
│   ├── service-request-status-badge.tsx
│   └── status-transition-dialog.tsx
├── hooks/
│   ├── use-service-requests.ts
│   └── use-service-request-mutations.ts
├── routes/
│   ├── service-requests-page.tsx
│   └── service-request-detail-page.tsx
├── schemas/
├── types.ts
└── index.ts
```

### `lib/`

Contains infrastructure that is not a product feature: HTTP behavior, authentication mechanics, environment parsing, query configuration, and utility functions. It must not contain feature-specific endpoint functions.

## Routing Rules

The route tree should reflect the user’s workflow and URL state:

```text
/login
/
├── service-requests
│   └── :serviceRequestId
├── vehicles
│   └── :vehicleId
├── maintenance-records
├── inventory
├── invoices
└── users
```

- Use a public `AuthLayout` for login and account recovery screens.
- Use a protected `AppLayout` for operational screens.
- Apply role checks at the route and action level. Hiding a button is not authorization.
- Lazy-load feature routes so the initial login and shell bundle stays small.
- Give the root and feature routes explicit loading and error boundaries.
- Keep search, filters, sort, and pagination in URL search parameters so views are reloadable and shareable.
- Do not pass large domain objects through navigation state. Load the canonical record by route ID.

## State Management

Use the smallest state scope that matches the problem:

| State | Owner |
|---|---|
| API records, lists, pagination, mutations | TanStack Query cache |
| Search, filters, sort, selected tab | URL search parameters |
| Form fields and validation errors | React Hook Form within the feature route/component |
| Dialog open state, menu state, temporary selection | Local React state |
| Authenticated session | Auth provider/session hook |
| Cross-application theme preference | Theme provider |

Rules:

- Do not copy server data into a second global store.
- Give every query a stable feature-owned query key.
- Invalidate or update related queries after mutations.
- Cancel or ignore stale requests when a filter or route changes.
- Use optimistic updates only when rollback behavior is explicit and the workflow is low risk.
- Keep derived values derived; do not store values that can be calculated from query data.

## API Integration

The backend wraps successful responses in the following shape:

```ts
type ApiResponse<T> = {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  requestId?: string;
};
```

The API client must centralize:

- Base URL and environment configuration
- JSON serialization and content headers
- Request cancellation through `AbortSignal`
- Response-envelope unwrapping
- Normalized errors with status code and request ID
- One controlled access-token refresh attempt after a 401
- Consistent logging that never includes passwords or tokens

Feature API modules should expose typed functions such as `getServiceRequests()` and `updateServiceRequestStatus()`. Components should call feature hooks, not `fetch` directly.

Generate or update API types from Swagger when the backend contract changes. A frontend type should not silently redefine an API DTO with a different field name or status value.

## Authentication And Security

The backend currently returns both access and refresh tokens in the JSON response. The production target should be:

- Keep the short-lived access token in memory where possible.
- Move the refresh token to a `Secure`, `HttpOnly`, `SameSite` cookie set by the backend.
- Never put refresh tokens in `localStorage`.
- Never place secrets in `VITE_*` variables; Vite exposes those values to the browser bundle.
- Clear session state and cached protected data on logout.
- Treat route guards as UX only; backend guards remain the security boundary.
- Display generic authentication errors and avoid leaking account existence.
- Do not log authorization headers, tokens, passwords, or full personally identifiable records.

Moving refresh tokens to cookies requires a coordinated backend change to the refresh and logout endpoints. Until then, the frontend implementation must explicitly document the temporary contract and its risk rather than silently treating browser storage as production-grade security.

## Forms And Workflows

- Define a Zod schema beside each non-trivial form.
- Use server responses as the final authority for conflicts and business rules.
- Preserve entered values when a submission fails.
- Disable only the submitted action while a mutation is pending.
- Show field-level validation where possible and a clear form-level error for server failures.
- Confirm destructive actions and irreversible workflow transitions.
- Do not allow UI controls to imply a status transition the API will reject.
- Keep status labels and allowed transitions in one feature-owned mapping.

## Design System Implementation

- Encode semantic CSS variables from `DESIGN_SYSTEM_SPEC.md` in `src/styles/globals.css`.
- Use semantic classes such as `bg-background`, `text-foreground`, and `border-border` rather than raw color values in feature screens.
- Keep raw primitive values in the token layer only.
- Add shadcn components through the official CLI, review the generated code, and commit before overwriting or updating components.
- Use `data-slot` and component variants for state styling rather than scattered one-off selectors.
- Use Lucide icons with accessible labels or tooltips where the icon is not self-evident.
- Verify contrast, keyboard focus, disabled state, and reduced-motion behavior for every interactive primitive.

## Testing Strategy

### Unit and component tests

Place focused tests near the behavior they protect:

- schemas: valid, invalid, and boundary values
- query hooks: success, empty, error, and invalidation behavior
- workflow components: allowed and disallowed actions
- shared components: keyboard, accessibility, and visual state behavior

Use MSW or equivalent request mocking for frontend API tests. Do not make unit tests depend on a live PostgreSQL database.

### Browser tests

Use Playwright for a small number of high-value journeys:

1. Login and session recovery
2. Service-request creation and status transition
3. Vehicle registration and detail view
4. Inventory restock and low-stock behavior
5. Invoice payment workflow

Each browser test should use isolated test data and clean up or reset its state. Avoid asserting implementation details such as CSS class names when a role, label, URL, or visible business result is available.

## Accessibility And UX Quality

- Every form control has a programmatic label.
- Keyboard users can reach and operate every workflow.
- Focus is moved deliberately when dialogs, drawers, and route changes open.
- Tables have meaningful headers and responsive behavior.
- Status is never conveyed by color alone.
- Loading states preserve layout dimensions to prevent disruptive shifts.
- Errors identify the failed action and the recovery path.
- Empty states explain what the user can do next through the available action itself.
- Touch targets remain usable on narrow screens.

## Performance And Reliability

- Split bundles at feature-route boundaries.
- Avoid rendering large tables without pagination or virtualization when data volume requires it.
- Use stable query keys and memoization only where measurement supports it.
- Provide skeletons for predictable layouts and suspense/error boundaries for route loading.
- Add request timeouts or cancellation for abandoned views.
- Keep frontend environment configuration explicit and validated at startup.
- Serve the production build with immutable asset caching and a correctly configured SPA fallback.

## Naming And Imports

- Use kebab-case filenames for components and hooks: `service-request-table.tsx`, `use-service-requests.ts`.
- Use PascalCase for React components and camelCase for functions and variables.
- Use `*.schema.ts`, `*.types.ts`, and `*.test.tsx` consistently.
- Prefer path aliases such as `@/features/...` over long relative import chains.
- Import across features only through the feature's public `index.ts` when a shared use case is intentional.
- Avoid barrel files that export an entire application surface; keep public exports narrow.

## Frontend Quality Gates

Before a frontend milestone is committed, all of these must pass from `frontend/`:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

The repository-level CI should run backend and frontend checks independently, then run a small integration job with the API and frontend together.

## Official References

- Vite guide: https://vite.dev/guide/
- React documentation: https://react.dev/learn
- React Router routing: https://reactrouter.com/start/data/routing
- TanStack Query React installation and guidance: https://tanstack.com/query/latest/docs/framework/react/installation
- Tailwind theme variables: https://tailwindcss.com/docs/theme
- shadcn/ui Tailwind v4 guidance: https://ui.shadcn.com/docs/tailwind-v4
- shadcn/ui components: https://ui.shadcn.com/docs/components
- React Hook Form: https://react-hook-form.com/get-started
- Zod: https://zod.dev/
- Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Playwright: https://playwright.dev/docs/intro

## Adoption Order

Implement the architecture in this order:

1. Scaffold `frontend/` and validate the Vite build.
2. Add Tailwind, shadcn, tokens, fonts, and shared primitives.
3. Add providers, router, layouts, and error boundaries.
4. Add API client, response-envelope handling, and query defaults.
5. Implement authentication using the documented backend contract.
6. Build service requests first as the reference feature.
7. Repeat the feature structure for vehicles, maintenance, inventory, invoices, and users.
8. Add browser coverage and production deployment checks.
