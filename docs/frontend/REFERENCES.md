# Frontend References — MekaOps

These are the authoritative references for the MekaOps dashboard. Prefer the
official documentation below over blog posts, copied snippets, or third-party
component libraries.

## Styling And Components

| Resource                          | URL                                                            |
| --------------------------------- | -------------------------------------------------------------- |
| Tailwind CSS documentation        | https://tailwindcss.com/docs                                   |
| Tailwind CSS Vite installation    | https://tailwindcss.com/docs/installation/using-vite           |
| Tailwind CSS theme variables      | https://tailwindcss.com/docs/theme                             |
| Tailwind CSS responsive design    | https://tailwindcss.com/docs/responsive-design                 |
| Tailwind CSS hover/focus states   | https://tailwindcss.com/docs/hover-focus-and-other-states      |
| Tailwind CSS adding custom styles | https://tailwindcss.com/docs/adding-custom-styles              |
| Tailwind CSS detecting classes    | https://tailwindcss.com/docs/detecting-classes-in-source-files |
| shadcn/ui documentation           | https://ui.shadcn.com/docs                                     |
| shadcn/ui installation            | https://ui.shadcn.com/docs/installation                        |
| shadcn/ui components              | https://ui.shadcn.com/docs/components                          |
| shadcn/ui theming                 | https://ui.shadcn.com/docs/theming                             |
| shadcn/ui MCP server              | https://ui.shadcn.com/docs/mcp                                 |
| shadcn/ui CLI                     | https://ui.shadcn.com/docs/cli                                 |

## Runtime And Data

| Resource        | URL                                 |
| --------------- | ----------------------------------- |
| React           | https://react.dev                   |
| React Router    | https://reactrouter.com             |
| Vite            | https://vite.dev                    |
| TanStack Query  | https://tanstack.com/query/latest   |
| React Hook Form | https://react-hook-form.com         |
| Zod             | https://zod.dev                     |
| Radix UI        | https://www.radix-ui.com/primitives |
| Lucide          | https://lucide.dev                  |

## Testing And Tooling

| Resource        | URL                                                          |
| --------------- | ------------------------------------------------------------ |
| Vitest          | https://vitest.dev                                           |
| Testing Library | https://testing-library.com/docs/react-testing-library/intro |
| Playwright      | https://playwright.dev/docs/intro                            |
| Storybook       | https://storybook.js.org/docs                                |

## Project Version Rules

- The project uses Tailwind CSS v4 through `@tailwindcss/vite`.
- Use CSS-first Tailwind configuration and theme variables; do not introduce a
  v3 `tailwind.config.js` workflow without an explicit migration decision.
- The project uses shadcn source components under `frontend/src/components/ui/`.
- Verify a component through shadcn documentation or the shadcn MCP before
  adding or replacing it.
