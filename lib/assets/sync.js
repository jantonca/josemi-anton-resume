#!/usr/bin/env node

/**
 * CLI for asset synchronization
 * Usage: npm run assets:sync
 */

import { AssetProcessor } from './processor.js'

async function main() {
  try {
    const processor = new AssetProcessor()
    await processor.init()
    await processor.processAll()
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// Run
main()