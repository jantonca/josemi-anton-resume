# 📋 Asset Pipeline Implementation Checklist

## 🎯 Project Goal
Build a **secure, performant, and reusable** asset management system optimized for Cloudflare R2's 10GB free tier, following all collaboration protocols.

---

## 🤔 Architecture Decision (Propose, Justify, Recommend)

### Options for Asset Management Architecture:

1. **Monolithic Script** - Single file handling all operations
   - ✅ Pros: Simple, all code in one place
   - ❌ Cons: Hard to test, not reusable, violates SoC

2. **Modular Library** - Separate modules for each concern
   - ✅ Pros: Testable, reusable, follows SoC, maintainable
   - ❌ Cons: More initial setup, multiple files

3. **NPM Package** - Standalone package with CLI
   - ✅ Pros: Maximum reusability, versioned, shareable
   - ❌ Cons: Overhead for single project, publishing complexity

**📌 Recommendation**: **Option 2 - Modular Library** 
- Provides the best balance of maintainability and reusability
- Follows DRY and SoC principles
- Easy to extract to NPM package later if needed

---

## ✅ Pre-Implementation Checklist

### Environment Setup
- [ ] Verify `.env` file exists with R2 credentials
- [ ] Check Node.js version compatibility (>=18)
- [ ] Ensure TypeScript is configured
- [ ] Verify sharp and AWS SDK are installed

### Security Audit
- [ ] Confirm no hardcoded secrets in existing code
- [ ] Check `.gitignore` includes `.env` and sensitive files
- [ ] Verify R2 bucket permissions are restrictive
- [ ] Ensure no PII in logs or error messages

---

## 📦 Phase 1: Core Architecture Setup

### 1.1 Create Module Structure
```bash
lib/assets/
├── core/
│   ├── AssetManager.ts      # Main orchestrator class
│   ├── types.ts             # TypeScript interfaces
│   └── config.ts            # Configuration schema
├── optimization/
│   ├── ImageOptimizer.ts    # Sharp-based optimizer
│   ├── formats.ts           # Format strategies
│   └── sizes.ts             # Size calculations
├── storage/
│   ├── R2Client.ts          # R2 operations wrapper
│   ├── StorageMonitor.ts    # Usage tracking
│   └── manifest.ts          # Image manifest
└── utils/
    ├── logger.ts            # Structured logging
    ├── hash.ts              # File deduplication
    └── validators.ts        # Input validation
```

**Tasks:**
- [ ] Create directory structure
- [ ] Set up TypeScript paths in `tsconfig.json`
- [ ] Create index.ts barrel exports
- [ ] Add JSDoc comments for all exports

### 1.2 Type Definitions
- [ ] Define `ImageAsset` interface
- [ ] Create `OptimizationConfig` type
- [ ] Define `StorageMetrics` interface
- [ ] Create `ProcessingResult` type
- [ ] Add error types for proper handling

### 1.3 Configuration Schema
- [ ] Create default configuration
- [ ] Add environment variable validation
- [ ] Implement config merging logic
- [ ] Add runtime validation with Zod/Joi

---

## 🎨 Phase 2: Image Optimization Module

### 2.1 Input Format Support
```typescript
// Supported input formats
const SUPPORTED_INPUTS = {
  // Raster formats
  '.jpg': 'jpeg',
  '.jpeg': 'jpeg',
  '.png': 'png',
  '.webp': 'webp',
  '.avif': 'avif',
  '.gif': 'gif',
  '.tiff': 'tiff',
  '.bmp': 'bmp',
  // Vector formats (special handling)
  '.svg': 'svg',
  // RAW formats (if needed)
  '.heic': 'heic',
  '.heif': 'heif',
  // Document formats
  '.pdf': 'pdf',
  // Icon formats
  '.ico': 'ico',
  '.icns': 'icns'
}

// Output format strategy
const OUTPUT_FORMATS = {
  avif: { quality: 80, effort: 6 },  // Best compression
  webp: { quality: 85, effort: 6 },  // Fallback
  // jpeg: optional, only if explicitly needed
}
```

**Tasks:**
- [ ] Implement input format detection and validation
- [ ] Handle PNG with transparency → WebP/AVIF with alpha
- [ ] Convert GIF animations → WebP animated or video
- [ ] Process SVG optimization (SVGO integration)
- [ ] Handle HEIC/HEIF conversion (iOS photos)
- [ ] Implement smart format conversion matrix
- [ ] Add format-specific optimization strategies
- [ ] Create fallback chains for unsupported formats

