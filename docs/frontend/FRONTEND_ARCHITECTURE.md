# MekaOps Frontend Architecture

This document defines the production-oriented structure and engineering rules for the MekaOps frontend. It complements [DESIGN_SYSTEM_SPEC.md](./DESIGN_SYSTEM_SPEC.md) and [PROJECT_ROADMAP.md](../PROJECT_ROADMAP.md).

## Architectural Decisions

The frontend will be a separate `frontend/` application with its own package manifest and build pipeline. The backend at the repository root remains an independently runnable NestJS API.

| Concern         | Decision                                                                      |
| --------------- | ----------------------------------------------------------------------------- |
| UI runtime      | React + TypeScript                                                            |
| Build tool      | Vite                                                                          |
| Routing         | React Router data router with nested layouts and route-level error boundaries |
| Styling         | Tailwind CSS theme variables                                                  |
| Components      | shadcn/ui source components, customized locally                               |
| Icons           | Lucide                                                                        |
| Server state    | TanStack Query                                                                |
| Forms           | React Hook Form + Zod schemas                                                 |
| API types       | Generated from the backend OpenAPI document where practical                   |
| Client state    | React state first; context only for true cross-tree UI state                  |
| Browser tests   | Playwright                                                                    |
| Component tests | Vitest + Testing Library                                                      |

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
├── public/                          # Static assets
├── e2e/                             # Playwright journeys
├── src/
│   ├── api/                         # Shared HTTP client and domain endpoints
│   │   ├── ApiError.ts
│   │   ├── auth.api.ts
│   │   ├── http.api.ts
│   │   └── response.ts
│   ├── components/
│   │   ├── common/                  # Reusable application-owned UI
│   │   ├── layouts/                 # AuthLayout, ErrorLayout, MainLayout
│   │   ├── router/                  # AppRouter, route manifest, loading boundary
│   │   └── ui/                      # shadcn primitives; no domain logic
│   ├── config/                      # Validated environment and navigation
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── schemas/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── service-requests/
│   │   │   ├── components/
│   │   │   ├── data.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── dashboard/
│   │   └── landing/
│   ├── pages/                       # Route-level feature composition
│   ├── services/                    # Session and non-HTTP infrastructure
│   ├── lib/
│   │   └── utils.ts                # cn() and small framework utilities
│   ├── styles/
│   │   └── globals.css             # Tailwind imports and semantic tokens
│   ├── test/                        # Shared test setup and utilities
│   ├── App.tsx                     # Global composition
│   ├── AppProviders.tsx            # Runtime providers
│   ├── main.tsx                    # DOM mounting only
│   └── queryClient.ts              # TanStack Query defaults
└── README.md
```

## Ownership Rules

### Application composition

`main.tsx`, `App.tsx`, `AppProviders.tsx`, and `components/router/` form the application composition boundary. They own mounting, providers, routing, lazy boundaries, and route errors. They do not own vehicle, invoice, or service-request business logic.

### `components/ui/`

Contains shadcn/ui components and their local styling changes. These components must remain reusable and domain-neutral. A `Button` can know about variants, but it must not know what a service request is.

### `components/`

Contains reusable cross-feature presentation patterns such as a paginated table, status badge shell, confirmation dialog, or page header. If a component only makes sense for one domain, it belongs in that feature instead.

### `features/`

Each feature owns its query keys, hooks, schemas, types, fixture data, and workflow components. Route-level composition belongs in `pages/`; endpoint functions belong in `api/`. A feature may consume shared UI components, but shared components must not import from a feature.

Recommended feature shape:

```text
features/service-requests/
├── components/
│   ├── ServiceRequestTable/
│   │   └── ServiceRequestTable.tsx
│   ├── StatusBadge/
│   │   └── StatusBadge.tsx
│   └── StatusTransitionDialog/
│       └── StatusTransitionDialog.tsx
├── hooks/
│   ├── useServiceRequests.ts
│   └── useServiceRequestMutations.ts
├── schemas/
├── types.ts
└── index.ts
```

### `api/`, `config/`, `services/`, and `lib/`

These folders contain non-visual infrastructure. `api/` owns the singleton HTTP client, response contracts, errors, and domain endpoint modules. `config/` owns validated environment and application metadata. `services/` owns non-visual state such as the in-memory session. `lib/` is reserved for small framework-independent utilities.

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
- Use `MainLayout` for operational screens and enforce authentication at the route boundary when protected API workflows are enabled.
- Apply role checks at the route and action level. Hiding a button is not authorization.
- Lazy-load feature routes so the initial login and shell bundle stays small.
- Give the root and feature routes explicit loading and error boundaries.
- Keep search, filters, sort, and pagination in URL search parameters so views are reloadable and shareable.
- Do not pass large domain objects through navigation state. Load the canonical record by route ID.

## State Management

Use the smallest state scope that matches the problem:

| State                                              | Owner                                              |
| -------------------------------------------------- | -------------------------------------------------- |
| API records, lists, pagination, mutations          | TanStack Query cache                               |
| Search, filters, sort, selected tab                | URL search parameters                              |
| Form fields and validation errors                  | React Hook Form within the feature route/component |
| Dialog open state, menu state, temporary selection | Local React state                                  |
| Authenticated session                              | Auth provider/session hook                         |
| Cross-application theme preference                 | Theme provider                                     |

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

Domain API modules under `src/api/` should expose typed functions such as `getServiceRequests()` and `updateServiceRequestStatus()`. Components should call feature hooks, not `fetch` directly.

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

- Use PascalCase filenames and dedicated folders for application-owned React components: `ServiceRequestTable/ServiceRequestTable.tsx`.
- Keep shadcn-managed primitives under `components/ui/` in the lowercase file convention generated by shadcn.
- Use PascalCase for React components and camelCase for functions and variables.
- Use `*.schema.ts`, `*.types.ts`, and `*.test.tsx` consistently.
- Prefer path aliases such as `@/features/...` over long relative import chains.
- Import across features only through the feature's public `index.ts` when a shared use case is intentional.
- Avoid barrel files that export an entire application surface; keep public exports narrow.

## Implementation Baseline

This section records the concrete frontend foundation that implements the
architecture above. It keeps application composition, transport, server state,
feature ownership, and naming consistent as the dashboard grows.

### Composition Flow

```text
main.tsx
  -> App.tsx
    -> AppProviders.tsx
      -> AppRouter.tsx
        -> routes.tsx
          -> AuthLayout / MainLayout / public pages
            -> feature-owned components
