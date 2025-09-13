# Changelog

## [2024-09-13] - Asset Pipeline & CDN Implementation

### Added
- **Cloudflare R2 Integration**: Complete image optimization and CDN delivery system
- **Mobile-First Image Optimization**: 
  - Three responsive sizes: 400px (mobile), 800px (tablet), 1200px (desktop)
  - Adaptive quality: 90 for mobile, 85 for tablet, 80 for desktop
  - WebP and AVIF formats for optimal compression
- **CDN Subdomain**: Images now served from `cdn.josemianton.com`
- **Asset Management Scripts**:
  - `npm run assets:sync`: Optimize and upload images to R2
  - `npm run assets:status`: Check storage usage
  - `npm run images:add`: Interactive image addition
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
- Manifest tracking in `.asset-manifest.json`
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
5. Run `npm run assets:sync` to optimize and upload images

### Security Considerations
- Always use `.env` for credentials (never commit)
- Regularly rotate R2 API keys
- Use minimal IAM permissions for R2 access
- Keep manifest files out of version control