### 2.2 Format Conversion Strategy
```typescript
interface FormatConversionRule {
  input: string;
  outputs: string[];
  preserveAlpha: boolean;
  special: 'animation' | 'vector' | 'raw' | null;
}

// Conversion matrix
const CONVERSION_RULES: FormatConversionRule[] = [
  // PNG with transparency
  { input: 'png', outputs: ['avif', 'webp'], preserveAlpha: true, special: null },
  
  // JPEG/JPG - standard photos
  { input: 'jpeg', outputs: ['avif', 'webp'], preserveAlpha: false, special: null },
  
  // GIF - handle animations
  { input: 'gif', outputs: ['webp'], preserveAlpha: true, special: 'animation' },
  
  // SVG - optimize but keep as SVG
  { input: 'svg', outputs: ['svg'], preserveAlpha: true, special: 'vector' },
  
  // HEIC/HEIF - iOS photos
  { input: 'heic', outputs: ['avif', 'webp'], preserveAlpha: false, special: 'raw' },
  
  // Already optimized formats
  { input: 'webp', outputs: ['webp', 'avif'], preserveAlpha: true, special: null },
  { input: 'avif', outputs: ['avif'], preserveAlpha: true, special: null },
  
  // PDF - special handling
  { input: 'pdf', outputs: ['pdf', 'preview'], preserveAlpha: false, special: 'document' },
  
  // Icons
  { input: 'ico', outputs: ['png', 'webp'], preserveAlpha: true, special: 'icon' },
]
```

**Special Format Handlers:**
- [ ] **PNG Transparency**: Detect alpha channel and preserve in output
- [ ] **GIF Animation**: Convert to animated WebP or suggest video format
- [ ] **SVG Optimization**: Use SVGO, keep as vector, inline small SVGs
- [ ] **HEIC/HEIF**: Use heic-convert for iOS photo support
- [ ] **Large PNGs**: Auto-detect screenshots vs photos, optimize differently
- [ ] **TIFF/BMP**: Convert to modern formats with warning

### 2.3 PDF & Document Handling
```typescript
interface PDFProcessingOptions {
  // What to do with PDFs
  mode: 'preview' | 'thumbnail' | 'full-convert' | 'store-only';
  
  // Preview generation
  preview: {
    firstPageOnly: boolean;    // Just first page or all pages
    format: 'png' | 'webp';    // Output format for previews
    density: number;           // DPI for rendering (72-300)
    maxPages: number;          // Limit pages to convert
  };
  
  // Thumbnail generation
  thumbnail: {
    width: number;             // Thumbnail width
    height: number;            // Thumbnail height
    quality: number;           // Compression quality
  };
  
  // Storage
  keepOriginal: boolean;       // Store original PDF
  compress: boolean;           // Compress PDF with ghostscript
}

// PDF Processing Strategy
const PDF_STRATEGY = {
  // Resume/CV PDFs
  'resume': {
    mode: 'store-only',
    keepOriginal: true,
    compress: true,
  },
  
  // Portfolio/presentation PDFs  
  'portfolio': {
    mode: 'preview',
    preview: {
      firstPageOnly: false,
      format: 'webp',
      density: 150,
      maxPages: 10
    },
    thumbnail: {
      width: 400,
      height: 566,  // A4 aspect ratio
      quality: 85
    },
    keepOriginal: true
  },
  
  // Certificates/Documents
  'document': {
    mode: 'thumbnail',
    thumbnail: {
      width: 200,
      height: 283,
      quality: 90
    },
    keepOriginal: true
  }
}
```

**PDF Processing Tasks:**
- [ ] **PDF.js Integration**: Client-side PDF rendering without conversion
- [ ] **Ghostscript**: Server-side PDF optimization and compression
- [ ] **Sharp/ImageMagick**: Convert PDF pages to images
- [ ] **Thumbnail Generation**: Create preview images for PDF links
- [ ] **Multi-page Handling**: Generate image per page or combine
- [ ] **Text Extraction**: Extract text for SEO (optional)
- [ ] **Security**: Remove JavaScript, forms, annotations from PDFs
- [ ] **Lazy Loading**: Stream PDFs on-demand instead of pre-loading

