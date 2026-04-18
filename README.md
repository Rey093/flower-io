# flower-io

Monorepo for a simple library-style app. Backend on [Encore.ts](https://encore.dev), frontends on Vite + React (planned).

## Structure

```
apps/
  api/         Encore.ts backend (books + shelves services)
  web/         Public SPA — Vite + React + TanStack + shadcn (planned)
  admin/       Admin panel — Refine + shadcn (planned)

packages/
  shared/      Shared domain types
  api-client/  Auto-generated Encore TypeScript client
  ui/          Shared shadcn components (planned)
```

## Prerequisites

- Node 20+
- pnpm 9+ (`corepack enable` picks up the version from `packageManager` in `package.json`)
- [Encore CLI](https://encore.dev/docs/install) for `dev:api` and `gen:client`

## Install

```bash
pnpm install
```

## Develop

```bash
pnpm dev:api       # encore run → http://localhost:4000
pnpm dev:web       # (after web is scaffolded)
pnpm dev:admin     # (after admin is scaffolded)
pnpm gen:client    # regenerate packages/api-client from API metadata
```

## Deployment notes

- Prerender for SEO/bots: self-hosted [Rendertron](https://github.com/GoogleChromeLabs/rendertron) fronted by nginx that routes bot User-Agents to the prerender service.
