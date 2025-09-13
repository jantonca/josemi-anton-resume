/**
 * Simple Asset Processor for R2
 * Mirrors local folder structure in R2 bucket
 * 
 * @module AssetProcessor
 * @description Reusable asset optimization and upload system for Cloudflare R2
 */

import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

// Simple types - documented via JSDoc comments

/**
 * Main asset processor - keeps it simple
 * @class AssetProcessor
 * @description Handles image optimization and R2 uploads with manifest tracking
 */
export class AssetProcessor {
  /** @type {import('@aws-sdk/client-s3').S3Client} */
  s3Client
  
  /** @type {string} */
  bucketName
  
  /** @type {string} */
  manifestPath
  
  /** @type {{processed: Object, storage: {used: number, limit: number, percentage: number}}} */
  manifest
  // Simple processing rules - no complex matrices
  RULES = {
    '.jpg': { outputs: ['webp', 'avif'], sizes: [800, 1600] },
    '.jpeg': { outputs: ['webp', 'avif'], sizes: [800, 1600] },
    '.png': { outputs: ['webp', 'avif'], sizes: [800, 1600] },
    '.gif': { outputs: ['webp'], sizes: ['original'] },
    '.svg': { outputs: ['svg'], sizes: ['original'], optimize: true },
    '.pdf': { outputs: ['pdf'], sizes: ['original'], compress: true },
    '.webp': { skip: true, outputs: [], sizes: [] },
    '.avif': { skip: true, outputs: [], sizes: [] }
  }

  constructor() {
    // Validate environment variables
    const accountId = process.env.CF_ACCOUNT_ID
    const accessKeyId = process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error(
        '❌ Missing R2 credentials. Please set CF_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY'
      )
    }

