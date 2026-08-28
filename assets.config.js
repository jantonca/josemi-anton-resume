/**
 * R2 Asset Processing Configuration
 *
 * Shared by the asset processor (lib/assets) and the Worker bundle
 * (workers/r2-response.js) so generated variant keys, format negotiation,
 * and Save-Data downgrades stay aligned with the component srcsets
 * (400 / 800 / 1200).
 */

// Responsive widths mirrored by R2Image.astro / R2Picture.astro srcsets.
export const IMAGE_VARIANT_SIZES = [400, 800, 1200]

export default {
  // Source paths
  sourcePath: 'public',
  manifestPath: 'public/assets-manifest.json',

  // Quality settings per format and size (current production values)
  quality: {
    webp: { 400: 90, 800: 85, 1200: 80, original: 80 },
    avif: { 400: 75, 800: 65, 1200: 55, original: 55 },
  },

  // Features
  // Placeholders stay disabled: no component consumes the manifest data yet.
  enablePlaceholders: false,
  skipUnchanged: true,

  // Additional directories to scan (beyond images, documents)
  // directories: ['downloads'],

  // Custom processing rules
  rules: {
    '.jpg': { outputs: ['webp', 'avif'], sizes: IMAGE_VARIANT_SIZES },
    '.jpeg': { outputs: ['webp', 'avif'], sizes: IMAGE_VARIANT_SIZES },
    '.png': { outputs: ['webp', 'avif'], sizes: IMAGE_VARIANT_SIZES },
    '.gif': { outputs: ['webp'], sizes: ['original'] },
    '.svg': { outputs: ['svg'], sizes: ['original'], optimize: true },
    '.pdf': { outputs: ['pdf'], sizes: ['original'], generatePlaceholder: false },
    // Already-optimized sources are passed over, matching the original
    // pipeline (the canonical template re-sizes these instead). Sizes stay
    // declared so the Worker can derive variant fallbacks for these keys.
    '.webp': { skip: true, sizes: IMAGE_VARIANT_SIZES },
    '.avif': { skip: true, sizes: IMAGE_VARIANT_SIZES },
  },
}
