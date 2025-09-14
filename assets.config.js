/**
 * Asset Processing Configuration
 * Place this file in your project root as assets.config.js
 */

export default {
  // Image sizes (mobile-first approach)
  sizes: [400, 800, 1200],

  // Output formats
  formats: ['webp', 'avif'],

  // Quality per size (higher quality for smaller images)
  quality: {
    400: 90, // Mobile: Small file, high quality
    800: 85, // Tablet: Balanced
    1200: 80, // Desktop: Larger file, optimize more
  },

  // Optional features
  enablePlaceholders: false, // Generate base64 placeholders
  skipUnchanged: true, // Skip files that haven't changed

  // Optional: Custom processing rules
  // rules: {
  //   '.png': { outputs: ['webp'], sizes: [400, 800] },  // PNG to WebP only
  //   '.ico': { skip: true }  // Skip favicon files
  // },

  // Optional: Hooks for advanced usage
  // onProgress: ({ file, status }) => {
  //   console.log(`Processing ${file}: ${status}`)
  // },

  // onError: ({ file, error }) => {
  //   console.error(`Error with ${file}:`, error.message)
  // }
}
