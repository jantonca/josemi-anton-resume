# Personal Website/Resume Documentation

## Overview

A personal website/resume built with Astro, React, and TypeScript. The site features a clean, professional design with a dark theme and interactive elements.

## Tech Stack

- **Framework**: [Astro](https://astro.build/) v4.16
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React, Simple Icons
- **Build Tools**: Vite (integrated with Astro)

## Project Structure

```
josemi-anton-resume/
├── public/            # Static assets
│   ├── fonts/
│   └── images/
├── src/
│   ├── components/    # Reusable Astro/React components
│   ├── content/       # TypeScript content definitions
│   ├── hooks/         # Custom React hooks
│   ├── icons/         # SVG icons and related components
│   ├── layouts/       # Page layouts
│   ├── lib/          # Utility functions
│   ├── pages/        # Route pages
│   ├── styles/       # Global styles and themes
│   └── types/        # TypeScript type definitions
```

## Key Features

- Server-side rendering with Astro
- Interactive React components where needed
- Responsive design
- Dark theme
- Optimized assets and performance
- Type-safe development with TypeScript

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

- Optimized asset handling
- Minified Tailwind output
- Selective React hydration
- SVG optimization
- Manual chunk splitting for vendor code

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

- Images are optimized and served in modern formats
- JavaScript is split into chunks
- Styles are minified
- Development source maps are available
- Console logs are stripped in production

## Deployment

The site is built as a static output and can be deployed to any static hosting service.

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