### 2.4 Smart Sizing System
- [ ] Implement responsive size generation (400, 800, 1200)
- [ ] Add "no upscale" protection
- [ ] Create aspect ratio preservation
- [ ] Implement smart cropping for art direction
- [ ] Add size validation (max dimensions)
- [ ] **Format-aware sizing**: Skip sizes for SVGs, different sizes for screenshots
- [ ] **Density variants**: Support 1x, 2x for retina displays
- [ ] **PDF-specific sizes**: Different dimensions for document previews

### 2.5 Optimization Pipeline
- [ ] Create queue system for batch processing
- [ ] Implement progress tracking
- [ ] Add cancellation support
- [ ] Create optimization presets (quality levels)
- [ ] Add metadata preservation options

---

## 📊 Phase 3: Storage Management

### 3.1 R2 Client Wrapper
- [ ] Create authenticated S3 client
- [ ] Implement upload with retry logic
- [ ] Add multipart upload for large files
- [ ] Create download/streaming methods
- [ ] Implement deletion with confirmation

### 3.2 Storage Monitoring
```typescript
interface StorageMetrics {
  used: number;        // Bytes used
  limit: number;       // 10GB in bytes
  percentage: number;  // Usage percentage
  imageCount: number;  // Total images
  warning: boolean;    // >80% usage
}
```

**Tasks:**
- [ ] Implement storage calculator
- [ ] Create usage reporter CLI command
- [ ] Add threshold warnings (80%, 90%)
- [ ] Build cleanup suggestions
- [ ] Create usage visualization

### 3.3 Manifest System
- [ ] Design manifest JSON schema
- [ ] Implement manifest CRUD operations
- [ ] Add image deduplication via hashing
- [ ] Create orphaned image detection
- [ ] Build manifest migration tool

---

## 📄 Asset Usage Examples

### Image Assets
```typescript
// Profile photo
<R2Image 
  src="profile.jpg" 
  alt="Profile" 
  formats={['avif', 'webp']}
  sizes={[400, 800]}
/>

// Screenshot/PNG with transparency
<R2Picture 
  src="project-screenshot.png"
  alt="Project"
  preserveAlpha={true}
/>

// SVG icon (no conversion)
<R2Image 
  src="logo.svg" 
  alt="Logo"
  optimize="svgo" // Just optimize, don't convert
/>
```

### PDF Assets
```typescript
// Resume PDF with thumbnail
<R2Document
  src="resume.pdf"
  type="resume"
  showThumbnail={true}
  downloadable={true}
/>

// Portfolio PDF with preview gallery
<R2PDFViewer
  src="portfolio.pdf"
  type="portfolio"
  previewMode="gallery" // Shows page previews
  lazyLoad={true}
/>

// Certificate with just thumbnail
<R2Document
  src="certificate.pdf"
  type="document"
  thumbnailOnly={true}
  onClick="download" // or "view"
/>
```

### Storage Impact Examples
```
// Original sizes
profile.jpg: 2.5MB
resume.pdf: 1.5MB
portfolio.pdf: 10MB
logo.svg: 50KB

// After optimization
profile-400.avif: 35KB
profile-400.webp: 45KB
profile-800.avif: 85KB
profile-800.webp: 110KB
resume.pdf: 800KB (compressed)
resume-thumb.webp: 25KB
portfolio.pdf: 5MB (compressed)
portfolio-page-1.webp: 150KB
portfolio-page-2.webp: 150KB
logo.svg: 20KB (optimized)

Total: ~6.5MB (vs 14MB original)
```

## 🚀 Phase 4: Developer Experience

### 4.1 CLI Interface
```bash
# Commands to implement
npm run assets:add <image>      # Add single image
npm run assets:process          # Process all pending
npm run assets:status           # Show storage usage
npm run assets:clean            # Remove unused
npm run assets:dev              # Start dev server
```

**Tasks:**
- [ ] Create interactive CLI with prompts
- [ ] Add progress bars with ora/cli-progress
- [ ] Implement dry-run mode
- [ ] Add verbose logging option
- [ ] Create help documentation

### 4.2 File Watcher
- [ ] Implement chokidar watcher
- [ ] Add debouncing for rapid changes
- [ ] Create ignore patterns (.gitignore style)
- [ ] Add watcher status indicator
- [ ] Implement graceful shutdown

