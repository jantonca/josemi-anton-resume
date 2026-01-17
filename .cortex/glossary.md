# 📖 Project Glossary

This glossary defines project-specific terminology to ensure consistent understanding across all AI interactions.

---

## Resume & Landing Page Terms

### Resume / CV
- **Definition**: Curriculum Vitae or resume document showcasing professional experience, education, and skills
- **Context**: This project displays resume content on the web; may also host downloadable PDF version
- **Related**: Experience, Skills, Education, Portfolio

### Landing Page
- **Definition**: Single-page website designed to showcase professional profile and facilitate contact
- **Context**: Primary purpose of this project - serve as professional web presence
- **Components**: Hero section, About, Experience, Skills, Projects, Contact

### Professional Profile
- **Definition**: Summary of professional identity, expertise, and career achievements
- **Context**: Combines resume data, portfolio samples, and personal branding
- **Target Audience**: Recruiters, hiring managers, professional network

### Experience Section
- **Definition**: Chronological or reverse-chronological list of work history
- **Content**: Job titles, companies, dates, responsibilities, achievements
- **Format**: Typically displayed with timeline or card layout

### Skills Section
- **Definition**: List of technical and professional competencies
- **Categories**: Programming languages, frameworks, tools, soft skills
- **Display**: Tags, badges, or skill bars with proficiency levels

### Projects / Portfolio
- **Definition**: Showcase of completed work, side projects, or case studies
- **Content**: Project descriptions, screenshots, links, technologies used
- **Purpose**: Demonstrate practical skills and problem-solving abilities

### Contact Information
- **Definition**: Methods for reaching out (email, LinkedIn, GitHub, etc.)
- **Security**: Never expose personal email directly; use contact forms or professional aliases
- **Links**: GitHub, LinkedIn, portfolio, social media profiles

### Call to Action (CTA)
- **Definition**: Button or link encouraging visitor action (e.g., "Download Resume", "Contact Me")
- **Placement**: Strategic positioning in hero, footer, or contact sections
- **Design**: High contrast, clear messaging, accessible focus states

---

## R2 Asset Processor Terms

### Cloudflare R2
- **Definition**: Cloudflare's S3-compatible object storage service
- **Free Tier**: 10GB storage, unlimited egress
- **Use Case**: Store optimized images for CDN delivery
- **API**: AWS S3-compatible API

### CDN (Content Delivery Network)
- **Definition**: Distributed network of servers delivering content from geographically optimal locations
- **Provider**: Cloudflare edge network (200+ cities globally)
- **Subdomain**: `cdn.josemianton.com`
- **Benefits**: Low latency, high availability, reduced bandwidth costs

### Sharp
- **Definition**: High-performance Node.js image processing library
- **Use Case**: Resize, convert, and optimize images during asset sync
- **Supported Formats**: JPEG, PNG, WebP, AVIF, GIF, SVG, TIFF
- **Operations**: Resize, crop, rotate, format conversion, quality adjustment

### AVIF (AV1 Image File Format)
- **Definition**: Modern image format based on AV1 video codec
- **Compression**: ~40% smaller than WebP, ~50% smaller than JPEG at equivalent quality
- **Support**: Modern browsers (Chrome 85+, Firefox 93+, Safari 16+)
- **Use Case**: Primary format for production image delivery

### WebP
- **Definition**: Google's image format with lossy/lossless compression
- **Compression**: ~30% smaller than JPEG at equivalent quality
- **Support**: Near-universal browser support (97%+ as of 2024)
- **Use Case**: Fallback format when AVIF not supported

### Asset Manifest
- **Definition**: JSON file tracking processed assets and their metadata
- **Location**: `public/.asset-manifest.json` (gitignored)
- **Purpose**: Prevent re-uploading unchanged files via hash comparison
- **Content**: File paths, hashes, output variants, sizes, timestamps

### Hash-Based Deduplication
- **Definition**: Using file content hashes to detect changes and avoid redundant uploads
- **Algorithm**: SHA-256 hash of original file content
- **Benefit**: Only upload new or modified images
- **Implementation**: Compare hash in manifest vs. current file hash

### Responsive Image Sizes
- **Definition**: Multiple image sizes for different viewport widths
- **Sizes**: 400px (mobile), 800px (tablet), 1200px (desktop)
- **Strategy**: Serve smallest appropriate size for user's device
- **Implementation**: HTML `srcset` and `sizes` attributes

### Image Quality Tiers
- **Mobile (400px)**: Quality 90 - High quality for high-DPI screens
- **Tablet (800px)**: Quality 85 - Balanced quality for medium screens
- **Desktop (1200px)**: Quality 80 - Optimized for larger, lower-DPI displays
- **Rationale**: Adaptive quality reduces file size while maintaining visual fidelity