```

Each layer has one responsibility:

- `main.tsx` mounts React and imports global CSS.
- `App.tsx` composes the application providers and router.
- `AppProviders.tsx` owns global runtime providers only.
- `components/router/` owns route construction, loading boundaries, and route errors.
- `components/layouts/` owns persistent page chrome and nested route outlets.
- `pages/` composes a route from feature and shared components.
- `features/` owns domain presentation, schemas, types, data, and hooks.
- `api/` owns transport and endpoint functions, never UI.

### Transport And Server State

`api/http.api.ts` is the shared HTTP client. It owns the base URL, JSON headers,
response-envelope unwrapping, request cancellation, access-token headers, and
normalized `ApiError` failures. Domain API modules use this client; components
must never call `fetch` directly.

`queryClient.ts` exports the single TanStack Query client. Server records belong
in the query cache, URL filters belong in route search parameters, and temporary
view state stays local to the owning component.

### Naming And Ownership

- MekaOps-owned React components use PascalCase files and dedicated folders.
- Route-level components end in `Page`.
- Hooks use `useName.ts`.
- API modules use `{domain}.api.ts`.
- Services use `{name}.service.ts`.
- Schemas and non-component modules remain domain-suffixed, such as
  `login.schema.ts`, `types.ts`, and `data.ts`.
- Files under `components/ui/` retain shadcn's lowercase generated convention.
- Shared components and infrastructure must never import from pages.
- New shared abstractions require a real cross-feature consumer.

### Scope Guard

The frontend foundation does not add speculative product workflows, unused
abstractions, backend changes, or visual redesigns. Existing landing,
authentication, dashboard, and service-request behavior must remain intact while
the architecture is extended.

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
