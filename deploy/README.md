# Deploy

Self-hosted prerender for SEO/bots, fronted by nginx that also proxies `/api/*` to the Encore backend.

## Architecture

```
 client
   │
   ▼
 nginx ──── api (Encore)
   │
   ├── matches bot User-Agent  ──► prerender (headless Chrome) ──► fetches SPA
   └── otherwise                ──► serves /apps/web/dist static files
```

Bots detected via nginx `map $http_user_agent` (Googlebot, Bingbot, ClaudeBot, GPTBot, Facebook, Twitter, LinkedIn, Slack, WhatsApp, …). Assets with extensions never go through prerender.

## One-time setup

Build the web SPA so nginx has something to serve:

```bash
pnpm --filter @flower-io/web build
```

## Run the edge stack

```bash
cd deploy
docker compose up --build
# → http://localhost:8080
```

Test as a bot:

```bash
curl -A "Googlebot/2.1" -i http://localhost:8080/shelves/s1
```

You should see fully-rendered HTML in the response body.

## Notes

- The `api` service in `docker-compose.yml` is a placeholder — when you containerise Encore (`encore build docker flower-io/api`) point it at that image. Locally you can run `pnpm dev:api` on the host and drop the `api` service from compose.
- Prerender caches responses in-memory for the process lifetime (`prerender-memory-cache`). For production you probably want S3/Redis caching — see [prerender/prerender](https://github.com/prerender/prerender) middleware list.
- Reverse-DNS the client IP for trusted bot auth if you expose this publicly — `User-Agent` alone is spoofable.
