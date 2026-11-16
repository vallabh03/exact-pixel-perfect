# Deploying the PAANI lookbook to Vercel

TanStack Start app (Vite 8 + React 19, server-side rendered) scaffolded by Lovable, with
content in Supabase. Nitro is pinned to the `vercel` preset in `vite.config.ts`, so
`npm run build` emits a ready-made Vercel bundle in `.vercel/output/`.

## Settings at vercel.com/new (already in vercel.json)

- Framework preset: **Other**
- Build command: **`npm run build`**
- Output directory: leave default (Nitro writes `.vercel/output`)
- Install command: default (Vercel detects `bun.lock` and uses bun)
- Node: 20.19+ (Vercel's default is fine)

## Environment variables

The public Supabase settings live in the committed `.env` (publishable key only, safe to expose)
and are baked in at build time. Setting the same six keys in the Vercel project is optional but
recommended so they survive if `.env` is ever removed:
`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`,
`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PROJECT_ID`.

## Images

All lookbook photos are committed in `public/images/`. Database rows seeded in Lovable still
store `/__l5e/assets-v1/...` pointers; `assetUrl()` in `src/lib/paani-assets.ts` rewrites them to
`/images/<file>` at render time, so the site does not depend on Lovable's asset host.

## CLI

```bash
vercel          # preview
vercel --prod   # production
```
