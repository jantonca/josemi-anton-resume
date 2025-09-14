#!/usr/bin/env node

import { AssetProcessor } from './processor.js'

async function main() {
  try {
    const processor = new AssetProcessor()

    // Initialize loads config and sets everything up
    await processor.init()

    // Process all assets
    await processor.processAll()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()
