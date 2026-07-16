# Design System Spec — meka-ops

## Purpose

This document defines the v1 design system for **meka-ops** so the later Figma build is deterministic and aligned with:

- the project domain
- Tailwind CSS theme-variable conventions
- shadcn semantic token conventions
- an operational SaaS UI, not a marketing site

The system is intended for:

- Figma design library construction
- later frontend implementation using Tailwind CSS + shadcn
- screen composition for vehicles, service requests, maintenance, inventory, and invoices

## Current Figma Status

- Target file created: `MekaOps Design System`
- File key: `sPkkMJZCANeQSxys2riLs1`
- Selected Figma plan: `Harley Mamalias's team`
- Current blocker: Starter-plan MCP limits and variable-mode constraints prevent a full-quality Figma execution pass

This spec is the source of truth until the Figma environment is upgraded or moved to a higher-tier workspace.

## Source References

These are the standards this spec follows:

- Tailwind theme variables: https://tailwindcss.com/docs/theme
- Tailwind colors: https://tailwindcss.com/docs/colors
- shadcn theming: https://ui.shadcn.com/docs/theming
- shadcn components.json: https://ui.shadcn.com/docs/components-json
- shadcn button: https://ui.shadcn.com/docs/components/base/button
- shadcn card: https://ui.shadcn.com/docs/components/base/card

## Product UI Direction

**meka-ops** is an operations backend for vehicle service shops. The right visual language is:

- dense, legible, and structured
- table-first and workflow-first
- quiet surfaces with strong status signaling
- minimal decorative treatment
- highly scannable for repeated daily use

The system should feel closer to:

- fleet maintenance software
- service operations dashboards
- inventory and billing admin tools

It should not feel like:

- a portfolio site
- a consumer mobile app
- a heavy-glass or highly expressive visual system

## Design Principles

1. Surface hierarchy must be obvious at a glance.
2. Status must read faster than supporting detail.
3. Dense data views must remain calm and readable.
4. Forms must prioritize completion speed and field clarity.
5. Navigation must support repeated operational workflows with low cognitive load.
6. Colors should communicate state first, branding second.

## Technical Foundation

### Tailwind + shadcn strategy

The implementation target is:

- Tailwind CSS using theme variables as design tokens
- shadcn semantic CSS variables
- `tailwind.cssVariables = true`
- Tailwind v4-compatible token mapping

### Token model

The design system should use the following Figma collections:

1. `Primitives`
2. `Color`
3. `Spacing`
4. `Radius`
5. `Typography Primitives`
6. `Typography`
7. `Effects`

### Variable modes

Desired final model:

- `Primitives`: single mode `Value`
- `Color`: `Light`, `Dark`
- `Spacing`: single mode `Value`
- `Radius`: single mode `Value`
- `Typography Primitives`: single mode `Value`
- `Typography`: single mode `Value`

Starter-plan fallback:

- build `Light` only first
- add `Dark` only after the file is moved to a plan that supports the full token workflow cleanly

## Font System

### Primary font

Use `Geist` as the primary UI font.

Reason:

- available in the inspected Figma environment
- compact and clean at small sizes
- appropriate for modern operational UI
- works well for tables, filters, badges, and sidebars

### Secondary / fallback font

Use `Inter` as implementation fallback where `Geist` is unavailable.

### Typography rules

- no oversized editorial headings
- tight scale optimized for app UI
- labels and data views should rely on medium and semibold, not heavy bold by default
- numeric-heavy views should favor tighter leading and stable widths

## Typography Scale

### Text styles

Use these as the initial text-style set:

| Style | Font | Size | Weight | Line Height | Usage |
|---|---|---:|---|---:|---|
| `display/lg` | Geist | 28 | SemiBold | 34 | rare top-level page hero inside app only |
| `display/md` | Geist | 24 | SemiBold | 30 | page title on overview screens |
| `heading/lg` | Geist | 20 | SemiBold | 26 | primary section titles |
| `heading/md` | Geist | 18 | SemiBold | 24 | cards, panels, detail headers |
| `heading/sm` | Geist | 16 | SemiBold | 22 | table sections, drawer titles |
| `body/lg` | Geist | 15 | Regular | 22 | longer descriptive text |
| `body/md` | Geist | 14 | Regular | 20 | default body text |
| `body/md-strong` | Geist | 14 | Medium | 20 | emphasized inline values |
| `body/sm` | Geist | 13 | Regular | 18 | dense metadata |
| `label/lg` | Geist | 14 | Medium | 18 | large controls |
| `label/md` | Geist | 13 | Medium | 18 | default control labels |
| `label/sm` | Geist | 12 | Medium | 16 | compact labels, filters |
| `caption/md` | Geist | 12 | Regular | 16 | helper text, secondary metadata |
| `caption/sm` | Geist | 11 | Regular | 14 | dense system text |

