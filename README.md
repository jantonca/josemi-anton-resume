# Personal Website/Resume - Josemi Anton

## Overview

A personal website/resume built with Astro and TypeScript. The site features a clean, professional design with a dark theme and interactive elements.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v7
- **Styling**: Tailwind CSS v4 via its Vite plugin
- **Language**: TypeScript
- **Icons**: astro-icon with local SVGs (`src/icons/`)
- **Build Tools**: Vite (integrated with Astro)
- **Hosting**: Cloudflare Workers (static assets + Worker)
- **Image Pipeline**: Sharp preprocessing with Cloudflare R2 delivery

## Project Structure

```
josemi-anton-resume/
├── public/            # Static assets served as-built (fonts, favicon, robots)
│   └── fonts/         # Custom fonts (Proto Grotesk, Akzidenz Grotesk)
├── src/               # Astro site (components, content, layouts, pages, styles)
├── lib/assets/        # R2 asset processor (see lib/assets/README.md)
├── workers/           # Worker helpers shared by worker.js
├── dist/              # Build output (generated)
├── assets.config.js   # Image pipeline + Worker variant configuration
├── worker.js          # Cloudflare Worker (site + CDN image delivery)
├── astro.config.mjs   # Astro configuration
├── wrangler.toml      # Cloudflare Workers config
└── tailwind.config.js # Tailwind theme config
```

## Key Features

- **Static Site Generation**: Pre-rendered HTML with Astro
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Theme**: Custom dark theme with theme persistence
- **Optimized Assets**: Image optimization (AVIF, WebP) and performance tuning
- **Type Safety**: Full TypeScript implementation with strict typing
- **Global CDN**: Deployed on Cloudflare Workers for worldwide performance
- **Accessibility**: Semantic HTML, ARIA support, and keyboard navigation
- **Modern Stack**: Astro 7 and Tailwind CSS 4

## 🤖 AI Collaboration

AI agent rules live in `AGENTS.md`. Codex and OpenCode read it directly;
Claude Code loads it through the one-line `CLAUDE.md` shim (`@AGENTS.md`).
It inherits shared collaboration + frontend rules from the
personal-ai-assistant manual. `docs/validation-rules.json` is a reference
spec of project-specific checks (R2 secrets, alt text, etc.) kept for
future linting — it is not executed automatically.

---

## Getting Started

### Prerequisites

- Node.js 22.12 or newer (LTS recommended)
- pnpm 10.16.1 through Corepack

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
pnpm install
```

### Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type checking
pnpm type-check

# Linting
pnpm lint

# Clean build files
pnpm clean

# Unit tests (asset pipeline + Worker helpers)
pnpm test

# Build and deploy to Cloudflare Workers
pnpm deploy
```

## Build & Optimization

The project includes several optimizations:

- CSS minification with cssnano
- JavaScript minification with Terser
- Image optimization for multiple formats (avif, webp)
- Code splitting and vendor chunk optimization
- Console stripping in production
- Automatic CSS prefixing

### Build Configuration

The build process is configured in `astro.config.mjs` with the following features:

- Static build output (no server-side adapter needed)
- Optimized asset handling
- Minified Tailwind output
- SVG optimization with astro-icon
- Manual chunk splitting for vendor code
- Sharp-based preprocessing with AVIF/WebP assets served from Cloudflare R2
- Terser minification with console stripping in production

## Components

The website consists of several key components:

- About
- Experience
- Skills
- Contact
- Interactive Background
- Theme Toggle
- Navigation

## Styling

The project uses Tailwind CSS with custom configurations:

- Custom animations
- Theme variables
- Global styles
- Component-specific styles

## Performance Considerations

- Images are optimized and served in modern formats (AVIF, WebP)
- JavaScript is split into chunks (vendor, astro-vendor)
- Styles are minified with cssnano
- Development source maps are available
- Console logs are stripped in production
- Global CDN delivery via Cloudflare Workers
- Static assets cached at the edge

## Configuration Files

### Key Configuration Files

- **astro.config.mjs**: Main Astro configuration with static build settings
- **wrangler.toml**: Cloudflare Workers deployment configuration
- **tailwind.config.js**: Tailwind theme customization
- **tsconfig.json**: TypeScript compiler options
- **package.json**: Dependencies and build scripts

### Migration from Pages to Workers

This project was migrated from Cloudflare Pages to Cloudflare Workers for better performance and control:

- **Before**: Cloudflare Pages with server-side adapter
- **After**: Cloudflare Workers with static assets hosting
- **Benefits**: Faster deployments, better caching, simplified configuration

## Deployment

The site is deployed to **Cloudflare Workers** using static assets hosting.
The repository is connected to Cloudflare Workers Builds: every push builds
automatically, and **merges to `master` deploy production** — no manual
deploy step is required. `pnpm deploy` remains available for manual
deployments from a machine with wrangler auth.

The deployment process:

1. **Build**: Static files are generated in the `dist/` directory
2. **Deploy**: Automatic via Workers Builds on merge to `master` (or
   manually via Wrangler CLI)
3. **Hosting**: Served via Cloudflare's global edge network

### Deployment Configuration

- **wrangler.toml**: Configures Cloudflare Workers deployment
- **Static Assets**: All site content served from `dist/` directory
- **Custom Domains**: `josemianton.com`, `www.josemianton.com`, and
  `cdn.josemianton.com` (R2 image delivery) configured via Cloudflare Workers
- **Performance**: Global CDN with edge caching

### Deploy Commands

```bash
# Build and deploy
pnpm deploy

# Deploy with dry run (test configuration)
pnpm exec wrangler deploy --dry-run

# View deployment history
pnpm exec wrangler deployments list
```

## License

MIT License

Copyright (c) 2024 Josemi Anton

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Get In Touch

You can reach out to me through various channels:

- **Personal Website**: [josemianton.com](https://josemianton.com)
- **GitHub**: [@jantonca](https://github.com/jantonca)
- **LinkedIn**: [Josemi Anton](https://linkedin.com/in/josemiantoncasado)
