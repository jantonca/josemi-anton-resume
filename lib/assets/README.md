# 📦 R2 Asset Processor

A simple, reusable asset optimization and upload system for Cloudflare R2.

## ✨ Features

- 🎨 Automatic image optimization (AVIF + WebP)
- 📱 Mobile-first responsive sizes (400px, 800px, 1200px)
- 📁 Mirrors local folder structure in R2
- 🔄 Smart change detection (skip unchanged files)
- 📊 Storage monitoring (10GB free tier aware)
- 🚀 Zero configuration for basic usage
- 📝 Manifest tracking for processed files
- ⚡ Adaptive quality settings per size

## 🚀 Quick Start

### Method 1: Automated Setup (Recommended)

```bash
# 1. Copy the module to your project
cp -r /path/to/lib/assets ./lib/

# 2. Run setup script
cd your-project
node lib/assets/setup.js

# 3. Install dependencies
npm install sharp @aws-sdk/client-s3

# 4. Start using!
npm run assets:sync
```

### Method 2: Manual Setup

1. **Copy the Module**
   ```bash
   cp -r lib/assets /path/to/your/project/lib/
   ```

2. **Install Dependencies**
   ```bash
   npm install sharp @aws-sdk/client-s3
   ```

3. **Create `.env` file**
   ```env
   CF_ACCOUNT_ID=your-account-id
   R2_ACCESS_KEY_ID=your-access-key
   R2_SECRET_ACCESS_KEY=your-secret-key
   R2_BUCKET_NAME=your-bucket-name
   ```

4. **Add NPM Scripts** to `package.json`:
   ```json
   {
     "scripts": {
       "assets:sync": "export $(grep -v '^#' .env | xargs) && node lib/assets/sync.js",
       "assets:status": "export $(grep -v '^#' .env | xargs) && node lib/assets/status.js"
     }
   }
   ```

5. **Create Folders**
   ```bash
   mkdir -p public/images public/documents
   ```

## 📖 Usage

### Process and Upload Assets
```bash
npm run assets:sync
```

### Check Storage Status
```bash
npm run assets:status
```

## 🎯 How It Works

1. **Input**: Place files in `public/images/` or `public/documents/`
2. **Process**: Optimizes based on file type
3. **Output**: Uploads to R2 with same folder structure
4. **Track**: Saves manifest to avoid reprocessing

### Naming Convention

```
Original: profile.jpg
Outputs:
  - profile-400.webp   (mobile, quality 90)
  - profile-400.avif   (mobile, quality 90)
  - profile-800.webp   (tablet, quality 85)
  - profile-800.avif   (tablet, quality 85)
  - profile-1200.webp  (desktop, quality 80)
  - profile-1200.avif  (desktop, quality 80)
```

## 🔧 Customization

### Change Output Sizes

Edit `processor.js` RULES object:

```javascript
'.jpg': { 
  outputs: ['webp', 'avif'], 
  sizes: [400, 800, 1200],
  quality: { 400: 90, 800: 85, 1200: 80 }
},
```

### Change Quality Settings

The processor uses adaptive quality based on image size:

```javascript
// Mobile-first quality strategy
const quality = this.getQualityForSize(width)
// 400px → 90, 800px → 85, 1200px → 80

pipeline.webp({ quality, effort: 6 })
pipeline.avif({ quality, effort: 6 })
```

### Add More Formats

Add to the `RULES` object in `processor.js`:

```javascript
'.heic': { outputs: ['webp', 'avif'], sizes: [800, 1600] },
```

## 📊 Storage Management

- **10GB Free Tier**: Optimized for Cloudflare R2's free tier
- **Warning at 80%**: Alerts when approaching limit
- **Manifest Tracking**: Prevents re-uploading unchanged files

## 🔍 Manifest Structure

The system creates `public/assets-manifest.json`:

```json
{
  "processed": {
    "images/profile.jpg": {
      "hash": "abc123...",
      "outputs": ["images/profile-800.webp", ...],
      "size": 2914203,
      "updated": "2025-09-13T08:52:32.139Z"
    }
  },
  "storage": {
    "used": 15623900,
    "limit": 10737418240,
    "percentage": 0
  }
}
```

## 🛠️ Advanced Usage

### Use in Astro Components

```astro
---
// R2Image component example
import R2Image from './R2Image.astro'
---

<R2Image 
  src="profile.jpg" 
  alt="Profile"
  width={800}
  height={800}
  class="rounded-lg"
/>
```

### Picture Element with Multiple Formats

```astro
---
import R2Picture from './R2Picture.astro'
---

<R2Picture 
  src="hero.jpg" 
  alt="Hero image"
  sizes="(max-width: 768px) 100vw, 50vw"
  class="w-full"
/>
```

### Programmatic Usage

```javascript
import { AssetProcessor } from './lib/assets/processor.js'

const processor = new AssetProcessor()
await processor.init()
await processor.processAll()

// Get storage status
const status = await processor.getStorageStatus()
console.log(`Using ${status.percentage}% of storage`)
```

## 📝 File Structure

```
lib/assets/
├── processor.js    # Main processor class
├── sync.js        # CLI for syncing
├── status.js      # CLI for status
└── README.md      # This file
```

## ⚙️ Requirements

- Node.js 18+
- Cloudflare R2 bucket
- R2 API credentials

## 📄 License

MIT - Use freely in your projects

## 🤝 Contributing

Feel free to modify and improve for your needs!