### Numeric emphasis

For KPI and financial values:

- `kpi/lg`: Geist 24 SemiBold / 28
- `kpi/md`: Geist 20 SemiBold / 24
- `amount/md`: Geist 18 SemiBold / 22

## Color System

### Color strategy

The system should use:

- neutral zinc/slate surfaces
- teal as the primary action color
- sky as informational support
- emerald for success
- amber for warning
- rose for destructive/error

This avoids a one-note purple or dark-blue UI while keeping the product professional.

### Primitive palette

#### Neutrals

| Token | Value |
|---|---|
| `zinc/50` | `#fafafa` |
| `zinc/100` | `#f4f4f5` |
| `zinc/200` | `#e4e4e7` |
| `zinc/300` | `#d4d4d8` |
| `zinc/400` | `#a1a1aa` |
| `zinc/500` | `#71717a` |
| `zinc/600` | `#52525b` |
| `zinc/700` | `#3f3f46` |
| `zinc/800` | `#27272a` |
| `zinc/900` | `#18181b` |
| `zinc/950` | `#09090b` |

#### Primary teal ramp

| Token | Value |
|---|---|
| `teal/50` | `#f0fdfa` |
| `teal/100` | `#ccfbf1` |
| `teal/200` | `#99f6e4` |
| `teal/300` | `#5eead4` |
| `teal/400` | `#2dd4bf` |
| `teal/500` | `#14b8a6` |
| `teal/600` | `#0d9488` |
| `teal/700` | `#0f766e` |
| `teal/800` | `#115e59` |
| `teal/900` | `#134e4a` |

#### Support ramps

| Token | Value |
|---|---|
| `sky/600` | `#0284c7` |
| `sky/700` | `#0369a1` |
| `emerald/600` | `#059669` |
| `emerald/700` | `#047857` |
| `amber/500` | `#f59e0b` |
| `amber/600` | `#d97706` |
| `rose/600` | `#e11d48` |
| `rose/700` | `#be123c` |
| `white/1000` | `#ffffff` |
| `black/1000` | `#000000` |

### Semantic tokens

These names should map directly to shadcn-compatible CSS variables.

#### Core light theme

| Token | Value |
|---|---|
| `background` | `zinc/50` |
| `foreground` | `zinc/900` |
| `card` | `white/1000` |
| `card-foreground` | `zinc/900` |
| `popover` | `white/1000` |
| `popover-foreground` | `zinc/900` |
| `primary` | `teal/700` |
| `primary-foreground` | `white/1000` |
| `secondary` | `zinc/100` |
| `secondary-foreground` | `zinc/900` |
| `muted` | `zinc/100` |
| `muted-foreground` | `zinc/600` |
| `accent` | `teal/50` |
| `accent-foreground` | `teal/900` |
| `destructive` | `rose/600` |
| `destructive-foreground` | `white/1000` |
| `border` | `zinc/200` |
| `input` | `zinc/300` |
| `ring` | `teal/500` |

#### Sidebar light theme

| Token | Value |
|---|---|
| `sidebar` | `zinc/900` |
| `sidebar-foreground` | `zinc/50` |
| `sidebar-primary` | `teal/500` |
| `sidebar-primary-foreground` | `white/1000` |
| `sidebar-accent` | `zinc/800` |
| `sidebar-accent-foreground` | `zinc/50` |
| `sidebar-border` | `zinc/800` |
| `sidebar-ring` | `teal/400` |

#### Status extension tokens

These are not shadcn defaults, but should be added as project tokens:

| Token | Value |
|---|---|
| `success` | `emerald/600` |
| `success-foreground` | `white/1000` |
| `success-muted` | `#ecfdf5` |
| `warning` | `amber/500` |
| `warning-foreground` | `zinc/950` |
| `warning-muted` | `#fffbeb` |
| `info` | `sky/600` |
| `info-foreground` | `white/1000` |
| `info-muted` | `#f0f9ff` |

#### Chart tokens