### Lazy Loading
- **Definition**: Defer loading of offscreen images until user scrolls near them
- **Implementation**: `loading="lazy"` attribute on `<img>` tags
- **Benefit**: Faster initial page load, reduced bandwidth usage
- **Browser Support**: Native support in all modern browsers

### Picture Element
- **Definition**: HTML element for art direction and format selection
- **Use Case**: Serve AVIF to supporting browsers, WebP as fallback, JPEG as final fallback
- **Implementation**: `<picture>` with `<source>` elements
- **Component**: `R2Picture.astro`

---

## Cloudflare Terms

### Cloudflare Workers
- **Definition**: Serverless JavaScript/TypeScript execution environment on Cloudflare edge
- **Use Case**: Host static site assets globally with custom routing
- **Deployment**: `npx wrangler deploy` via Wrangler CLI
- **Configuration**: `wrangler.toml` file

### Edge Network
- **Definition**: Cloudflare's global network of 200+ data centers
- **Benefit**: Content served from location nearest to user
- **Latency**: Typically <50ms globally for cached content
- **Caching**: Automatic caching of static assets

### Wrangler
- **Definition**: Official CLI tool for Cloudflare Workers development and deployment
- **Commands**: `wrangler dev`, `wrangler deploy`, `wrangler deployments list`
- **Configuration**: `wrangler.toml` in project root
- **Version**: CLI version varies; check with `npx wrangler --version`

### Custom Domain
- **Definition**: User-owned domain pointing to Cloudflare Workers or R2
- **Primary**: `josemianton.com` (main site)
- **CDN**: `cdn.josemianton.com` (R2 assets)
- **Configuration**: DNS CNAME records via Cloudflare dashboard

