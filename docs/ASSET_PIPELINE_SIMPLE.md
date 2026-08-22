# 🎯 Simplified Asset Pipeline - Pragmatic Implementation

> Historical design draft. The current implementation uses 400, 800, and
> 1200px AVIF/WebP variants; follow `lib/assets/README.md` for active commands.

## Core Principle: Keep It Simple, Stupid (KISS)
**Mirror local structure in R2, optimize on upload, serve efficiently.**

---

## 📁 Folder Structure (Local = R2)
```
public/
├── images/           # All images go here
│   ├── profile.jpg   # Original files
│   ├── logo.svg     
│   └── projects/     # Subfolders allowed
│       └── app.png
└── documents/        # PDFs and docs
    └── resume.pdf
```

**Same structure in R2 bucket - no complex transformations.**

---

## ✅ Implementation Checklist - Phase 1 (MVP) ✓ COMPLETE

### 1. Single Processing Script (`lib/assets/processor.js`)
```javascript
// One file, clear responsibilities
class AssetProcessor {
  // Core methods only
  async processImage(path, size, format)
  async uploadToR2(content, key)
  async getStorageStatus()
}
```

**Tasks:**
- [✓] Create single `AssetProcessor` class
- [✓] Read files from `public/images` and `public/documents`
- [✓] Process based on file extension
- [✓] Upload with same path structure
- [✓] Track what's been uploaded (simple JSON manifest)

### 2. Image Processing Rules (Simple)
```typescript
const PROCESSING_RULES = {
  // Images: Create 2 versions only
  '.jpg': { outputs: ['webp', 'avif'], sizes: [800, 1600] },
  '.png': { outputs: ['webp', 'avif'], sizes: [800, 1600] },
  '.gif': { outputs: ['webp'], sizes: ['original'] },
  
  // Keep as-is
  '.svg': { outputs: ['svg'], optimize: true },
  '.pdf': { outputs: ['pdf'], compress: true },
  
  // Already optimized
  '.webp': { skip: true },
  '.avif': { skip: true }
}
```

**Tasks:**
- [✓] AVIF + WebP for photos (2 sizes max)
- [✓] SVG optimization placeholder (SVGO ready)
- [✓] PDF compression placeholder (Ghostscript ready)
- [✓] Skip already optimized formats

### 3. File Naming Convention
```
Original: profile.jpg
Outputs:
  - profile-800.webp
  - profile-800.avif
  - profile-1600.webp
  - profile-1600.avif
  
Keep it predictable!
```

**Tasks:**
- [✓] Simple naming: `{name}-{width}.{format}`
- [✓] Original name without size suffix
- [✓] Preserve folder structure

### 4. Simple Manifest (`public/assets-manifest.json`)
```json
{
  "processed": {
    "images/profile.jpg": {
      "hash": "abc123",
      "outputs": [
        "images/profile-800.webp",
        "images/profile-800.avif",
        "images/profile-1600.webp",
        "images/profile-1600.avif"
      ],
      "size": 245000,
      "updated": "2024-01-15T10:00:00Z"
    }
  },
  "storage": {
    "used": 5368709120,  // 5GB in bytes
    "limit": 10737418240, // 10GB in bytes
    "percentage": 50
  }
}
```

**Tasks:**
- [✓] Track processed files with hash
- [✓] Skip if hash unchanged
- [✓] Show storage usage
- [✓] Auto-update on each run

### 5. CLI Commands (Just 3)
```bash
# Process and upload everything
pnpm run assets:sync

# Check storage usage
pnpm run assets:status

# Clean up unused files in R2
pnpm run assets:clean
```

**Tasks:**
- [✓] `sync`: Process new/changed files only
- [✓] `status`: Show storage usage and file count
- [ ] `clean`: Remove R2 files not in manifest (optional)

---

## 📦 Phase 2: Components (Keep existing, minor updates)

### Update Existing Components
```typescript
// R2Image.astro - just update URL generation
const getImageUrl = (src: string, width?: number) => {
  // Dev: serve from public/
  if (import.meta.env.DEV) {
    return `/images/${src}`
  }
  
  // Prod: construct R2 URL
  const base = 'https://your-domain.com/images/'
  if (width && !src.includes('.svg')) {
    // profile.jpg → profile-800.webp
    const name = src.replace(/\.[^.]+$/, '')
    return `${base}${name}-${width}.webp`
  }
  return `${base}${src}`
}
```

**Tasks:**
- [ ] Update `R2Image.astro` for new naming
- [ ] Update `R2Picture.astro` for srcset
- [ ] Add `R2Document.astro` for PDFs
- [ ] Keep components simple and focused

---

## 🔒 Security Checklist (CRITICAL)