| Token | Value |
|---|---|
| `chart-1` | `teal/600` |
| `chart-2` | `sky/600` |
| `chart-3` | `amber/500` |
| `chart-4` | `emerald/600` |
| `chart-5` | `rose/600` |

### Dark theme target

When the Figma file is moved to a higher-tier plan, add dark-mode values with the same semantic names.

Target direction:

- `background`: zinc/950
- `foreground`: zinc/50
- `card`: zinc/900
- `border`: zinc/800
- `primary`: teal/500
- `accent`: zinc/800
- `muted`: zinc/900

## Spacing System

Use an 8-point base with compact intermediate steps:

| Token | Value |
|---|---:|
| `spacing/0` | 0 |
| `spacing/1` | 4 |
| `spacing/2` | 8 |
| `spacing/3` | 12 |
| `spacing/4` | 16 |
| `spacing/5` | 20 |
| `spacing/6` | 24 |
| `spacing/8` | 32 |
| `spacing/10` | 40 |
| `spacing/12` | 48 |
| `spacing/16` | 64 |

Usage guidance:

- filter bars and compact forms: `8`, `12`
- cards and section insets: `16`, `20`, `24`
- major page spacing: `24`, `32`

## Radius System

Use restrained radii appropriate for an operational UI:

| Token | Value |
|---|---:|
| `radius/sm` | 6 |
| `radius/md` | 8 |
| `radius/lg` | 8 |
| `radius/xl` | 12 |
| `radius/full` | 9999 |

Usage guidance:

- buttons, inputs, badges: `6` or `8`
- cards, dialogs, drawers: `8`
- pills and status chips: `full`

## Effects

Use minimal depth:

| Style | Value |
|---|---|
| `shadow/xs` | `0 1px 2px rgba(9, 9, 11, 0.06)` |
| `shadow/sm` | `0 2px 6px rgba(9, 9, 11, 0.08)` |
| `shadow/md` | `0 8px 20px rgba(9, 9, 11, 0.10)` |

Rules:

- cards use `shadow/xs` only when elevated from page background
- overlays use `shadow/md`
- table surfaces should often use border only, no shadow

## Icon System

### Library

Use **Lucide** as the implementation icon set.

Reason:

- directly aligned with the usual shadcn stack
- broad enough for domain and navigation needs
- visually appropriate for a technical operations UI

### Icon sizes

| Token | Size |
|---|---:|
| `icon/xs` | 14 |
| `icon/sm` | 16 |
| `icon/md` | 18 |
| `icon/lg` | 20 |
| `icon/xl` | 24 |

### Usage rules

- default control icons: `16`
- nav and button icons: `18`
- KPI or empty-state icons: `20` or `24`
- avoid decorative icons with no functional meaning

### Domain icon shortlist

- vehicles: `CarFront`, `Truck`, `Gauge`
- service requests: `Wrench`, `ClipboardList`, `ListChecks`
- maintenance records: `History`, `Clock3`
- inventory: `Boxes`, `Package`, `BadgeAlert`
- invoices: `Receipt`, `Wallet`, `Banknote`
- users/auth: `Users`, `UserCog`, `ShieldCheck`
- global: `Search`, `Filter`, `ChevronDown`, `Plus`, `MoreHorizontal`, `PanelLeft`, `Bell`

## Component Inventory

### Foundation components

1. `Button`
2. `Icon Button`
3. `Input`
4. `Textarea`
5. `Select`
6. `Checkbox`
7. `Radio Group`
8. `Switch`
9. `Label`
10. `Field` wrapper

### Surface and navigation components

1. `Card`
2. `Sidebar`
3. `Top Bar`
4. `Tabs`
5. `Dropdown Menu`
6. `Popover`
7. `Dialog`
8. `Sheet`
9. `Breadcrumb`
10. `Pagination`

### Data-display components

1. `Badge`
2. `Status Chip`
3. `KPI Tile`
4. `Table`
5. `Empty State`
6. `Stat Row`
7. `Activity Timeline Row`
8. `Key/Value List`

### Workflow-specific components

1. `Vehicle Summary Card`
2. `Service Request List Row`
3. `Service Status Pill`
4. `Mechanic Assignment Row`
5. `Inventory Item Row`
6. `Low Stock Alert`
7. `Invoice Summary Block`
8. `Parts Usage Line Item`
9. `Filter Bar`
10. `Date Range Filter`

## Component Priorities

### Batch 1

