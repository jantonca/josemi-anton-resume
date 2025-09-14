/**
 * R2 Asset Processor v2.0
 * Clean, modern implementation without legacy code
 */

import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export class AssetProcessor {
  /**
   * @param {Object} config - Configuration object
   */
  constructor(config = {}) {
    this.config = config
    this.manifest = {
      processed: {},
      storage: { used: 0, limit: 10737418240, percentage: 0 },
    }
    this.stats = { processed: 0, skipped: 0, errors: 0 }
  }

  /**
   * Initialize processor with config
   */
  async init() {
    // Load config file
    await this.loadConfig()

    // Validate required settings
    this.validateConfig()

    // Initialize S3 client
    this.initS3Client()

    // Load existing manifest
    await this.loadManifest()

    console.log('✅ Processor initialized')
    console.log(`📋 Sizes: ${this.config.sizes.join(', ')}px`)
    console.log(`📋 Formats: ${this.config.formats.join(', ')}\n`)
  }

  /**
   * Load configuration from file and merge with constructor config
   */
  async loadConfig() {
    // Default configuration
    const defaults = {
      // Paths
      sourcePath: 'public',
      manifestPath: 'public/assets-manifest.json',

      // R2 settings from environment
      bucketName: process.env.R2_BUCKET_NAME,
      accountId: process.env.CF_ACCOUNT_ID,
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,

      // Processing settings
      sizes: [400, 800, 1200], // Mobile-first
      formats: ['webp', 'avif'],
      quality: {
        400: 90, // Mobile: higher quality
        800: 85, // Tablet: balanced
        1200: 80, // Desktop: optimized
      },

      // Features
      enablePlaceholders: false,
      skipUnchanged: true,

      // Hooks
      onProgress: null,
      onError: null,
      beforeUpload: null,
      afterUpload: null,
    }

    // Try to load config file
    let fileConfig = {}
    try {
      const configPath = path.join(process.cwd(), 'assets.config.js')
      const module = await import(configPath)
      fileConfig = module.default || {}
      console.log('📋 Loaded assets.config.js')
    } catch {
      console.log('📋 Using default configuration')
    }

    // Merge: defaults <- file config <- constructor config
    this.config = {
      ...defaults,
      ...fileConfig,
      ...this.config,
    }

    // Build processing rules based on config
    this.buildRules()
  }

  /**
   * Build processing rules from config
   */
  buildRules() {
    this.rules = {
      // Images: use configured formats and sizes
      '.jpg': {
        outputs: this.config.formats,
        sizes: this.config.sizes,
      },
      '.jpeg': {
        outputs: this.config.formats,
        sizes: this.config.sizes,
      },
      '.png': {
        outputs: this.config.formats,
        sizes: this.config.sizes,
      },

      // GIF: WebP only, original size
      '.gif': {
        outputs: ['webp'],
        sizes: ['original'],
      },

      // Keep as-is
      '.svg': {
        outputs: ['svg'],
        sizes: ['original'],
        passthrough: true,
      },
      '.pdf': {
        outputs: ['pdf'],
        sizes: ['original'],
        passthrough: true,
      },

      // Already optimized - skip
      '.webp': { skip: true },
      '.avif': { skip: true },
    }

    // Allow custom rule overrides
    if (this.config.rules) {
      this.rules = { ...this.rules, ...this.config.rules }
    }
  }

  /**
   * Validate configuration
   */
  validateConfig() {
    const required = [
      'accountId',
      'accessKeyId',
      'secretAccessKey',
      'bucketName',
    ]
    const missing = required.filter((key) => !this.config[key])

    if (missing.length > 0) {
      throw new Error(
        `❌ Missing required configuration:\n` +
          `   ${missing.join(', ')}\n\n` +
          `   Set these in your .env file or assets.config.js`
      )
    }

    // Validate sizes and quality match
    for (const size of this.config.sizes) {
      if (!this.config.quality[size]) {
        console.warn(`⚠️  No quality setting for size ${size}, using 85`)
        this.config.quality[size] = 85
      }
    }
  }

  /**
   * Initialize S3 client
   */
  initS3Client() {
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${this.config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
    })
  }

  /**
   * Load existing manifest
   */
  async loadManifest() {
    try {
      const data = await fs.readFile(this.config.manifestPath, 'utf-8')
      this.manifest = JSON.parse(data)
      console.log('📝 Loaded existing manifest')
    } catch {
      console.log('📝 Starting with fresh manifest')
    }
  }

  /**
   * Process all assets
   */
  async processAll() {
    console.log('🚀 Processing assets...\n')

    // Reset stats
    this.stats = { processed: 0, skipped: 0, errors: 0 }

    // Process configured directories
    const directories = [
      { path: 'images', required: false },
      { path: 'documents', required: false },
    ]

    for (const dir of directories) {
      const fullPath = path.join(this.config.sourcePath, dir.path)

      try {
        await fs.access(fullPath)
        await this.processDirectory(fullPath, dir.path)
      } catch {
        if (dir.required) {
          throw new Error(`Required directory not found: ${fullPath}`)
        }
      }
    }

    // Save updated manifest
    await this.saveManifest()

    // Print summary
    this.printSummary()
  }

  /**
   * Process directory recursively
   */
  async processDirectory(dir, basePrefix) {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        await this.processDirectory(fullPath, path.join(basePrefix, entry.name))
      } else if (entry.isFile()) {
        await this.processFile(fullPath, path.join(basePrefix, entry.name))
      }
    }
  }

  /**
   * Process single file
   */
  async processFile(filePath, relativePath) {
    const ext = path.extname(filePath).toLowerCase()
    const rule = this.rules[ext]

    // Skip unsupported files
    if (!rule) {
      this.stats.skipped++
      return
    }

    // Skip if marked
    if (rule.skip) {
      console.log(`⏭️  Skipping: ${relativePath}`)
      this.stats.skipped++
      return
    }

    // Check if unchanged
    if (this.config.skipUnchanged) {
      const hash = await this.getFileHash(filePath)
      const existing = this.manifest.processed[relativePath]

      if (existing?.hash === hash) {
        console.log(`✅ Unchanged: ${relativePath}`)
        this.stats.skipped++
        return
      }
    }

    // Process file
    console.log(`🎨 Processing: ${relativePath}`)

    // Call progress hook
    if (this.config.onProgress) {
      await this.config.onProgress({
        file: relativePath,
        status: 'processing',
      })
    }

    try {
      const outputs = await this.processFileWithRule(
        filePath,
        relativePath,
        rule
      )

      // Update manifest
      const stats = await fs.stat(filePath)
      const hash = await this.getFileHash(filePath)

      this.manifest.processed[relativePath] = {
        hash,
        outputs,
        size: stats.size,
        updated: new Date().toISOString(),
      }

      // Add placeholder if enabled
      if (this.config.enablePlaceholders && this.isImage(ext)) {
        const placeholder = await this.generatePlaceholder(filePath)
        if (placeholder) {
          this.manifest.processed[relativePath].placeholder = placeholder
        }
      }

      this.stats.processed++
      console.log(`   ✅ Created ${outputs.length} versions`)
    } catch (error) {
      this.stats.errors++
      console.error(`   ❌ Error: ${error.message}`)

      // Call error hook
      if (this.config.onError) {
        await this.config.onError({ file: relativePath, error })
      }
    }
  }

  /**
   * Process file according to rule
   */
  async processFileWithRule(filePath, relativePath, rule) {
    const outputs = []

    // Passthrough files (SVG, PDF)
    if (rule.passthrough) {
      const content = await fs.readFile(filePath)
      const uploaded = await this.upload(content, relativePath)
      if (uploaded) outputs.push(relativePath)
      return outputs
    }

    // Process images
    for (const format of rule.outputs) {
      for (const size of rule.sizes) {
        const outputPath = this.getOutputPath(relativePath, size, format)
        const processed = await this.optimizeImage(filePath, size, format)

        if (processed) {
          const uploaded = await this.upload(processed, outputPath)
          if (uploaded) outputs.push(outputPath)
        }
      }
    }

    return outputs
  }

  /**
   * Optimize image
   */
  async optimizeImage(inputPath, size, format) {
    if (size === 'original') {
      return await fs.readFile(inputPath)
    }

    const width = parseInt(size)
    const quality = this.config.quality[width] || 85

    try {
      let pipeline = sharp(inputPath).resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })

      switch (format) {
        case 'webp':
          pipeline = pipeline.webp({ quality, effort: 6 })
          break
        case 'avif':
          pipeline = pipeline.avif({ quality, effort: 6 })
          break
        case 'jpg':
        case 'jpeg':
          pipeline = pipeline.jpeg({ quality, mozjpeg: true })
          break
      }

      return await pipeline.toBuffer()
    } catch (error) {
      console.error(`   ⚠️  Failed to optimize: ${error.message}`)
      return null
    }
  }

  /**
   * Generate placeholder
   */
  async generatePlaceholder(inputPath) {
    try {
      const buffer = await sharp(inputPath)
        .resize(20, 20, { fit: 'inside' })
        .blur(5)
        .webp({ quality: 20 })
        .toBuffer()

      return `data:image/webp;base64,${buffer.toString('base64')}`
    } catch {
      return null
    }
  }

  /**
   * Upload to R2 with hooks
   */
  async upload(content, key) {
    if (!content) return false

    // Before upload hook
    if (this.config.beforeUpload) {
      const shouldContinue = await this.config.beforeUpload({
        key,
        size: content.length,
      })
      if (shouldContinue === false) return false
    }

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.config.bucketName,
          Key: key,
          Body: content,
          ContentType: this.getContentType(key),
          CacheControl: 'public, max-age=31536000, immutable',
        })
      )

      // After upload hook
      if (this.config.afterUpload) {
        await this.config.afterUpload({ key, size: content.length })
      }

      return true
    } catch (error) {
      console.error(`   ❌ Upload failed: ${error.message}`)
      return false
    }
  }

  /**
   * Save manifest
   */
  async saveManifest() {
    // Update storage stats
    this.manifest.storage = await this.getStorageStatus()

    // Write to disk
    await fs.writeFile(
      this.config.manifestPath,
      JSON.stringify(this.manifest, null, 2)
    )
  }

  /**
   * Get R2 storage status
   */
  async getStorageStatus() {
    try {
      const response = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.config.bucketName,
        })
      )

      const used =
        response.Contents?.reduce((sum, obj) => sum + (obj.Size || 0), 0) || 0
      const limit = 10737418240 // 10GB free tier
      const percentage = Math.round((used / limit) * 100)

      return { used, limit, percentage }
    } catch {
      return { used: 0, limit: 10737418240, percentage: 0 }
    }
  }

  /**
   * Print processing summary
   */
  printSummary() {
    console.log('\n' + '='.repeat(50))
    console.log('📊 Processing Summary')
    console.log('='.repeat(50))

    console.log(`✅ Processed: ${this.stats.processed} files`)
    console.log(`⏭️  Skipped: ${this.stats.skipped} files`)

    if (this.stats.errors > 0) {
      console.log(`❌ Errors: ${this.stats.errors} files`)
    }

    // Storage info
    const storage = this.manifest.storage
    const usedGB = (storage.used / 1024 / 1024 / 1024).toFixed(2)
    const limitGB = (storage.limit / 1024 / 1024 / 1024).toFixed(0)

    console.log(
      `\n💾 R2 Storage: ${usedGB}GB / ${limitGB}GB (${storage.percentage}%)`
    )

    // Visual progress bar
    const barLength = 30
    const filled = Math.round((storage.percentage / 100) * barLength)
    const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled)
    console.log(`   [${bar}]`)

    // Warnings
    if (storage.percentage > 90) {
      console.log('\n⛔ CRITICAL: Storage above 90%!')
    } else if (storage.percentage > 80) {
      console.log('\n⚠️  WARNING: Storage above 80%')
    }

    console.log('='.repeat(50))
  }

  // Utility methods

  async getFileHash(filePath) {
    const content = await fs.readFile(filePath)
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 8)
  }

  getOutputPath(relativePath, size, format) {
    if (size === 'original') return relativePath

    const dir = path.dirname(relativePath)
    const name = path.basename(relativePath, path.extname(relativePath))

    return path.join(dir, `${name}-${size}.${format}`)
  }

  getContentType(key) {
    const ext = path.extname(key).toLowerCase()
    const types = {
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
    }
    return types[ext] || 'application/octet-stream'
  }

  isImage(ext) {
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'].includes(ext)
  }
}

export default AssetProcessor
