# 🤖 AI Governance Constitution

## 1. Role & Framework

**Role**: Expert Senior Developer

**Decision Framework**: Follow the **"Propose, Justify, Recommend"** approach:
- **Propose**: Present multiple viable options
- **Justify**: Explain trade-offs for each option
- **Recommend**: Suggest the best choice with reasoning

## 2. CLI Commands

### Project Commands
```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Quality Checks
pnpm type-check       # TypeScript type checking
pnpm lint             # ESLint code linting
pnpm clean            # Clean build artifacts

# Deployment
npx wrangler deploy   # Deploy to Cloudflare Workers
```

### Cortex TMS Commands
```bash
pnpm run cortex:validate   # Run governance validation
pnpm run cortex:status     # Show project status
pnpm run cortex:version    # Display Cortex version
```

### Asset Management Commands
```bash
pnpm run assets:sync       # Optimize and upload images to R2
pnpm run assets:status     # Check storage usage
pnpm run images:add        # Interactive image addition
pnpm run dev:images:pull   # Pull images from R2 for development
```

## 3. Core Principles

### Security First
- **No secrets in code**: Use environment variables exclusively
- **No hardcoded credentials**: Check `.env.example` for required variables
- **Validate inputs**: Sanitize file paths and user inputs
- **Secure error messages**: Never expose sensitive data in logs

**Required Environment Variables**:
```env
CF_ACCOUNT_ID=xxx           # Cloudflare account ID
R2_ACCESS_KEY_ID=xxx        # R2 API access key
R2_SECRET_ACCESS_KEY=xxx    # R2 API secret key
R2_BUCKET_NAME=xxx          # R2 bucket name
CDN_DOMAIN=cdn.josemianton.com
```

### Performance
- **Image Optimization**: WebP and AVIF formats with quality tiers
- **Responsive Images**: Three sizes (400px, 800px, 1200px)
- **CDN Delivery**: Global edge network via Cloudflare R2
- **Code Splitting**: Vendor chunks and manual splitting
- **CSS Optimization**: Minified with cssnano
- **JS Optimization**: Terser with console stripping in production

### Accessibility
- **Semantic HTML**: Use proper elements for structure
- **ARIA Support**: Labels, roles, and states where needed
- **Keyboard Navigation**: All interactive elements accessible
- **Alt Text**: Descriptive alternative text for images
- **Color Contrast**: WCAG AA compliant color combinations

### Code Quality
- **TypeScript**: Strict typing for all code
- **DRY Principle**: Don't repeat yourself
- **Single Responsibility**: One function, one purpose
- **Clear Naming**: Descriptive variable and function names
- **Comment Rationale**: Explain why, not what

## 4. Domain Context

### Project Type
- **Purpose**: Personal resume and professional landing page
- **Target Audience**: Recruiters, potential employers, professional network
- **Content Focus**: Experience, skills, projects, contact information
- **Tone**: Professional, concise, achievement-focused

### Tech Stack
- **Framework**: Astro 5.13 (Static Site Generation)
- **Styling**: Tailwind CSS with custom dark theme
- **Language**: TypeScript (strict mode)
- **Deployment**: Cloudflare Workers (static assets)
- **CDN**: Cloudflare R2 for image delivery
- **Icons**: Simple Icons integration

### Key Features
- **Static Site Generation**: Server-side rendering for optimal performance
- **Dark Theme**: Custom dark theme with persistence
- **Responsive Design**: Mobile-first approach
- **Optimized Assets**: AVIF/WebP image optimization
- **Type Safety**: Full TypeScript implementation
- **Global CDN**: Cloudflare edge network delivery

## 5. R2 Asset Processor

### Asset Sync Workflow

**1. Add Images**: Place source images in `public/images/`
```bash
public/
└── images/
    ├── profile.jpg      # Original source
    ├── project-1.png
    └── certificates/    # Subfolders supported
        └── cert.pdf
```

**2. Run Sync**: Execute optimization and upload
```bash
pnpm run assets:sync
```

**3. Manifest Update**: Verify `.asset-manifest.json` tracks changes
```json
{
  "processed": {
    "images/profile.jpg": {
      "hash": "abc123",
      "outputs": [
        "images/profile-400.webp",
        "images/profile-400.avif",
        "images/profile-800.webp",
        "images/profile-800.avif",
        "images/profile-1200.webp",
        "images/profile-1200.avif"
      ],
      "size": 245000,
      "updated": "2024-09-13T10:00:00Z"
    }
  }
}
```

**4. Use CDN URLs**: Reference R2 CDN URLs in components
```astro
<R2Image
  src="profile.jpg"
  alt="Profile photo"
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
/>
```

### Image Processing Rules

**Optimization Strategy**:
- **Mobile (400px)**: Quality 90 - Optimized for high-DPI phone screens
- **Tablet (800px)**: Quality 85 - Balanced for medium screens
- **Desktop (1200px)**: Quality 80 - Optimized for larger displays

**Format Strategy**:
- **Primary**: AVIF (best compression, ~40% smaller than WebP)
- **Fallback**: WebP (broad support, ~30% smaller than JPEG)
- **Original**: Served only if modern formats fail

**File Naming Convention**:
```
Original:  profile.jpg
Outputs:   profile-400.webp, profile-400.avif
           profile-800.webp, profile-800.avif
           profile-1200.webp, profile-1200.avif
```

### Development vs Production

**Development Mode** (`pnpm dev`):
- Serves original images from `public/images/`
- No CDN calls, faster iteration
- Full-quality unoptimized assets

**Production Mode** (`pnpm build`):
- Serves optimized images from `cdn.josemianton.com`
- AVIF/WebP formats with responsive srcset
- Global CDN delivery with edge caching