### 4.3 Vite Plugin
- [ ] Create Vite middleware for local serving
- [ ] Add image transformation on-the-fly
- [ ] Implement caching layer
- [ ] Add HMR support for images
- [ ] Create dev server proxy to R2

### 4.4 Error Handling
- [ ] Implement error boundary pattern
- [ ] Add user-friendly error messages
- [ ] Create rollback mechanism
- [ ] Add error reporting (optional Sentry)
- [ ] Implement graceful degradation

---

## 🧪 Phase 5: Testing Strategy

### 5.1 Unit Tests
- [ ] Test image optimization logic
- [ ] Test size calculations
- [ ] Test format detection
- [ ] Test configuration merging
- [ ] Test hash generation

### 5.2 Integration Tests
- [ ] Test R2 upload/download
- [ ] Test manifest operations
- [ ] Test file watching
- [ ] Test CLI commands
- [ ] Test error scenarios

### 5.3 Performance Tests
- [ ] Benchmark optimization speed
- [ ] Test memory usage
- [ ] Measure compression ratios
- [ ] Test concurrent processing
- [ ] Profile CPU usage

### 5.4 E2E Tests
- [ ] Test full pipeline flow
- [ ] Test dev server integration
- [ ] Test production build
- [ ] Test cleanup operations
- [ ] Test migration scenarios

---

## 📚 Phase 6: Documentation

### 6.1 Code Documentation
- [ ] Add TSDoc to all public APIs
- [ ] Create inline code examples
- [ ] Document configuration options
- [ ] Add troubleshooting guide
- [ ] Create migration guide

### 6.2 User Documentation
- [ ] Write README.md with quick start
- [ ] Create CONFIGURATION.md
- [ ] Write TROUBLESHOOTING.md
- [ ] Add CONTRIBUTING.md
- [ ] Create example projects

### 6.3 Reusability Package
- [ ] Extract core to `lib/assets-core/`
- [ ] Create npm package.json
- [ ] Add installation script
- [ ] Create framework adapters
- [ ] Write changelog

---

## 🔒 Security Checklist

- [ ] No secrets in code (use process.env)
- [ ] Input validation on all file operations
- [ ] Sanitize file names and paths
- [ ] Implement rate limiting for API calls
- [ ] Add CORS headers properly
- [ ] Validate image file types
- [ ] Prevent directory traversal
- [ ] Secure error messages (no stack traces)

---

## ⚡ Performance Checklist

- [ ] Lazy load heavy dependencies
- [ ] Implement caching strategies
- [ ] Use streaming for large files
- [ ] Optimize concurrent operations
- [ ] Add request debouncing
- [ ] Implement progressive loading
- [ ] Use worker threads for CPU tasks
- [ ] Add CDN cache headers

---

## 📈 Success Metrics

### Storage Efficiency
- [ ] Average image size < 250KB
- [ ] Compression ratio > 70%
- [ ] Storage usage < 8GB (80% of limit)

### Performance
- [ ] Optimization time < 2s per image
- [ ] Dev server response < 100ms
- [ ] Build time impact < 10%

### Developer Experience
- [ ] Zero-config for basic usage
- [ ] Clear error messages
- [ ] Comprehensive logging
- [ ] < 5 min setup time

---

## 🚦 Implementation Order

1. **Week 1**: Core Architecture (Phase 1)
2. **Week 2**: Optimization Module (Phase 2)
3. **Week 3**: Storage Management (Phase 3)
4. **Week 4**: Developer Experience (Phase 4)
5. **Week 5**: Testing (Phase 5)
6. **Week 6**: Documentation & Polish (Phase 6)

---

## 📝 Pre-Submission Checklist

Before each commit:
- [ ] No `console.log` in production code
- [ ] All promises have `.catch()` handlers
- [ ] No unused imports (run ESLint)
- [ ] All functions have TypeScript types
- [ ] Tests pass (`npm test`)
- [ ] No hardcoded values
- [ ] Code follows DRY principle
- [ ] Documentation updated

---

## 🎯 Next Steps

1. **Review** this checklist and approve/modify
2. **Start** with Phase 1.1 - Create module structure
3. **Test** each component in isolation
4. **Integrate** gradually
5. **Document** as we build

---

**Ready to begin?** Let's start with creating the core module structure and type definitions.