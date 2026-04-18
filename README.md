# flower-io

A toy library app — catalog of books on shelves, borrow/return flow — built as a pnpm monorepo with a typed backend, a public SPA and an admin panel.

## Stack

| Layer       | Tech                                                                 |
| ----------- | -------------------------------------------------------------------- |
| Backend     | [Encore.ts](https://encore.dev) (Node)                               |
| Public site | Vite + React 19 + TanStack Router / Query / Table + Tailwind v4 + shadcn |
| Admin       | Vite + React 18 + Refine + react-router-v6 + TanStack Table + shadcn |
| SEO         | Self-hosted Prerender + nginx at the edge                            |

## Structure

```
apps/
  api/         Encore.ts backend (books + shelves services, in-memory mock data)
  web/         Public SPA
  admin/       Internal admin panel
packages/
  shared/      Shared domain types (placeholder, to be replaced by generated client)
  api-client/  Auto-generated Encore TypeScript client (populated by `pnpm gen:client`)
  ui/          Shared shadcn components (placeholder)
deploy/
  prerender/   Self-hosted Prerender Docker image (headless Chrome)
  nginx/       Edge nginx routing bot UAs → prerender
  docker-compose.yml
```

## Prerequisites

- Node 20+
- pnpm 9+ (`corepack enable`)
- [Encore CLI](https://encore.dev/docs/install) — `curl -L https://encore.dev/install.sh | bash`
- Docker (only for the prerender/edge stack)

## Install

```bash
pnpm install
```

## Develop

```bash
pnpm dev:api      # Encore → http://localhost:4000
pnpm dev:web      # Vite SPA → http://localhost:5173 (proxies /api → :4000)
pnpm dev:admin    # Refine admin → http://localhost:5174
```

Regenerate the typed API client after API changes:

```bash
pnpm gen:client
```

Writes to `packages/api-client/src/client.ts`. Consumers can then import end-to-end types from `@flower-io/api-client`.

## API surface

| Method | Path                     | Description                        |
| ------ | ------------------------ | ---------------------------------- |
| GET    | `/books`                 | List all books                     |
| GET    | `/books/:id`             | Get a book                         |
| POST   | `/books/:id/borrow`      | Borrow a book — body `{user}`      |
| POST   | `/books/:id/return`      | Return a book                      |
| GET    | `/shelves`               | List all shelves                   |
| GET    | `/shelves/:id`           | Get a shelf                        |
| GET    | `/shelves/:id/books`     | Books on a shelf                   |

## Production edge (prerender + nginx)

See [`deploy/README.md`](./deploy/README.md). tl;dr:

```bash
pnpm --filter @flower-io/web build
cd deploy && docker compose up --build
# → http://localhost:8080
```

nginx routes bot User-Agents (Googlebot, Bingbot, ClaudeBot, GPTBot, social crawlers, …) through a headless-Chrome Prerender service and serves fully-rendered HTML. Human users get the SPA directly.