- Button
- Input
- Select
- Badge
- Card
- Sidebar
- Table
- Filter Bar

### Batch 2

- Tabs
- Dialog
- Sheet
- KPI Tile
- Status Chip
- Empty State
- Pagination

### Batch 3

- Vehicle Summary Card
- Service Request Row
- Inventory Item Row
- Invoice Summary Block
- Timeline Row

## Button Spec

Use shadcn-style variants as the baseline:

- `default`
- `secondary`
- `outline`
- `ghost`
- `destructive`
- `link`

Sizes:

- `sm`
- `md`
- `lg`
- `icon`

States:

- `default`
- `hover`
- `focus`
- `disabled`
- `loading`

## Input Spec

Include:

- label
- description/helper
- placeholder
- leading icon optional
- trailing action optional
- error state
- disabled state

Sizes:

- `md`
- `sm`

## Badge and Status Spec

Badge variants:

- `neutral`
- `primary`
- `secondary`
- `outline`

Status chip variants:

- `pending`
- `inspecting`
- `in-progress`
- `completed`
- `cancelled`
- `paid`
- `unpaid`
- `voided`
- `low-stock`

## Table Spec

The table system is critical for this project.

Include:

- table shell
- header row
- sortable column header
- compact row
- default row
- selected row
- hovered row
- empty state row
- action cell
- status cell

## Screen Inventory

The design-system file should include reusable screen templates for:

1. `Auth / Login`
2. `Dashboard / Overview`
3. `Vehicles / List`
4. `Vehicles / Detail`
5. `Service Requests / List`
6. `Service Requests / Detail`
7. `Maintenance Records / List`
8. `Inventory / List`
9. `Inventory / Restock Dialog`
10. `Invoices / List`
11. `Invoices / Detail`
12. `Users / List`

## Screen Layout Rules

### App shell

- left sidebar navigation
- top utility bar
- content area with `max-width` appropriate for desktop dashboards
- internal sections separated by spacing and borders, not decorative cards everywhere

### List screens

- page title row
- quick actions
- filter bar
- KPI strip where useful
- primary data table
- empty state handling

### Detail screens

- entity header
- key metadata section
- status section
- timeline or related-records area
- side summary where the workflow benefits from it

## Figma File Structure

Use this page structure:

1. `Cover`
2. `Getting Started`
3. `Foundations / Colors`
4. `Foundations / Typography`
5. `Foundations / Spacing + Radius + Shadows`
6. `Foundations / Icons`
7. `---`
8. `Components / Actions`
9. `Components / Forms`
10. `Components / Navigation`
11. `Components / Data Display`
12. `Components / Workflow Blocks`
13. `---`
14. `Screens / Auth`
15. `Screens / Dashboard`
16. `Screens / Vehicles`
17. `Screens / Service Requests`
18. `Screens / Maintenance`
19. `Screens / Inventory`
20. `Screens / Invoices`
21. `Screens / Users`
22. `---`
23. `Utilities`

## Naming Conventions

### Variables

- primitives: `zinc/100`, `teal/700`, `spacing/4`
- semantics: `color/background`, `color/primary`, `color/sidebar-accent`

### Text styles

- `display/lg`
- `heading/md`
- `body/md`
- `label/sm`

### Components

- `Button`
- `Input`
- `Card`
- `Table`
- `Status Chip`

### Pages

- use title case with slash groups exactly as listed above

## Build Order

When the Figma environment is ready, use this order:

1. create collections and token modes
2. create primitives
3. create semantic tokens
4. create text styles
5. create effect styles
6. create foundation documentation pages
7. build Batch 1 components
8. validate Batch 1 with screenshots and metadata
9. build Batch 2 components
10. build Batch 3 components
11. compose screen templates
12. add dark-mode token values

## Acceptance Criteria

The design system is acceptable when:

- token names map cleanly to Tailwind and shadcn implementation
- typography is readable in dense tables and filters
- status colors are distinct and accessible
- buttons, inputs, and tables cover the primary product workflows
- the app shell and screen templates reflect the real meka-ops domain
- no component relies on decorative styling that weakens operational clarity

## Follow-up Execution Notes

Once the Figma environment is moved to a higher-tier workspace:

1. continue using the existing file key `sPkkMJZCANeQSxys2riLs1` or recreate the file in the upgraded workspace
2. implement the collections and tokens defined here
3. build the component batches in order
4. add dark mode after light mode foundations are validated
