#!/usr/bin/env node

// Image Optimization and Upload Tool for R2
// This script optimizes images before uploading to R2

import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// R2 Configuration
const config = {
  accountId: process.env.CF_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucketName: 'josemianton-com',
}

// Validate configuration
if (!config.accountId || !config.accessKeyId || !config.secretAccessKey) {
  console.error('❌ Missing environment variables. Please set:')
  console.error('   CF_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY')
  process.exit(1)
}

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
})

/**
 * Optimize image with multiple formats and sizes
 */
async function optimizeImage(inputPath, outputDir) {
  const fileName = path.parse(inputPath).name
  const optimizedFiles = []

  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()

    console.log(
      `📊 Original: ${metadata.width}x${metadata.height}, ${(
        metadata.size / 1024
      ).toFixed(2)}KB`
    )

    // Define size variants
    const sizes = [
      { width: 400, suffix: '-sm' },
      { width: 800, suffix: '-md' },
      { width: 1200, suffix: '-lg' },
      { width: 1920, suffix: '-xl' },
    ].filter((size) => size.width <= metadata.width) // Don't upscale

    // Add original size if not covered
    if (!sizes.find((s) => s.width === metadata.width)) {
      sizes.push({ width: metadata.width, suffix: '' })
    }

    // Generate optimized versions
    for (const size of sizes) {
      // WebP version (best compression)
      const webpPath = path.join(outputDir, `${fileName}${size.suffix}.webp`)
      await image
        .resize(size.width, null, { withoutEnlargement: true })
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath)

      const webpStats = fs.statSync(webpPath)
      console.log(
        `✅ ${path.basename(webpPath)}: ${(webpStats.size / 1024).toFixed(2)}KB`
      )
      optimizedFiles.push({ path: webpPath, format: 'webp', width: size.width })

      // AVIF version (even better compression, newer format)
      const avifPath = path.join(outputDir, `${fileName}${size.suffix}.avif`)
      await image
        .resize(size.width, null, { withoutEnlargement: true })
        .avif({ quality: 75, effort: 6 })
        .toFile(avifPath)

      const avifStats = fs.statSync(avifPath)
      console.log(
        `✅ ${path.basename(avifPath)}: ${(avifStats.size / 1024).toFixed(2)}KB`
      )
      optimizedFiles.push({ path: avifPath, format: 'avif', width: size.width })

      // JPEG version (fallback for older browsers)
      const jpegPath = path.join(outputDir, `${fileName}${size.suffix}.jpg`)
      await image
        .resize(size.width, null, { withoutEnlargement: true })
        .jpeg({ quality: 85, progressive: true })
        .toFile(jpegPath)

      const jpegStats = fs.statSync(jpegPath)
      console.log(
        `✅ ${path.basename(jpegPath)}: ${(jpegStats.size / 1024).toFixed(2)}KB`
      )
      optimizedFiles.push({ path: jpegPath, format: 'jpeg', width: size.width })
    }

    return optimizedFiles
  } catch (error) {
    console.error(`❌ Failed to optimize ${inputPath}:`, error.message)
    return []
  }
}

/**
 * Upload file to R2
 */
async function uploadToR2(filePath, r2Key) {
  try {
    const fileContent = fs.readFileSync(filePath)
    const ext = path.extname(filePath).toLowerCase()

    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
      '.png': 'image/png',
    }

    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: r2Key,
      Body: fileContent,
      ContentType: contentTypes[ext] || 'application/octet-stream',
      CacheControl: 'public, max-age=31536000, immutable',
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        optimized: 'true',
      },
    })

    await s3Client.send(command)
    console.log(`📤 Uploaded: ${r2Key}`)
    return true
  } catch (error) {
    console.error(`❌ Upload failed for ${r2Key}:`, error.message)
    return false
  }
}

/**
 * Process and upload image
 */
