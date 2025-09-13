// scripts/upload-images.js
// Helper script to upload images to R2 bucket

import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mime from 'mime-types'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Configuration - Get these from Cloudflare Dashboard > R2 > Manage R2 API Tokens
const config = {
  accountId: process.env.CF_ACCOUNT_ID || 'your-account-id',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || 'your-access-key',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'your-secret-key',
  bucketName: 'josemianton-com',
}

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
  forcePathStyle: true,
  // Add SSL configuration for Node.js compatibility
  requestHandler: {
    httpsAgent: {
      rejectUnauthorized: true,
    },
  },
})

/**
 * Optimize image before upload
 */
async function optimizeImage(inputPath) {
  const image = sharp(inputPath)
  const metadata = await image.metadata()

  // Don't upscale images
  const maxWidth = 2400
  const maxHeight = 2400

  if (metadata.width > maxWidth || metadata.height > maxHeight) {
    return image
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer()
  }

  // Just optimize without resizing
  return image.jpeg({ quality: 90, progressive: true }).toBuffer()
}

/**
 * Upload a single file to R2
 */
async function uploadFile(localPath, r2Key, optimize = true) {
  try {
    let fileContent
    const ext = path.extname(localPath).toLowerCase()
    const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)

    if (isImage && optimize) {
      console.log(`🎨 Optimizing ${path.basename(localPath)}...`)
      fileContent = await optimizeImage(localPath)
    } else {
      fileContent = fs.readFileSync(localPath)
    }

    const contentType = mime.lookup(localPath) || 'application/octet-stream'

    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: r2Key,
      Body: fileContent,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        'original-name': path.basename(localPath),
      },
    })

    await s3Client.send(command)
    console.log(`✅ Uploaded: ${r2Key}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to upload ${r2Key}:`, error.message)
    return false
  }
}

/**
 * Upload entire directory
 */
async function uploadDirectory(localDir, r2Prefix = '', optimize = true) {
  if (!fs.existsSync(localDir)) {
    console.error(`Directory not found: ${localDir}`)
    return
  }

  const files = fs.readdirSync(localDir)
  let uploaded = 0
  let failed = 0

  for (const file of files) {
    const localPath = path.join(localDir, file)
    const r2Key = r2Prefix ? `${r2Prefix}/${file}` : file

    if (fs.statSync(localPath).isDirectory()) {
      console.log(`\n📁 Entering directory: ${r2Key}`)
      await uploadDirectory(localPath, r2Key, optimize)
    } else {
      const success = await uploadFile(localPath, r2Key, optimize)
      if (success) uploaded++
      else failed++
    }
  }

  if (uploaded > 0 || failed > 0) {
    console.log(
      `\n📊 Stats for ${
        r2Prefix || 'root'
      }: ${uploaded} uploaded, ${failed} failed`
    )
  }
}

/**
 * List all objects in the bucket
 */
async function listBucketContents() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: config.bucketName,
      MaxKeys: 1000,
    })

    const response = await s3Client.send(command)

    if (response.Contents && response.Contents.length > 0) {
      console.log('\n📦 Current bucket contents:')
      response.Contents.forEach((obj) => {
        const size = (obj.Size / 1024).toFixed(2)
        console.log(`  - ${obj.Key} (${size} KB)`)
      })
      console.log(`\nTotal objects: ${response.Contents.length}`)
    } else {
      console.log('\n📦 Bucket is empty')
    }
  } catch (error) {
    console.error('Failed to list bucket contents:', error.message)
  }
}

/**
 * Main upload process
 */
async function main() {
  console.log('🚀 R2 Image Upload Tool\n')
  console.log(`📍 Bucket: ${config.bucketName}`)
  console.log('━'.repeat(50))

  const command = process.argv[2]
  const args = process.argv.slice(3)

  switch (command) {
    case 'upload':
      if (args.length < 2) {
        console.log(
          'Usage: npm run upload:images upload <local-path> <r2-path> [--no-optimize]'
        )
        break
      }
      const optimize = !args.includes('--no-optimize')
      const localPath = args[0]
      const r2Path = args[1]

      if (fs.statSync(localPath).isDirectory()) {
        await uploadDirectory(localPath, r2Path, optimize)
      } else {
        await uploadFile(localPath, r2Path, optimize)
      }
      break

    case 'list':
      await listBucketContents()
      break

    case 'batch':
      // Upload common portfolio directories
      console.log('\n🎯 Batch uploading portfolio images...\n')

      const uploads = [
        { local: './public/images/profile', r2: 'profile' },
        { local: './public/images/projects', r2: 'projects' },
        { local: './public/images/skills', r2: 'skills' },
        { local: './public/images/blog', r2: 'blog' },
      ]

      for (const { local, r2 } of uploads) {
        if (fs.existsSync(local)) {
          console.log(`\n📤 Uploading ${local} → ${r2}/`)
          await uploadDirectory(local, r2)
        }
      }

      console.log('\n✨ Batch upload complete!')
      await listBucketContents()
      break

    default:
      console.log(`
📖 R2 Upload Tool Commands:

  npm run upload:images upload <path> <r2-key>   Upload file or directory
  npm run upload:images list                     List bucket contents  
  npm run upload:images batch                    Upload all portfolio directories

Examples:
  npm run upload:images upload ./image.jpg profile/avatar.jpg
  npm run upload:images upload ./public/images projects --no-optimize
  npm run upload:images batch
      `)
  }
}

// Run the script
main().catch(console.error)
