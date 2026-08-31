# Changelog

## [2026-08-31] - SEO & Selected Work

### Added

- **Selected Work section**: homepage section (03) linking to two live
  vehicle configurators (Lexus Crafted NX, Toyota For You — HiLux) with
  descriptive external-link labels and exact deep-link parameters; the
  navigation includes it and the numbered sections now run 01–06
- **Documentation**: `docs/SEO_CHECKLIST.md` (manual indexing, Cloudflare,
  and profile-consistency steps) and `docs/CASE_STUDY_PLAN.md` (single
  "Automotive Configurator Systems" case-study plan plus the confirmation
  questionnaire that must be answered before drafting)

### Changed

- Structured data: the homepage emits opt-in ProfilePage JSON-LD whose
  Person uses a stable `@id` and includes only page-visible facts (name,
  role, description, Sydney location, employer, expertise, profile links);
  other pages emit no JSON-LD
- Social metadata: added OG image dimensions, alt text, and locale, plus
  explicit Twitter image metadata
- Sitemap: reduced to canonical URLs only — build-time `lastmod`,
  `changefreq`, and `priority` were removed as inaccurate freshness signals
- Skill group labels are centered so they read cleanly over the tag-slider
  fade overlay

## [2026-08-28] - Repository Maintenance

### Fixed

- Restored the desktop two-column layouts for About and Experience that
  broke in the Tailwind v4 migration (comma-separated arbitrary
  `grid-template-columns` values compiled to invalid CSS)
- Restored link and active-tab colors by migrating `text-[--link]` /
  `text-[--links]` to valid Tailwind v4 CSS-variable syntax
- Hero gradient background now applies its intended blur (the missing
  `#goo` SVG filter reference voided the whole `filter` property)
- Worker Save-Data handling now downgrades exactly one size step instead of
  skipping straight to the smallest variant (which could be larger)
- Worker rejects non-GET/HEAD methods (405), sends empty bodies for HEAD,
  sets `Content-Length`, and never serves R2 directory markers
- Dev-only R2Image/R2Picture fallback indicator no longer crashes
  (`Astro.props` was read inside a client script)

### Changed

- Migrated `lib/assets/` to the canonical `r2-assets-astro-template`
  layout (`core/`, `cli/`, `test/`) with local behavior in
  `assets.config.js`; the Worker imports the same config
- `assets:sync` now uploads original sources alongside generated variants,
  stamps manifest entries with a version marker (older entries are
  reprocessed), fails hard on upload/optimize errors, paginates R2
  listings, and rejects same-directory output-key collisions
- Removed broken `images:add` script (referenced deleted `src/scripts/`)
  and the unused `setup.js` distribution wizard
- Upgraded astro 7.2.9, wrangler 4.127.0, sharp 0.35.4,
  @aws-sdk/client-s3 3.1120.0, terser 5.51.2
- Removed the inert `postcss.config.js` (Astro config supplies cssnano
  inline) and the unused `Card.astro` starter component

### Improved

- Added unit tests for the asset processor and Worker response helpers
  (`pnpm test`, node:test, no new dependencies)
- Refreshed README, image-management docs, and pipeline documentation to
  match actual behavior

## [2026-08-22] - Repository Maintenance

### Fixed

- Corrected Cloudflare route scoping and static-assets binding
- Added a custom static 404 page so missing routes no longer fail with HTTP 500
- Preserved R2 HTTP metadata, including image content types and ETags

### Changed

- Upgraded to Astro 7 and Tailwind CSS 4
- Updated supported dependencies and removed unused packages
- Removed the public image-component test route
- Consolidated Tailwind configuration and standardized documentation on pnpm

### Improved

- Production build now completes without diagnostics
- Wrangler dry-run validates both the static assets and R2 bindings

## [2025-09-13] - Asset Pipeline & CDN Implementation

### Added

- **Cloudflare R2 Integration**: Complete image optimization and CDN delivery system
- **Mobile-First Image Optimization**:
  - Three responsive sizes: 400px (mobile), 800px (tablet), 1200px (desktop)
  - Adaptive quality: 90 for mobile, 85 for tablet, 80 for desktop
  - WebP and AVIF formats for optimal compression
- **CDN Subdomain**: Images now served from `cdn.josemianton.com`
- **Asset Management Scripts**:
  - `pnpm run assets:sync`: Optimize and upload images to R2
  - `pnpm run assets:status`: Check storage usage
  - `pnpm run images:add`: Interactive image addition
- **R2 Components**:
  - `R2Image.astro`: Optimized image component with automatic format selection
  - `R2Picture.astro`: Multi-format picture element with responsive srcset
- **Test Page**: `/test-images` for verifying image optimization in dev/prod

### Changed

- **Image URLs**: Production now uses CDN URLs (e.g., `https://cdn.josemianton.com/images/profile-800.webp`)
- **Development Mode**: Serves original images for faster development
- **Production Mode**: Serves optimized images from CDN
- **Naming Convention**: Updated to `{name}-{width}.{format}` pattern

### Improved

- **Performance**:
  - Reduced image sizes by ~70-80% with WebP/AVIF
  - Global CDN delivery via Cloudflare edge network
  - Lazy loading for all images
- **Security**:
  - Environment variables for all credentials
  - No hardcoded secrets in code
  - Manifest files excluded from git
- **Documentation**:
  - Comprehensive README with setup instructions
  - Asset pipeline documentation in `lib/assets/README.md`
  - Updated `.env.example` with all required variables

### Removed

- Old scripts in `src/scripts/` (replaced by `lib/assets/` system)
- Unused npm scripts from package.json
- Legacy image optimization code

### Technical Details

#### Image Processing Strategy

```
Mobile (400px): Quality 90 - Optimized for high-DPI phone screens
Tablet (800px): Quality 85 - Balanced for medium screens
Desktop (1200px): Quality 80 - Optimized for larger, lower-DPI displays
```

#### Storage Optimization

- Smart hash-based change detection prevents re-uploading unchanged files
- Manifest tracking in `public/assets-manifest.json`
- Optimized for Cloudflare R2's 10GB free tier

#### Deployment Configuration

- Custom domain routing via `wrangler.toml`
- CNAME setup: `cdn.josemianton.com` → Cloudflare Workers
- Environment-based URL switching in components

### Migration Notes

To use this system in other projects:

1. Copy the `lib/assets/` directory
2. Install dependencies: `sharp`, `@aws-sdk/client-s3`
3. Configure environment variables
4. Copy R2Image and R2Picture components
5. Run `pnpm run assets:sync` to optimize and upload images

### Security Considerations

- Always use `.env` for credentials (never commit)
- Regularly rotate R2 API keys
- Use minimal IAM permissions for R2 access
- Keep manifest files out of version control
