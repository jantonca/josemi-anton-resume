/**
 * Enhanced Cloudflare Worker for Smart Image Serving
 * Features: Format negotiation, quality hints, smart fallbacks
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // Route to appropriate handler
    if (
      url.hostname === 'cdn.josemianton.com' ||
      url.pathname.startsWith('/images/')
    ) {
      return handleImageRequest(request, env, ctx)
    }

    // Serve static assets (Astro site)
    return env.ASSETS.fetch(request)
  },
}

async function handleImageRequest(request, env, ctx) {
  const url = new URL(request.url)
  const accept = request.headers.get('Accept') || ''
  const saveData = request.headers.get('Save-Data') === 'on'
  const dpr = parseFloat(request.headers.get('DPR') || '1')
  const viewportWidth = parseInt(
    request.headers.get('Viewport-Width') || '1920'
  )

  // Extract image path
  let imagePath = url.pathname.startsWith('/images/')
    ? url.pathname.substring(1)
    : `images${url.pathname}`

  // Smart format selection based on Accept header
  const supportedFormats = {
    avif: accept.includes('image/avif'),
    webp: accept.includes('image/webp'),
  }

  // Try to upgrade format if not specified
  if (!imagePath.endsWith('.avif') && !imagePath.endsWith('.webp')) {
    imagePath = await selectBestFormat(imagePath, supportedFormats, env)
  }

  // Adjust quality based on Save-Data
  if (saveData && imagePath.match(/-(\d+)\.(webp|avif)$/)) {
    // Downgrade to smaller size if Save-Data is on
    imagePath = imagePath.replace(/-1200\./, '-800.').replace(/-800\./, '-400.')
  }

  // Try to fetch the image
  const response = await fetchWithFallback(imagePath, env, supportedFormats)

  if (!response) {
    return new Response('Image not found', { status: 404 })
  }

  // Add performance headers
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  headers.set('CDN-Cache-Control', 'max-age=31536000')
  headers.set('Vary', 'Accept, Save-Data')
  headers.set('X-Content-Type-Options', 'nosniff')

  // Add hints for client
  if (saveData) {
    headers.set('X-Save-Data', 'on')
  }

  return new Response(response.body, {
    status: response.status,
    headers,
  })
}

/**
 * Select best format based on browser support
 */
async function selectBestFormat(imagePath, supportedFormats, env) {
  // Remove any existing extension
  const basePath = imagePath.replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, '')

  // Extract size if present (e.g., profile-800 -> size is 800)
  const sizeMatch = basePath.match(/-(\d+)$/)
  const size = sizeMatch ? sizeMatch[1] : '800'

  // Try formats in order of preference
  if (supportedFormats.avif) {
    const avifPath = `${basePath}.avif`
    const exists = await checkIfExists(avifPath, env)
    if (exists) return avifPath

    // Try with size
    const avifSizePath = basePath.replace(/-\d+$/, '') + `-${size}.avif`
    if (await checkIfExists(avifSizePath, env)) return avifSizePath
  }

  if (supportedFormats.webp) {
    const webpPath = `${basePath}.webp`
    const exists = await checkIfExists(webpPath, env)
    if (exists) return webpPath

    // Try with size
    const webpSizePath = basePath.replace(/-\d+$/, '') + `-${size}.webp`
    if (await checkIfExists(webpSizePath, env)) return webpSizePath
  }

  // Fallback to original
  return imagePath
}

/**
 * Fetch with intelligent fallback
 */
async function fetchWithFallback(imagePath, env, supportedFormats) {
  // Try exact path first
  let object = await env.IMAGES_BUCKET.get(imagePath)
  if (object) return object

  // Extract base name and size
  const match = imagePath.match(
    /^(.+?)(?:-(\d+))?\.(webp|avif|jpe?g|png|gif|svg)$/i
  )
  if (!match) return null

  const [, baseName, size, format] = match
  const baseWithFolder = baseName // Keep folder structure

  // Fallback chain
  const fallbacks = []

  // If AVIF failed, try WebP
  if (format === 'avif' && supportedFormats.webp) {
    fallbacks.push(`${baseName}${size ? `-${size}` : ''}.webp`)
  }

  // Try different sizes (mobile-first fallback)
  if (size) {
    const sizes = [400, 800, 1200]
    const currentSize = parseInt(size)

    // Find next smaller size
    for (const s of sizes) {
      if (s < currentSize) {
        fallbacks.push(`${baseName}-${s}.${format}`)
        if (format === 'avif' && supportedFormats.webp) {
          fallbacks.push(`${baseName}-${s}.webp`)
        }
      }
    }
  }

  // Try original without size
  fallbacks.push(`${baseName}.jpg`, `${baseName}.jpeg`, `${baseName}.png`)

  // Try each fallback
  for (const fallback of fallbacks) {
    object = await env.IMAGES_BUCKET.get(fallback)
    if (object) {
      console.log(`Fallback used: ${imagePath} -> ${fallback}`)
      return object
    }
  }

  return null
}

/**
 * Check if a file exists in R2
 */
async function checkIfExists(path, env) {
  try {
    const object = await env.IMAGES_BUCKET.head(path)
    return object !== null
  } catch {
    return false
  }
}