### Storage Management

**Cloudflare R2 Free Tier**: 10GB storage
- **Target**: Keep usage under 8GB (80%)
- **Warning**: Alert at 9GB (90%)
- **Monitor**: Check `pnpm run assets:status` regularly

**Hash-Based Deduplication**:
- Files are hashed before upload
- Unchanged files are skipped
- Reduces redundant uploads and storage

### Components

**R2Image.astro**: Optimized single image
```astro
<R2Image
  src="profile.jpg"
  alt="Josemi Anton - Full Stack Developer"
  width={800}
  height={800}
/>
```

**R2Picture.astro**: Multi-format picture element
```astro
<R2Picture
  src="project-screenshot.png"
  alt="Project demonstration"
  formats={['avif', 'webp']}
  sizes={[400, 800, 1200]}
/>
```

## 6. Git Workflow

### Branch Strategy
- **Main Branch**: `main` (production-ready code)
- **Feature Branches**: `feat/description` or `fix/description`
- **NEVER commit directly to main**: Always use feature branches

### Commit Protocol
```bash
# Create feature branch
git checkout -b feat/add-new-section

# Stage changes
git add <files>

# Commit with conventional format
git commit -m "feat: add projects section

Implement projects showcase with filterable categories.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to remote
git push -u origin feat/add-new-section
```

### Conventional Commits
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## 7. File References

**Governance**:
- `.cortex/constitution.md` - This file (primary governance)
- `.cortex/glossary.md` - Project-specific terminology
- `.cortex/validation.json` - Custom validation rules
- `.cortexrc` - Cortex configuration
- `.github/copilot-instructions.md` - Detailed collaboration protocol

**Technical Documentation**:
- `lib/assets/README.md` - Asset processor architecture
- `docs/ASSET_PIPELINE_IMPLEMENTATION.md` - Full implementation checklist
- `docs/ASSET_PIPELINE_SIMPLE.md` - Simplified implementation guide
- `docs/IMAGE_MANAGEMENT.md` - Image management workflows

**Project Documentation**:
- `README.md` - Project overview and setup
- `CHANGELOG.md` - Version history and changes

## 8. Testing Requirements

### Before Committing
- Run `pnpm type-check` - TypeScript errors must be zero
- Run `pnpm lint` - ESLint warnings should be addressed
- Run `pnpm build` - Build must succeed without errors
- Test in development (`pnpm dev`) - Visual verification
- Test production build (`pnpm preview`) - Pre-deployment check

### Manual Testing Checklist
- [ ] Mobile responsiveness (375px, 768px, 1024px, 1440px)
- [ ] Image loading (check network tab for AVIF/WebP)
- [ ] Dark theme toggle (if applicable)
- [ ] Keyboard navigation
- [ ] Screen reader compatibility (if adding new content)

## 9. Deployment Workflow

### Pre-Deployment
1. Ensure all tests pass
2. Run `pnpm run assets:sync` to upload latest images
3. Build production version: `pnpm build`
4. Preview locally: `pnpm preview`
5. Verify CDN image URLs work

### Deployment
```bash
# Deploy to Cloudflare Workers
npx wrangler deploy

# Verify deployment
# Visit https://josemianton.com
# Check DevTools Network tab for CDN URLs
```

### Post-Deployment
- Verify site loads correctly
- Check image optimization (AVIF/WebP formats)
- Test responsive layouts
- Confirm CDN delivery (check response headers)

## 10. Troubleshooting

### Common Issues

**Images not loading in production**:
- Check `.env` has correct `CDN_DOMAIN`
- Verify `assets:sync` ran successfully
- Check `.asset-manifest.json` for uploaded files
- Inspect CDN URLs in browser DevTools

**Build fails**:
- Run `pnpm type-check` to identify TypeScript errors
- Check for missing dependencies
- Clear cache: `pnpm clean` and rebuild

**R2 upload fails**:
- Verify environment variables are set
- Check R2 bucket permissions
- Ensure API keys are valid and not expired
- Check storage quota: `pnpm run assets:status`

**TypeScript errors**:
- Ensure all imports have proper types
- Check `tsconfig.json` for strict mode settings
- Verify component props match interfaces

## 11. Best Practices

### Code Organization
- Keep components small and focused
- Use TypeScript interfaces for all props
- Extract reusable logic to `lib/` utilities
- Document complex logic with comments

### Performance Optimization
- Lazy load images below the fold
- Use appropriate image sizes (don't serve 1200px on mobile)
- Minimize JavaScript bundle size
- Leverage Cloudflare edge caching

### Accessibility
- Always include alt text for images
- Use semantic HTML elements
- Ensure sufficient color contrast
- Support keyboard navigation
- Test with screen readers

### Security
- Never commit `.env` files
- Rotate API keys regularly
- Use minimal IAM permissions for R2
- Sanitize user inputs (if adding forms)
- Keep dependencies updated

## 12. Maintenance

### Regular Tasks
- **Monthly**: Review and update dependencies (`pnpm update`)
- **Quarterly**: Rotate R2 API keys
- **As Needed**: Update content (experience, skills, projects)
- **Before Major Changes**: Run full test suite

### Monitoring
- Check R2 storage usage: `pnpm run assets:status`
- Monitor Cloudflare Workers analytics
- Review TypeScript/ESLint errors: `pnpm type-check && pnpm lint`
- Verify CDN cache hit rates

---

**Version**: Cortex TMS 2.6.0-beta.1
**Last Updated**: 2026-01-17
**Project**: josemi-anton-resume (Personal Landing Page)
