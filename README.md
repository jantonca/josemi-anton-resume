# Personal Website/Resume Documentation

## Overview

A personal website/resume built with Astro, React, and TypeScript. The site features a clean, professional design with a dark theme and interactive elements.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v5.13
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React, Simple Icons
- **Build Tools**: Vite (integrated with Astro)
- **Hosting**: Cloudflare Workers (static assets)
- **Image Service**: Squoosh (Cloudflare Workers compatible)

## Project Structure

```
josemi-anton-resume/
├── public/            # Static assets
│   ├── fonts/        # Custom fonts (Proto Grotesk, Akzidenz Grotesk)
│   └── images/       # Profile images and assets
├── src/
│   ├── components/    # Reusable Astro/React components
│   ├── content/       # TypeScript content definitions
│   ├── hooks/         # Custom React hooks (theme management)
│   ├── icons/         # SVG icons and related components
│   ├── layouts/       # Page layouts
│   ├── lib/          # Utility functions
│   ├── pages/        # Route pages
│   ├── styles/       # Global styles and themes
│   └── types/        # TypeScript type definitions
├── dist/             # Build output (generated)
├── astro.config.mjs  # Astro configuration
├── wrangler.toml     # Cloudflare Workers config
└── tailwind.config.mjs # Tailwind CSS config
```

## Key Features

- **Static Site Generation**: Server-side rendering with Astro for optimal performance
- **Interactive Components**: React components for dynamic functionality (theme toggle, navigation)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Theme**: Custom dark theme with theme persistence
- **Optimized Assets**: Image optimization (AVIF, WebP) and performance tuning
- **Type Safety**: Full TypeScript implementation with strict typing
- **Global CDN**: Deployed on Cloudflare Workers for worldwide performance
- **Accessibility**: Semantic HTML, ARIA support, and keyboard navigation
- **Modern Stack**: Latest Astro v5, React 18, and cutting-edge web technologies

## Getting Started

### Prerequisites

- Node.js (LTS version)
- pnpm/npm/yarn

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

# Deploy to Cloudflare Workers
npx wrangler deploy
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
- Selective React hydration
- SVG optimization with astro-icon
- Manual chunk splitting for vendor code
- Squoosh image service for Cloudflare Workers compatibility
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
- JavaScript is split into chunks (vendor, react-vendor, astro-vendor)
- Styles are minified with cssnano
- Development source maps are available
- Console logs are stripped in production
- Global CDN delivery via Cloudflare Workers
- Static assets cached at the edge

## Configuration Files

### Key Configuration Files

- **astro.config.mjs**: Main Astro configuration with static build settings
- **wrangler.toml**: Cloudflare Workers deployment configuration
- **tailwind.config.mjs**: Tailwind CSS customization
- **tsconfig.json**: TypeScript compiler options
- **package.json**: Dependencies and build scripts

### Migration from Pages to Workers

This project was migrated from Cloudflare Pages to Cloudflare Workers for better performance and control:

- **Before**: Cloudflare Pages with server-side adapter
- **After**: Cloudflare Workers with static assets hosting
- **Benefits**: Faster deployments, better caching, simplified configuration

## Deployment

The site is deployed to **Cloudflare Workers** using static assets hosting. The deployment process:

1. **Build**: Static files are generated in the `dist/` directory
2. **Deploy**: Uses Wrangler CLI to deploy to Cloudflare Workers
3. **Hosting**: Served via Cloudflare's global edge network

### Deployment Configuration

- **wrangler.toml**: Configures Cloudflare Workers deployment
- **Static Assets**: All site content served from `dist/` directory
- **Custom Domain**: `josemianton.com` configured via Cloudflare Workers
- **Performance**: Global CDN with edge caching

### Deploy Commands

```bash
# Build and deploy
pnpm build && npx wrangler deploy

# Deploy with dry run (test configuration)
npx wrangler deploy --dry-run

# View deployment history
npx wrangler deployments list
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
- **GitHub**: [@josemianton](https://github.com/jantonca)
- **LinkedIn**: [Josemi Anton](https://linkedin.com/in/josemiantoncasado)
