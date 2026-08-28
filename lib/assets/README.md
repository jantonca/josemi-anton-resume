# R2 Asset Processor

Optimization and upload pipeline for this site's Cloudflare R2 image bucket.
Structured after the canonical `r2-assets-astro-template`; this repo's local
configuration (sizes, formats, quality, paths) lives in `assets.config.js`.

## Commands

```bash
pnpm run assets:sync        # Optimize public/images/* and upload to R2
pnpm run assets:status      # R2 storage usage + manifest summary
pnpm run dev:images         # Interactive helper for local dev images
pnpm run dev:images:pull    # Download all originals missing locally
pnpm run dev:images:check   # Report local vs R2 differences
pnpm test                   # Unit tests (node:test, no extra dependencies)
```

All commands read R2 credentials from `.env`
(`CF_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
`R2_BUCKET_NAME`) — see `.env.example` and `SECURITY.md`.

## How it works

1. Source files live in `public/images/` (git-ignored).
2. `assets:sync` uploads the **original** plus generated variants:
   - `.jpg` / `.jpeg` / `.png` → WebP + AVIF at 400 / 800 / 1200 px
   - `.gif` → WebP (original size)
   - `.svg` / `.pdf` → uploaded as-is
   - `.webp` / `.avif` sources are skipped (already optimized)
3. Objects are keyed `{name}-{width}.{format}` next to the original, e.g.
   `images/profile.jpg` → `images/profile-400.webp`, `…-400.avif`, `…-800.webp`, …
4. Uploads carry `Content-Type` and
   `Cache-Control: public, max-age=31536000, immutable`.
5. `public/assets-manifest.json` (git-ignored) records a content hash and
   output list per source, stamped with a manifest entry **version**
   (currently `2`). Entries with an older version are reprocessed, so
   pipeline fixes self-heal on the next sync. A failed upload aborts the
   file's manifest update, so partial work is retried next run.
6. Sources that produce the same R2 key (e.g. `a.png` and `a.jpg` in the same
   folder) fail fast with a collision error instead of silently overwriting.

## Quality

Configured per format in `assets.config.js`:

| Format | 400 px | 800 px | 1200 px | original |
| ------ | ------ | ------ | ------- | -------- |
| WebP   | 90     | 85     | 80      | 80       |
| AVIF   | 75     | 65     | 55      | 55       |

## Worker integration

`workers/r2-response.js` (imported by `worker.js`) derives format
negotiation, size fallbacks, and Save-Data downgrades from the same
`assets.config.js`, so the bucket contents and the Worker's expectations
cannot drift apart.

## File structure

```
lib/assets/
├── cli/
│   ├── sync.js          # Entry point for assets:sync
│   ├── status.js        # Entry point for assets:status
│   └── dev-images.js    # Local development image helper
├── core/
│   ├── processor.js     # AssetProcessor class
│   ├── rules.js         # Default rules + defaults config
│   └── utils.js         # Shared helpers (hash, content types, R2 client)
├── test/                # node:test suites (pnpm test)
├── README.md            # This file
└── SECURITY.md          # Credential handling guidelines
```

Further background: `docs/IMAGE_MANAGEMENT.md` (development workflows) and the
historical drafts in `docs/` (`ASSET_PIPELINE_*.md` are superseded notes kept
for reference).