### Preventing Secret Leaks
- [✓] No hardcoded API keys or secrets in code
- [✓] All credentials via environment variables
- [✓] `.env` added to `.gitignore`
- [✓] `assets-manifest.json` added to `.gitignore` 
- [✓] No default bucket names in code
- [✓] `.env.example` with placeholder values only
- [✓] Wrangler.toml checked for secrets

### Environment Variables Required
```env
CF_ACCOUNT_ID=xxx        # From Cloudflare dashboard
R2_ACCESS_KEY_ID=xxx     # From R2 API tokens
R2_SECRET_ACCESS_KEY=xxx # From R2 API tokens  
R2_BUCKET_NAME=xxx       # Your bucket name
```

### Before Committing
- [ ] Run `git status` - ensure no `.env` file
- [ ] Check `git diff` - no secrets in changes
- [ ] Verify manifest not tracked
- [ ] Test with `.env.example` values fail properly

## 🚀 Phase 3: Developer Experience (Minimal)

### Watch Mode (Optional)
```typescript
// Simple file watcher
import chokidar from 'chokidar'

chokidar.watch('public/images/**/*')
  .on('add', processAndUpload)
  .on('change', processAndUpload)
```

**Tasks:**
- [ ] Watch for new files
- [ ] Auto-process on change
- [ ] Show progress in terminal
- [ ] Debounce rapid changes

### Environment Setup
```env
# .env - Just 3 variables
CF_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
```

**Tasks:**
- [ ] Validate env vars on start
- [ ] Clear error if missing
- [ ] No complex configuration files

---

## 📊 Storage Strategy (10GB Free Tier)

### Size Targets
```
Per image (average):
- Original: 2MB
- Outputs: ~400KB total (2 formats × 2 sizes)

Capacity:
- 10GB ÷ 400KB = ~25,000 images
- Warn at 8GB (80%)
- Error at 9.5GB (95%)
```

### Optimization Priorities
1. **Quality over quantity**: 85% quality is enough
2. **Two sizes only**: Mobile (800px) and Desktop (1600px)
3. **Two formats**: AVIF (best) and WebP (compatible)
4. **Skip unnecessary**: Don't process if unchanged

---

## 🧪 Testing Checklist (Simple)

### Manual Testing
- [ ] Process a JPEG → creates 4 files
- [ ] Process a PNG with transparency → preserves alpha
- [ ] Process an SVG → optimizes, stays SVG
- [ ] Process a PDF → compresses, stays PDF
- [ ] Re-run with no changes → skips processing
- [ ] Check storage usage → shows correct size

### Automated Tests (Nice to have)
- [ ] Test image optimization
- [ ] Test R2 upload
- [ ] Test manifest updates
- [ ] Test storage calculations

---

## 📝 Complete File Structure (Final)

```
josemi-anton-resume/
├── lib/
│   └── assets/
│       ├── process.ts      # Main processor
│       ├── optimize.ts     # Image optimization
│       ├── upload.ts       # R2 operations
│       └── manifest.ts     # Manifest handling
├── scripts/
│   ├── sync-assets.ts      # CLI entry point
│   └── watch-assets.ts     # Watch mode
├── public/
│   ├── images/             # Source images
│   ├── documents/          # PDFs
│   └── assets-manifest.json # Tracking file
└── src/
    └── components/
        ├── R2Image.astro   # Existing, updated
        ├── R2Picture.astro # Existing, updated
        └── R2Document.astro # New, simple
```

---

## 🎯 Success Criteria

1. **It works** - Files get optimized and uploaded
2. **It's simple** - One main file, clear logic
3. **It's fast** - Only processes changes
4. **It's safe** - Warns before hitting limits
5. **It's reusable** - Copy to another project, change env vars, done

---

## 🚦 Implementation Order (2-3 days max)

### Day 1: Core
- [ ] Create `AssetProcessor` class
- [ ] Implement image optimization
- [ ] Implement R2 upload
- [ ] Create manifest system

### Day 2: Integration
- [ ] Create CLI commands
- [ ] Update components
- [ ] Add watch mode
- [ ] Test with real files

### Day 3: Polish
- [ ] Add storage monitoring
- [ ] Write documentation
- [ ] Create example `.env`
- [ ] Package for reuse

---

## 🔑 Key Decisions

✅ **DO:**
- Mirror folder structure exactly
- Use predictable naming
- Process only what's needed
- Keep it under 500 lines of code
- Focus on the 80% use case

❌ **DON'T:**
- Create complex conversion matrices
- Build elaborate configuration systems
- Over-optimize edge cases
- Add features "just in case"
- Make it harder than needed

---

**Ready to build?** This simplified approach will be done in days, not weeks, and will be maintainable long-term.
