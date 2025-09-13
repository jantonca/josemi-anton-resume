#!/usr/bin/env node

/**
 * Setup script for R2 Asset Processor
 * Helps configure the asset processor in a new project
 */

import fs from 'fs/promises'
import path from 'path'
import { createInterface } from 'readline/promises'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

async function setup() {
  console.log('🚀 R2 Asset Processor Setup\n')

  // Check if we're in the right place
  try {
    await fs.access('package.json')
  } catch {
    console.error('❌ No package.json found. Please run this from your project root.')
    process.exit(1)
  }

  // Create directories
  console.log('📁 Creating directories...')
  await fs.mkdir('public/images', { recursive: true })
  await fs.mkdir('public/documents', { recursive: true })
  console.log('   ✅ Created public/images/ and public/documents/')

  // Check for .env file
  let envExists = false
  try {
    await fs.access('.env')
    envExists = true
    console.log('   ℹ️  .env file already exists')
  } catch {
    console.log('   📝 Creating .env file...')
  }

  // Get configuration
  if (!envExists) {
    console.log('\n📋 Configuration:')
    const accountId = await rl.question('CF_ACCOUNT_ID: ')
    const accessKey = await rl.question('R2_ACCESS_KEY_ID: ')
    const secretKey = await rl.question('R2_SECRET_ACCESS_KEY: ')
    const bucketName = await rl.question('R2_BUCKET_NAME: ')

    // Create .env file
    const envContent = `# Cloudflare R2 Configuration
CF_ACCOUNT_ID=${accountId}
R2_ACCESS_KEY_ID=${accessKey}
R2_SECRET_ACCESS_KEY=${secretKey}
R2_BUCKET_NAME=${bucketName}
`
    await fs.writeFile('.env', envContent)
    console.log('   ✅ Created .env file')
  }

  // Update .gitignore
  try {
    const gitignore = await fs.readFile('.gitignore', 'utf-8')
    if (!gitignore.includes('.env')) {
      await fs.appendFile('.gitignore', '\n# Environment variables\n.env\n')
      console.log('   ✅ Added .env to .gitignore')
    }
    if (!gitignore.includes('assets-manifest.json')) {
      await fs.appendFile('.gitignore', '\n# Asset manifest\npublic/assets-manifest.json\n')
      console.log('   ✅ Added manifest to .gitignore')
    }
  } catch {
    // No .gitignore, create one
    await fs.writeFile('.gitignore', `# Environment variables
.env

# Asset manifest
public/assets-manifest.json

# Node modules
node_modules/
`)
    console.log('   ✅ Created .gitignore')
  }

  // Update package.json
  console.log('\n📦 Updating package.json...')
  const pkg = JSON.parse(await fs.readFile('package.json', 'utf-8'))
  
  if (!pkg.scripts) pkg.scripts = {}
  
  pkg.scripts['assets:sync'] = 'export $(grep -v \"^#\" .env | xargs) && node lib/assets/sync.js'
  pkg.scripts['assets:status'] = 'export $(grep -v \"^#\" .env | xargs) && node lib/assets/status.js'
  
  await fs.writeFile('package.json', JSON.stringify(pkg, null, 2))
  console.log('   ✅ Added npm scripts')

  // Installation instructions
  console.log('\n✨ Setup complete!\n')
  console.log('📋 Next steps:')
  console.log('   1. Install dependencies:')
  console.log('      npm install sharp @aws-sdk/client-s3')
  console.log('')
  console.log('   2. Add images to public/images/')
  console.log('')
  console.log('   3. Run asset sync:')
  console.log('      npm run assets:sync')
  console.log('')
  console.log('   4. Check storage status:')
  console.log('      npm run assets:status')

  rl.close()
}

setup().catch(error => {
  console.error('❌ Setup failed:', error.message)
  rl.close()
  process.exit(1)
})