# 📸 Image Management Guide for Development

## Overview

Our project uses Cloudflare R2 for image storage and CDN delivery. Images are optimized and served from `cdn.josemianton.com` in production, while development can work with local files or fallback to the CDN.

## 🚀 Quick Start for New Developers

When you clone the repository, the `public/images/` folder will be empty (it's git-ignored). You have three options:

### Option 1: Use CDN Fallback (Recommended - Zero Setup)

Simply start developing! The enhanced `R2Image` component will automatically fetch images from the CDN when local files are missing.

```bash
# Just start developing
pnpm run dev
```

**Pros:** No setup required, always up-to-date images
**Cons:** Requires internet connection

### Option 2: Download Images for Offline Development

Use the development helper script to download images locally:

```bash
# Interactive mode - choose what to download
pnpm run dev:images

# Download all images from R2
pnpm run dev:images:pull

# Check what's missing locally
pnpm run dev:images:check
```

**Pros:** Works offline, faster local loading
**Cons:** One-time download required

### Option 3: Add Your Own Test Images

Simply add any images to `public/images/` for local testing:

```bash
# Add your own images
cp ~/my-test-image.jpg public/images/
```

## 📁 Project Structure

```
project/
├── public/
│   ├── images/           # Local dev images (git-ignored)
│   └── assets-manifest.json  # Asset tracking (git-ignored)
├── lib/
│   └── assets/           # R2 processor system
│       ├── cli/          # sync.js, status.js, dev-images.js entry points
│       ├── core/         # processor.js, rules.js, utils.js
│       └── test/         # Unit tests (pnpm test)
└── src/
    └── components/
        ├── R2Image.astro    # Smart image component
        └── R2Picture.astro  # Picture element component
```

## 🔧 Setup Scripts

All scripts are already wired up in `package.json` and read R2 credentials
from `.env` automatically:

```bash
pnpm run assets:sync        # Optimize and upload to R2
pnpm run assets:status      # Storage usage + manifest summary
pnpm run dev:images         # Interactive download helper
pnpm run dev:images:pull    # Download all originals missing locally
pnpm run dev:images:check   # Report local vs R2 differences
```

## 🌐 How It Works

### Development Mode

1. **Component checks for local file** → `public/images/profile.jpg`
2. **If exists** → Serve locally: `/images/profile.jpg`
3. **If missing** → Fallback to CDN: `https://cdn.josemianton.com/images/profile-800.webp`

### Production Mode

Always serves from CDN with optimized formats:

- Mobile: `profile-400.webp` (400px width)
- Tablet: `profile-800.webp` (800px width)
- Desktop: `profile-1200.webp` (1200px width)

## 📝 Component Usage

The enhanced `R2Image` component handles everything automatically:

```astro
<!-- Basic usage - works with or without local files -->
<R2Image
  src="profile.jpg"
  alt="Profile"
  width={800}
/>

<!-- Disable R2 fallback (local only) -->
<R2Image
  src="test.jpg"
  alt="Test"
  fallbackToR2={false}
/>

<!-- Force R2 even if local exists -->
<R2Image
  src="hero.jpg"
  alt="Hero"
  fallbackToR2={true}
/>
```

## 🔍 Debugging

Check the browser DevTools for image source information:

```html
<!-- Local file -->
<img
  data-source="local"
  src="/images/profile.jpg"
/>

<!-- R2-served image in production -->
<img
  data-source="r2"
  src="https://cdn.josemianton.com/images/profile-400.webp"
/>
```

Console will show when using R2 fallback:

```
[R2Image] Using CDN fallback for: profile.jpg
```

## 🛠️ Troubleshooting

### Images not showing in development

1. **Check internet connection** - CDN fallback requires internet
2. **Run `pnpm run dev:images:check`** - See what's missing
3. **Pull images if needed** - `pnpm run dev:images:pull`

### Want to work offline?

Download all images once:

```bash
pnpm run dev:images:pull
```

### Adding new images

1. **Add to `public/images/`** locally
2. **Run `pnpm run assets:sync`** to process and upload
3. **Commit your code** (images are git-ignored)

## 📊 Storage Status

Check R2 storage usage:

```bash
pnpm run assets:status
```

Output:

```
📊 Storage Status:
   Used: 45.2 MB / 10 GB (0.45%)
   Images: 127 files
   ⚠️  Warning at 80% usage
```

## 🔐 Security Notes

- **Never commit `.env` file** - Contains R2 credentials
- **Images are public** - Don't store sensitive images
- **Use environment variables** - All credentials in `.env`

## 💡 Best Practices

1. **Use CDN fallback in development** - Always have latest images
2. **Download for offline work** - When working without internet
3. **Test both modes** - Verify images work locally and from CDN
4. **Keep images optimized** - Run `assets:sync` after adding new images

## 🚢 Deployment

Production automatically uses CDN URLs. No special deployment steps needed for images.

```bash
# Deploy to production
pnpm run build
pnpm exec wrangler deploy
```

## 📚 Additional Resources

- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Asset Pipeline README](../lib/assets/README.md)
