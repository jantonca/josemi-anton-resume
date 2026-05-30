# josemi-anton-resume — AGENTS.md

## Purpose
Personal résumé and professional landing page. Static site, deployed to
Cloudflare Workers, with images served from a Cloudflare R2 CDN
(cdn.josemianton.com). Single-purpose, solo-maintained.

## Stack
Astro 6 (`output: 'static'`), Tailwind CSS v3 (via `@astrojs/tailwind`,
`applyBaseStyles: false`), TypeScript (`astro/tsconfigs/base` + `strict`,
`strictNullChecks`). No UI framework — `.astro` components only. Imports
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
- Deploy: `pnpm deploy` (`pnpm build && npx wrangler deploy` → Cloudflare Workers)
- Assets: `pnpm run assets:sync` / `pnpm run assets:status` /
  `pnpm run images:add` / `pnpm run dev:images:pull`
- Test: none configured

## Architecture constraints
- **R2 asset pipeline:** source images go in `public/images/`. Run
  `pnpm run assets:sync` to optimize (AVIF/WebP at 400/800/1200 px;
  quality 90/85/80) and upload to R2. Reference images via the `R2Image` /
  `R2Picture` components — never hardcode `/images/...` paths in
  production markup. `public/.asset-manifest.json` is gitignored and
  regenerated on sync; do not commit it. Keep R2 usage under ~8 GB.
- **Dev vs prod images:** `pnpm dev` serves originals from
  `public/images/`; production serves optimized assets from the R2 CDN.
- **Secrets:** R2/Cloudflare credentials (`CF_ACCOUNT_ID`,
  `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`) come from
  env only. Never commit `.env`; never hardcode keys.
- **Styling:** Tailwind v3 utilities via `@astrojs/tailwind`. No CSS-in-JS,
  no new styling system without justification.
- **Accessibility:** all `<img>` / `R2Image` need descriptive alt text
  (target WCAG AA).
- **Deployment:** static build to Cloudflare Workers via `wrangler`.
- **Cloudflare deploy:** this is a single-package repo deployed on
  Cloudflare Workers with pnpm 10.x. Do not add `pnpm-workspace.yaml`
  unless converting to a real workspace with a valid `packages:` field.
  Handle local pnpm build-approval issues per-machine with
  `pnpm approve-builds`, not with committed workspace config.

## Verification requirements
`pnpm build` must pass before declaring done (it runs `astro check` first,
so it covers typecheck + diagnostics). There is no test suite and no
standalone linter beyond `astro check` — do not introduce one as part of
unrelated work.

Inherited frontend rules (below) apply primarily to new and changed work,
not as a mandate to refactor pre-existing code in passing.

## Inherited rules
Follow:
- `/home/jantonca/Projects/github/jantonca/personal-ai-assistant/templates/core-rules.md`
- `/home/jantonca/Projects/github/jantonca/personal-ai-assistant/domains/frontend.md`

Project-specific rules above override these.
