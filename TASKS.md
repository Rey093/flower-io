# TASKS

Things left to finish after the initial scaffolding. Organised by area, roughly in the order that makes sense to tackle them.

## Wire the generated API client

- [ ] Run `pnpm gen:client` against a running Encore app to populate `packages/api-client/src/client.ts`.
- [ ] Add the generated file to git (it's currently empty).
- [ ] Replace the local `Book`/`Shelf` types and fetch helpers:
  - `apps/web/src/lib/api.ts` → import from `@flower-io/api-client`.
  - `apps/admin/src/lib/types.ts` and `apps/admin/src/providers/dataProvider.ts` → likewise.
- [ ] Decide what stays in `packages/shared` (domain types that aren't endpoint payloads) vs what comes from the generated client. May end up deleting `packages/shared` entirely.

## Shared UI package

- [ ] Once ≥3 shadcn components are duplicated between `web` and `admin`, extract them to `packages/ui`.
- [ ] Figure out Tailwind v4 content resolution for the shared package (probably `@source` directive in each app's CSS).
- [ ] Move `cn` + utilities too.

## shadcn: fill out the component set

Currently only Button / Card / Badge / Table are written by hand. Everything else should come from the CLI:

```bash
cd apps/web
pnpm dlx shadcn@latest add dialog form input select textarea dropdown-menu skeleton
```

- [ ] Run CLI install for web and admin — verify it works with the existing `components.json`.
- [ ] Remove the hand-written components if the CLI output diverges, keep one source of truth.

## API — move past mocks

- [ ] Replace in-memory `Map`s in `apps/api/books/data.ts` and `apps/api/shelves/data.ts` with a real store. Encore has [built-in SQL databases](https://encore.dev/docs/ts/primitives/databases) — `new SQLDatabase("library", { migrations: "./migrations" })`.
- [ ] Seed script for dev data.
- [ ] Add write endpoints: create/update/delete for shelves and books (admin needs these to become useful).
- [ ] Validation: use [Encore's query/body schemas](https://encore.dev/docs/ts/primitives/defining-apis) with narrow types instead of `string` inputs.

## Auth

- [ ] Backend: Encore [auth handler](https://encore.dev/docs/ts/develop/auth), protect borrow/return + all admin mutations.
- [ ] Web: silently anonymous is fine for read, but borrow should ask for identity (at minimum a name, ideally OAuth).
- [ ] Admin: Refine [auth provider](https://refine.dev/docs/authentication/auth-provider/) wired to Encore auth. Gate all routes behind `Authenticated`.

## Admin — feature parity with a real panel

- [ ] Create/update/delete forms with `react-hook-form` + `zod` + shadcn `form` components.
- [ ] Server-side pagination / filtering once the API supports it (the data provider currently returns `total = array.length`).
- [ ] Bulk actions (e.g. move multiple books to another shelf).
- [ ] Empty / error states on every page (today they just render nothing).
- [ ] Toast notifications for mutations — `sonner` via `pnpm dlx shadcn@latest add sonner`.

## Web — public polish

- [ ] Route for individual book detail `/books/$bookId` with back-link to its shelf.
- [ ] Search / filter shelves and books (TanStack Query + URL search params).
- [ ] Loading skeletons (`shadcn add skeleton`).
- [ ] Error boundary + not-found route (TanStack Router supports both natively).
- [ ] Proper borrow flow — ask for user identity, don't hardcode `"guest"`.
- [ ] SEO meta per route (`react-helmet-async` or TanStack Router's built-in head management).

## Prerender / edge

- [ ] Replace `prerender-memory-cache` with S3 or Redis caching for horizontal scalability.
- [ ] Reverse-DNS verification for bot auth — User-Agent alone is trivially spoofable. See Prerender's security docs.
- [ ] Health-check endpoint on the prerender service (`/health`) + nginx `healthcheck` probes.
- [ ] CI job that renders a handful of key URLs through prerender and asserts the HTML contains expected content.
- [ ] Containerise the Encore API: `encore build docker flower-io/api` → swap the placeholder image in `deploy/docker-compose.yml`.

## Tooling

- [ ] CI (GitHub Actions): install → typecheck → build for every workspace.
- [ ] Biome or ESLint + Prettier config at the root. Biome is simpler in monorepos.
- [ ] Vitest: unit tests for `apps/api` endpoints and the `dataProvider`.
- [ ] Playwright: smoke test covering shelves list → shelf detail → borrow → return, on both web and admin.
- [ ] `turbo` or `nx` — only if `pnpm -r build` becomes painfully slow. Probably not needed at this size.

## Observability (when the app goes live)

- [ ] Structured logs from Encore (already supported, just wire a destination).
- [ ] Error tracking — Sentry on both frontends, Encore has a [built-in errors dashboard](https://encore.dev/docs/platform/observability).
- [ ] Basic product metrics — shelf views, borrows per day.

## Stretch ideas

- [ ] Realtime presence on a shelf page via Encore pub/sub + SSE — see "who's currently looking at this shelf".
- [ ] Reservations / waitlist when a book is already borrowed.
- [ ] Bulk import from OpenLibrary given an ISBN.
