#!/usr/bin/env node

/**
 * Development Images Helper
 * Downloads images from R2 for local development
 *
 * Usage:
 *   pnpm run dev:images        # Interactive mode
 *   pnpm run dev:images:pull   # Download all images
 *   pnpm run dev:images:check  # Check what's missing
 */

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import fs from 'fs/promises'
import path from 'path'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import readline from 'readline/promises'

/** R2 stores directory markers as zero-byte keys ending in `/`. */
function isDirectoryMarker(key) {
  return typeof key === 'string' && key.endsWith('/')
}

class DevImagesManager {
  constructor() {
    // Initialize S3 client for R2
    const accountId = process.env.CF_ACCOUNT_ID
    const accessKeyId = process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
    const bucketName = process.env.R2_BUCKET_NAME

    if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
      console.error('❌ Missing R2 credentials in environment variables')
      console.log('Please ensure your .env file contains:')
      console.log(
        '  CF_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME'
      )
      process.exit(1)
    }

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })

    this.bucketName = bucketName
    this.localImagesPath = path.join(process.cwd(), 'public', 'images')
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }

  /**
   * List all original images in R2 (not processed versions)
   */
  async listR2Images() {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: 'images/',
      })

      const response = await this.s3Client.send(command)
      const files = response.Contents || []

      // Filter to only original images (not -400, -800, -1200 versions)
      const originals = files
        .map((file) => file.Key)
        .filter((key) => {
          // R2 stores directories as zero-byte keys ending in `/`. The
          // extension test below already excludes them, but only incidentally —
          // make it explicit so widening the format list cannot reintroduce it.
          if (isDirectoryMarker(key)) return false
          // Skip processed versions
          if (/-\d+\.(webp|avif)$/.test(key)) return false
          // Include original formats
          return /\.(jpg|jpeg|png|gif|svg)$/i.test(key)
        })
        .map((key) => key.replace('images/', ''))

      return [...new Set(originals)] // Remove duplicates
    } catch (error) {
      console.error('❌ Failed to list R2 images:', error.message)
      return []
    }
  }

  /**
   * List local images
   */
  async listLocalImages() {
    try {
      await fs.mkdir(this.localImagesPath, { recursive: true })
      const files = await fs.readdir(this.localImagesPath)
      return files.filter((file) =>
        /\.(jpg|jpeg|png|gif|svg|webp|avif)$/i.test(file)
      )
    } catch {
      return []
    }
  }

  /**
   * Download a single image from R2
   */
  async downloadImage(filename) {
    try {
      if (isDirectoryMarker(filename)) {
        throw new Error(`Refusing to download directory marker: ${filename}`)
      }

      const localPath = path.join(this.localImagesPath, filename)

      // Ensure the directory exists before fetching. An unconsumed response
      // body keeps its socket checked out of the SDK pool, so leaking enough of
      // them stalls every later request.
      await fs.mkdir(path.dirname(localPath), { recursive: true })

      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: `images/${filename}`,
      })

      const response = await this.s3Client.send(command)

      try {
        const writeStream = createWriteStream(localPath)
        await pipeline(response.Body, writeStream)
      } catch (error) {
        response.Body?.destroy?.()
        throw error
      }

      return true
    } catch (error) {
      console.error(`❌ Failed to download ${filename}:`, error.message)
      return false
    }
  }

  /**
   * Check status of local vs R2 images
   */
  async checkStatus() {
    console.log('🔍 Checking image status...\n')

    const r2Images = await this.listR2Images()
    const localImages = await this.listLocalImages()

    const r2Set = new Set(r2Images)
    const localSet = new Set(localImages)

    const missing = r2Images.filter((img) => !localSet.has(img))
    const extra = localImages.filter((img) => !r2Set.has(img))

    console.log(`📊 Status Report:`)
    console.log(`   R2 Images: ${r2Images.length}`)
    console.log(`   Local Images: ${localImages.length}`)
    console.log(`   Missing Locally: ${missing.length}`)
    console.log(`   Extra Locally: ${extra.length}`)

    if (missing.length > 0) {
      console.log('\n📥 Missing images (available in R2):')
      missing.forEach((img) => console.log(`   - ${img}`))
    }

    if (extra.length > 0) {
      console.log('\n📤 Extra local images (not in R2):')
      extra.forEach((img) => console.log(`   - ${img}`))
    }

    return { r2Images, localImages, missing, extra }
  }

  /**
   * Pull all missing images from R2
   */
  async pullAll() {
    const { missing } = await this.checkStatus()

    if (missing.length === 0) {
      console.log('\n✅ All images are already synchronized!')
      return
    }

    console.log(`\n📥 Downloading ${missing.length} images from R2...`)

    let downloaded = 0
    let failed = 0

    for (const filename of missing) {
      process.stdout.write(`   Downloading ${filename}...`)
      const success = await this.downloadImage(filename)
      if (success) {
        downloaded++
        console.log(' ✅')
      } else {
        failed++
        console.log(' ❌')
      }
    }

    console.log(`\n✨ Download complete!`)
    console.log(`   Success: ${downloaded}`)
    console.log(`   Failed: ${failed}`)
  }

  /**
   * Interactive mode
   */
  async interactive() {
    console.log('🖼️  Development Images Manager\n')

    const { missing } = await this.checkStatus()

    if (missing.length === 0) {
      console.log('\n✅ All images are synchronized!')
      this.rl.close()
      return
    }

    console.log('\nOptions:')
    console.log('1. Download all missing images')
    console.log('2. Select specific images to download')
    console.log('3. Exit')

    const choice = await this.rl.question('\nYour choice (1-3): ')

    switch (choice) {
      case '1':
        await this.pullAll()
        break

      case '2':
        await this.selectiveDownload(missing)
        break

      default:
        console.log('Goodbye!')
    }

    this.rl.close()
  }

  /**
   * Selective download
   */
  async selectiveDownload(missing) {
    console.log('\n📋 Select images to download (comma-separated numbers):\n')

    missing.forEach((img, i) => {
      console.log(`${i + 1}. ${img}`)
    })

    const input = await this.rl.question('\nEnter numbers (e.g., 1,3,5): ')
    const indices = input.split(',').map((n) => parseInt(n.trim()) - 1)

    const toDownload = indices
      .filter((i) => i >= 0 && i < missing.length)
      .map((i) => missing[i])

    if (toDownload.length === 0) {
      console.log('No valid selections')
      return
    }

    console.log(`\n📥 Downloading ${toDownload.length} images...`)

    for (const filename of toDownload) {
      process.stdout.write(`   Downloading ${filename}...`)
      const success = await this.downloadImage(filename)
      console.log(success ? ' ✅' : ' ❌')
    }

    console.log('\n✨ Download complete!')
  }

  async cleanup() {
    this.rl.close()
  }
}

// Main execution
async function main() {
  const manager = new DevImagesManager()

  const command = process.argv[2]

  try {
    switch (command) {
      case 'check':
        await manager.checkStatus()
        break

      case 'pull':
        await manager.pullAll()
        break

      default:
        await manager.interactive()
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await manager.cleanup()
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { DevImagesManager }
