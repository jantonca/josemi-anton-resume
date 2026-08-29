# josemi-anton-resume — AGENTS.md

## Purpose
Personal résumé and professional landing page. Static site, deployed to
Cloudflare Workers, with images served from a Cloudflare R2 CDN
(cdn.josemianton.com). Single-purpose, solo-maintained.

## Stack
Astro 7 (`output: 'static'`), Tailwind CSS v4 (via `@tailwindcss/vite`
with the legacy JavaScript theme config loaded explicitly), TypeScript
(`astro/tsconfigs/base` + `strict`, `strictNullChecks`). No UI framework —
`.astro` components only. Imports
from `src` use the `@/*` alias. Production build minifies with Terser
(`drop_console`/`drop_debugger` on).

## Package manager
pnpm (`pnpm@10.16.1`). `pnpm-lock.yaml` is committed and pins a `yaml`
override — do not run `npm`/`yarn` or regenerate the lockfile without
reason.

## Commands
- Dev: `pnpm dev`
- Build: `pnpm build` (runs `astro check` then `astro build`)
- Preview: `pnpm preview`
- Typecheck: `pnpm type-check` (`astro check && tsc --noEmit`)
- Lint: `pnpm lint` (`astro check` — there is no ESLint/Prettier)
- Clean: `pnpm clean`
- Deploy: `pnpm deploy` (`pnpm build && pnpm exec wrangler deploy` → Cloudflare Workers)
- Assets: `pnpm run assets:sync` / `pnpm run assets:status` /
  `pnpm run dev:images:pull`
- Test: `pnpm test` (`node --test` — asset processor + Worker helper units;
  no browser/E2E framework)

## Architecture constraints
- **R2 asset pipeline:** source images go in `public/images/`. Run
  `pnpm run assets:sync` to optimize (AVIF/WebP at 400/800/1200 px;
  WebP quality 90/85/80, AVIF 75/65/55) and upload originals + variants to
  R2. Reference images via the `R2Image` / `R2Picture` components — never
  hardcode `/images/...` paths in production markup.
  `public/assets-manifest.json` is gitignored and regenerated on sync; do not
  commit it. Keep R2 usage under ~8 GB.
- **Pipeline/Worker alignment:** `lib/assets/` mirrors the canonical
  `r2-assets-astro-template` layout (`core/`, `cli/`, `test/`), with local
  behavior kept in `assets.config.js`. `workers/r2-response.js` imports that
  same config so generated keys, format negotiation, and Save-Data downgrades
  stay aligned with component srcsets. When updating pipeline behavior,
  migrate from the canonical template instead of forking further.
- **Dev vs prod images:** `pnpm dev` serves originals from
  `public/images/`; production serves optimized assets from the R2 CDN.
- **Secrets:** R2/Cloudflare credentials (`CF_ACCOUNT_ID`,
  `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`) come from
  env only. Never commit `.env`; never hardcode keys.
- **Styling:** Tailwind v4 utilities via `@tailwindcss/vite`. No CSS-in-JS,
  no new styling system without justification.
- **Accessibility:** all `<img>` / `R2Image` need descriptive alt text
  (target WCAG AA).
- **Deployment:** static build to Cloudflare Workers via `wrangler`.
- **Auto-deploy:** GitHub is connected to Cloudflare Workers Builds — every
  push builds automatically, and merges to `master` deploy **production**.
  Treat pushes and merges as deployment-affecting actions. Local
  `pnpm deploy` still works but requires its own wrangler auth
  (`wrangler login` or `CLOUDFLARE_API_TOKEN`).
- **Cloudflare deploy:** this is a single-package repo deployed on
  Cloudflare Workers with pnpm 10.x. Do not add `pnpm-workspace.yaml`
  unless converting to a real workspace with a valid `packages:` field.
  Handle local pnpm build-approval issues per-machine with
  `pnpm approve-builds`, not with committed workspace config.

## Verification requirements
`pnpm build` must pass before declaring done (it runs `astro check` first,
so it covers typecheck + diagnostics). `pnpm test` covers the asset
pipeline and Worker helper units; there is no standalone linter beyond
`astro check`.

## Precedence
The global safety kernel loads automatically in every session — it needs no
reference here, and a bullet listing an absolute path does nothing because no
tool fetches it. Project rules above refine the kernel and cannot weaken its
secrets, approval or OS rules. They apply primarily to new and changed work,
not as a mandate to refactor pre-existing code in passing.