async function processImage(inputPath, r2BasePath = '') {
  const fileName = path.parse(inputPath).name
  const tempDir = path.join(__dirname, '../temp')

  // Create temp directory
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  console.log(`\n🎨 Processing: ${path.basename(inputPath)}`)

  // Optimize image
  const optimizedFiles = await optimizeImage(inputPath, tempDir)

  if (optimizedFiles.length === 0) {
    console.log('❌ No optimized files generated')
    return
  }

  // Upload optimized versions
  console.log('\n📤 Uploading to R2...')
  let uploaded = 0

  for (const file of optimizedFiles) {
    const r2Key = r2BasePath
      ? `${r2BasePath}/${path.basename(file.path)}`
      : path.basename(file.path)

    const success = await uploadToR2(file.path, r2Key)
    if (success) uploaded++

    // Clean up temp file
    fs.unlinkSync(file.path)
  }

  console.log(
    `\n✨ Uploaded ${uploaded}/${optimizedFiles.length} files for ${fileName}`
  )
}

/**
 * List R2 bucket contents
 */
async function listBucket() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: config.bucketName,
      MaxKeys: 1000,
    })

    const response = await s3Client.send(command)

    if (response.Contents && response.Contents.length > 0) {
      console.log('\n📦 R2 Bucket Contents:')

      // Group by base name
      const grouped = {}
      response.Contents.forEach((obj) => {
        const baseName = obj.Key.replace(
          /(-sm|-md|-lg|-xl)?\.(webp|avif|jpg|jpeg|png|svg)$/,
          ''
        )
        if (!grouped[baseName]) grouped[baseName] = []
        grouped[baseName].push(obj)
      })

      Object.entries(grouped).forEach(([baseName, files]) => {
        console.log(`\n📁 ${baseName}:`)
        files.forEach((file) => {
          const size = (file.Size / 1024).toFixed(2)
          const format = path.extname(file.Key).substring(1)
          console.log(`   ${file.Key} (${size} KB, ${format})`)
        })
      })

      console.log(`\nTotal: ${response.Contents.length} files`)
    } else {
      console.log('\n📦 Bucket is empty')
    }
  } catch (error) {
    console.error('❌ Failed to list bucket:', error.message)
  }
}

/**
 * Main function
 */
async function main() {
  const command = process.argv[2]
  const args = process.argv.slice(3)

  console.log('🚀 R2 Image Optimization Tool')
  console.log(`📍 Bucket: ${config.bucketName}`)
  console.log('━'.repeat(50))

  switch (command) {
    case 'add':
      if (args.length < 1) {
        console.log(
          'Usage: node optimize-images.js add <image-path> [r2-folder]'
        )
        console.log(
          'Example: node optimize-images.js add ./profile.jpg profile'
        )
        break
      }

      const imagePath = args[0]
      const r2Folder = args[1] || ''

      if (!fs.existsSync(imagePath)) {
        console.error(`❌ File not found: ${imagePath}`)
        break
      }

      await processImage(imagePath, r2Folder)
      break

    case 'list':
      await listBucket()
      break

    case 'batch':
      console.log('🔄 Processing all images in public/images...')
      const imagesDir = path.join(process.cwd(), 'public/images')

      if (!fs.existsSync(imagesDir)) {
        console.error(`❌ Directory not found: ${imagesDir}`)
        break
      }

      const files = fs
        .readdirSync(imagesDir)
        .filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file))
        .map((file) => path.join(imagesDir, file))

      for (const file of files) {
        await processImage(file)
      }

      console.log(`\n🎉 Processed ${files.length} images`)
      break

    default:
      console.log(`
📖 Commands:

  add <image> [folder]    Optimize and upload image
  list                    Show bucket contents
  batch                   Process all images in public/images/

Examples:
  node optimize-images.js add ./my-photo.jpg profile
  node optimize-images.js add ./project-screenshot.png projects  
  node optimize-images.js batch
  node optimize-images.js list
      `)
  }
}

main().catch(console.error)