### Environment Variables
- **Definition**: Configuration values stored outside codebase
- **Location**: `.env` file (never committed to git)
- **Required**: `CF_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
- **Security**: Never hardcode; always use `process.env`

### R2 API Tokens
- **Definition**: Access credentials for R2 object storage API
- **Format**: AWS S3-compatible access key + secret key
- **Permissions**: Scoped to specific buckets and operations
- **Security**: Rotate regularly; use least privilege principle

---

## Web Development Terms

### Astro
- **Definition**: Modern web framework for building fast, content-focused websites
- **Version**: 5.13.7 (this project)
- **Paradigm**: Static Site Generation (SSG) with optional server-side rendering
- **File Extension**: `.astro` for Astro components

### Static Site Generation (SSG)
- **Definition**: Pre-rendering all pages at build time (no server runtime)
- **Output**: Static HTML, CSS, JS files
- **Benefits**: Fast, secure, cheap hosting, SEO-friendly
- **Deployment**: Serve from CDN or edge network

### TypeScript
- **Definition**: Typed superset of JavaScript
- **Mode**: Strict mode enabled (`tsconfig.json`)
- **Benefits**: Type safety, better IDE support, early error detection
- **Usage**: All project code written in TypeScript

### Tailwind CSS
- **Definition**: Utility-first CSS framework
- **Configuration**: `tailwind.config.mjs`
- **Custom Theme**: Dark theme with custom colors and animations
- **Benefits**: Rapid development, consistent design, small bundle size

### Vite
- **Definition**: Next-generation frontend build tool
- **Integration**: Bundled with Astro
- **Features**: Fast HMR, optimized builds, ES modules
- **Configuration**: Embedded in `astro.config.mjs`

### Hot Module Replacement (HMR)
- **Definition**: Update modules in browser without full page reload during development
- **Benefit**: Faster development feedback loop
- **Provider**: Vite (integrated with Astro dev server)

### Component
- **Definition**: Reusable UI building block
- **Format**: `.astro` or `.tsx` files
- **Examples**: `R2Image.astro`, `R2Picture.astro`, `Header.astro`
- **Props**: Typed interfaces for component inputs

### Responsive Design
- **Definition**: Design approach adapting layout to different screen sizes
- **Breakpoints**: Mobile (<640px), Tablet (640-1024px), Desktop (>1024px)
- **Implementation**: Tailwind responsive utilities (`sm:`, `md:`, `lg:`, `xl:`)
- **Testing**: Chrome DevTools device emulation

### Mobile-First
- **Definition**: Design strategy starting with mobile layout, progressively enhancing for larger screens
- **CSS**: Base styles for mobile, media queries for larger screens
- **Benefit**: Ensures core experience works on all devices
- **Implementation**: Tailwind's default approach

### Dark Theme
- **Definition**: Color scheme with dark backgrounds and light text
- **Implementation**: CSS custom properties with theme toggle
- **Persistence**: localStorage to remember user preference
- **Accessibility**: Sufficient contrast ratios for readability

### Accessibility (a11y)
- **Definition**: Practice of making websites usable by people with disabilities
- **Standards**: WCAG 2.1 AA compliance
- **Techniques**: Semantic HTML, ARIA attributes, keyboard navigation, alt text
- **Testing**: Lighthouse, screen readers (NVDA, JAWS, VoiceOver)

### SEO (Search Engine Optimization)
- **Definition**: Techniques to improve search engine rankings
- **Meta Tags**: Title, description, Open Graph, Twitter Cards
- **Semantic HTML**: Proper heading hierarchy, structured data
- **Performance**: Core Web Vitals (LCP, FID, CLS)
- **Sitemap**: `sitemap.xml` auto-generated by Astro

---

## Build & Deployment Terms

### Build Process
- **Command**: `pnpm build`
- **Output**: `dist/` directory with static files
- **Steps**: TypeScript compilation, Astro build, asset optimization, minification
- **Duration**: ~5-10 seconds (varies by content size)

### Minification
- **Definition**: Removing unnecessary characters from code to reduce file size
- **CSS**: cssnano (removes whitespace, comments, optimizes rules)
- **JavaScript**: Terser (compresses, mangles, removes dead code)
- **HTML**: Astro built-in (removes comments, collapses whitespace)

### Terser
- **Definition**: JavaScript minifier and compressor
- **Configuration**: `astro.config.mjs` vite build options
- **Options**: `drop_console: true` (removes console.log in production)
- **Benefit**: Smaller bundle sizes, faster load times

### Code Splitting
- **Definition**: Dividing JavaScript into smaller chunks loaded on demand
- **Strategy**: Vendor chunks (dependencies) separate from app code
- **Configuration**: Manual chunk splitting in `astro.config.mjs`
- **Benefit**: Faster initial load, better caching

### Tree Shaking
- **Definition**: Removing unused code from final bundle
- **Scope**: ES modules only (not CommonJS)
- **Implementation**: Automatic in Vite/Rollup
- **Benefit**: Smaller bundle sizes

### Production Build
- **Definition**: Optimized build for deployment to production
- **Differences**: Minified code, no source maps, environment=production
- **Testing**: `pnpm preview` to test locally before deployment
- **Command**: `pnpm build`

### Development Server
- **Command**: `pnpm dev`
- **Port**: Default 4321 (configurable)
- **Features**: HMR, source maps, no minification, verbose errors
- **Assets**: Served from `public/` directory (not R2 CDN)

---

## Project-Specific Terms

### josemi-anton-resume
- **Type**: Personal landing page and online resume
- **Purpose**: Professional web presence for career opportunities
- **Domain**: josemianton.com
- **Repository**: josemi-anton-resume

### Asset Pipeline
- **Definition**: Automated workflow for image optimization and CDN upload
- **Implementation**: `lib/assets/` directory with processor scripts
- **Commands**: `assets:sync`, `assets:status`, `images:add`
- **Documentation**: `lib/assets/README.md`, `docs/ASSET_PIPELINE_*.md`

### Processor.js
- **Location**: `lib/assets/processor.js`
- **Purpose**: Core asset optimization logic
- **Functions**: Resize, format conversion, R2 upload, manifest updates
- **Dependencies**: Sharp, AWS SDK for S3

### Dev Images
- **Definition**: Development workflow for pulling images from R2
- **Script**: `lib/assets/dev-images.js`
- **Command**: `pnpm run dev:images:pull`
- **Use Case**: Developers without original source images can pull from R2

### Sync Script
- **Location**: `lib/assets/sync.js`
- **Purpose**: Entry point for asset synchronization
- **Command**: `pnpm run assets:sync`
- **Process**: Scans `public/images/`, optimizes changed files, uploads to R2

---

## Acronyms & Abbreviations

- **R2**: Cloudflare R2 Object Storage (not "Route 2" or "version 2")
- **CDN**: Content Delivery Network
- **SSG**: Static Site Generation
- **HMR**: Hot Module Replacement
- **AVIF**: AV1 Image File Format
- **WebP**: Web Picture format
- **CTA**: Call to Action
- **a11y**: Accessibility (numeronym: "a" + 11 letters + "y")
- **SEO**: Search Engine Optimization
- **LCP**: Largest Contentful Paint (Core Web Vital)
- **FID**: First Input Delay (Core Web Vital)
- **CLS**: Cumulative Layout Shift (Core Web Vital)
- **WCAG**: Web Content Accessibility Guidelines
- **ARIA**: Accessible Rich Internet Applications

---

**Purpose**: This glossary prevents ambiguity in AI interactions by defining project-specific terms.
**Usage**: Reference this glossary when encountering unfamiliar terms or when clarification is needed.
**Maintenance**: Update glossary when introducing new concepts, tools, or workflows.

**Version**: Cortex TMS 2.6.0-beta.1
**Last Updated**: 2026-01-17