    // Initialize S3 client for R2
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    })

    // Get bucket name from environment - REQUIRED
    this.bucketName = process.env.R2_BUCKET_NAME
    if (!this.bucketName) {
      throw new Error('❌ Missing R2_BUCKET_NAME environment variable')
    }
    this.manifestPath = path.join(process.cwd(), 'public', 'assets-manifest.json')
    this.manifest = { 
      processed: {}, 
      storage: { used: 0, limit: 10737418240, percentage: 0 } 
    }
  }

  /**
   * Initialize - load existing manifest if it exists
   */
  async init() {
    try {
      const data = await fs.readFile(this.manifestPath, 'utf-8')
      this.manifest = JSON.parse(data)
    } catch {
      // No manifest yet, use default
      console.log('📝 Creating new manifest')
    }
  }

  /**
   * Process all assets in public/images and public/documents
   */
  async processAll() {
    console.log('🚀 Starting asset processing...\n')

    // Process images
    const imagesDir = path.join(process.cwd(), 'public', 'images')
    if (await this.directoryExists(imagesDir)) {
      await this.processDirectory(imagesDir, 'images')
    }

    // Process documents
    const docsDir = path.join(process.cwd(), 'public', 'documents')
    if (await this.directoryExists(docsDir)) {
      await this.processDirectory(docsDir, 'documents')
    }

    // Update storage info
    await this.updateStorageInfo()
    
    // Save manifest
    await this.saveManifest()

    console.log('\n✨ Processing complete!')
    this.printStorageStatus()
  }

  /**
   * Process a directory recursively
   */
  async processDirectory(dir, basePrefix) {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        // Recursively process subdirectories
        const newPrefix = path.join(basePrefix, entry.name)
        await this.processDirectory(fullPath, newPrefix)
      } else if (entry.isFile()) {
        // Process file
        const relativePath = path.join(basePrefix, entry.name)
        await this.processFile(fullPath, relativePath)
      }
    }
  }

  /**
   * Process a single file
   */
  async processFile(filePath, relativePath) {
    const ext = path.extname(filePath).toLowerCase()
    const rule = this.RULES[ext]

    if (!rule) {
      console.log(`⏭️  Skipping unsupported: ${relativePath}`)
      return
    }

    if (rule.skip) {
      console.log(`⏭️  Skipping optimized: ${relativePath}`)
      return
    }

    // Check if file has changed
    const hash = await this.getFileHash(filePath)
    const existing = this.manifest.processed[relativePath]
    
    if (existing && existing.hash === hash) {
      console.log(`✅ Unchanged: ${relativePath}`)
      return
    }

    console.log(`🎨 Processing: ${relativePath}`)

    // Process based on file type
    const outputs = []
    
    if (ext === '.svg') {
      // For SVG, just optimize and upload as-is
      const optimized = await this.optimizeSVG(filePath)
      const uploaded = await this.uploadToR2(optimized, relativePath)
      if (uploaded) outputs.push(relativePath)
    } else if (ext === '.pdf') {
      // For PDF, compress and upload
      const compressed = await this.compressPDF(filePath)
      const uploaded = await this.uploadToR2(compressed, relativePath)
      if (uploaded) outputs.push(relativePath)
    } else {
      // For images, create multiple formats and sizes
      for (const format of rule.outputs) {
        for (const size of rule.sizes) {
          const outputPath = this.getOutputPath(relativePath, size, format)
          const processed = await this.optimizeImage(filePath, size, format)
          
          if (processed) {
            const uploaded = await this.uploadToR2(processed, outputPath)
            if (uploaded) outputs.push(outputPath)
          }
        }
      }
    }

    // Update manifest
    const stats = await fs.stat(filePath)
    this.manifest.processed[relativePath] = {
      hash,
      outputs,
      size: stats.size,
      updated: new Date().toISOString()
    }

    console.log(`   ✅ Created ${outputs.length} versions`)
  }

  /**
   * Optimize an image with Sharp
   */
  async optimizeImage(inputPath, size, format) {
    try {
      let pipeline = sharp(inputPath)

      // Resize if not original
      if (size !== 'original') {
        pipeline = pipeline.resize(size, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
      }

      // Convert to format
      if (format === 'webp') {
        pipeline = pipeline.webp({ quality: 85, effort: 6 })
      } else if (format === 'avif') {
        pipeline = pipeline.avif({ quality: 80, effort: 6 })
      }

      return await pipeline.toBuffer()
    } catch (error) {
      console.error(`   ❌ Failed to optimize: ${error instanceof Error ? error.message : String(error)}`)
      return null
    }
  }

  /**
   * Optimize SVG (placeholder - would use SVGO)
   */
  async optimizeSVG(inputPath) {
    // For now, just read the file
    // In production, would use SVGO for optimization
    return await fs.readFile(inputPath)
  }

  /**
   * Compress PDF (placeholder - would use Ghostscript)
   */
  async compressPDF(inputPath) {
    // For now, just read the file
    // In production, would use Ghostscript for compression
    return await fs.readFile(inputPath)
  }

  /**
   * Upload file to R2
   */
  async uploadToR2(content, key) {
    try {
      const contentType = this.getContentType(key)
      
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: content,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable'
      }))

      console.log(`   📤 Uploaded: ${key}`)
      return true
    } catch (error) {
      console.error(`   ❌ Upload failed: ${error instanceof Error ? error.message : String(error)}`)
      return false
    }
  }

  /**
   * Get file hash for change detection
   */
  async getFileHash(filePath) {
    const content = await fs.readFile(filePath)
    return crypto.createHash('md5').update(content).digest('hex')
  }

  /**
   * Get output path for processed file
   */
  getOutputPath(originalPath, size, format) {
    if (size === 'original') {
      return originalPath.replace(/\.[^.]+$/, `.${format}`)
    }
    
    const dir = path.dirname(originalPath)
    const name = path.basename(originalPath, path.extname(originalPath))
    return path.join(dir, `${name}-${size}.${format}`)
  }

  /**
   * Get content type for file
   */
  getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase()
    const types = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf'
    }
    return types[ext] || 'application/octet-stream'
  }

  /**
   * Update storage information from R2
   */
  async updateStorageInfo() {
    try {
      const response = await this.s3Client.send(new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 1000
      }))

      let totalSize = 0
      if (response.Contents) {
        totalSize = response.Contents.reduce((sum, obj) => sum + (obj.Size || 0), 0)
      }

      this.manifest.storage.used = totalSize
      this.manifest.storage.percentage = Math.round((totalSize / this.manifest.storage.limit) * 100)
    } catch (error) {
      console.error('Failed to get storage info:', error instanceof Error ? error.message : String(error))
    }
  }

  /**
   * Save manifest to disk
   */
  async saveManifest() {
    const json = JSON.stringify(this.manifest, null, 2)
    await fs.writeFile(this.manifestPath, json, 'utf-8')
    console.log('💾 Manifest saved')
  }

  /**
   * Print storage status
   */
  printStorageStatus() {
    const { used, limit, percentage } = this.manifest.storage
    const usedGB = (used / 1024 / 1024 / 1024).toFixed(2)
    const limitGB = (limit / 1024 / 1024 / 1024).toFixed(0)
    
    console.log('\n📊 Storage Status:')
    console.log(`   Used: ${usedGB} GB / ${limitGB} GB (${percentage}%)`)
    
    if (percentage > 80) {
      console.log('   ⚠️  WARNING: Storage usage above 80%!')
    }
  }

  /**
   * Check if directory exists
   */
  async directoryExists(dirPath) {
    try {
      const stats = await fs.stat(dirPath)
      return stats.isDirectory()
    } catch {
      return false
    }
  }

  /**
   * Get storage status (for external use)
   */
  async getStorageStatus() {
    await this.updateStorageInfo()
    return this.manifest.storage
  }
}