/**
 * Cloudflare Worker for josemianton.com
 * Hybrid delivery: static site from [assets], images from R2 (IMAGES_BUCKET).
 *
 * Image features: format negotiation, Save-Data downgrade, size fallbacks,
 * directory-marker protection. Response hardening lives in
 * workers/r2-response.js, aligned with the canonical r2-assets-astro-template.
 */
import {
  buildFallbackKeys,
  buildFormatCandidates,
  createAssetResponse,
  downgradeVariantKey,
  getVariantSizesForPath,
  isSupportedAssetMethod,
  methodNotAllowedResponse,
} from './workers/r2-response.js'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // The CDN host serves every path from the images namespace; site hosts
    // only route /images/* through the Worker (see run_worker_first).
    const isImageRequest =
      url.hostname === 'cdn.josemianton.com' ||
      url.pathname.startsWith('/images/')

    if (isImageRequest) {
      if (!isSupportedAssetMethod(request.method)) {
        return methodNotAllowedResponse()
      }
      return handleImageRequest(request, env)
    }

    // Serve static assets (Astro site)
    return env.ASSETS.fetch(request)
  },
}

async function handleImageRequest(request, env) {
  const url = new URL(request.url)
  const accept = request.headers.get('Accept') || ''
  const saveData = request.headers.get('Save-Data') === 'on'
  const supportedFormats = {
    avif: accept.includes('image/avif'),
    webp: accept.includes('image/webp'),
  }

  let imagePath = url.pathname.startsWith('/images/')
    ? url.pathname.substring(1)
    : `images${url.pathname}`

  // R2 directory markers are zero-byte keys ending in "/" (e.g. cdn root).
  // Never serve them as image responses.
  if (imagePath.endsWith('/')) return imageNotFound()

  const variantSizes = getVariantSizesForPath(imagePath)

  // Upgrade original raster formats to the best supported generated variant
  if (/\.(jpe?g|png|gif)$/i.test(imagePath)) {
    imagePath = await selectBestFormat(
      imagePath,
      supportedFormats,
      variantSizes,
      env
    )
  }

  // Downgrade one configured step when Save-Data is on
  if (saveData) imagePath = downgradeVariantKey(imagePath, variantSizes)

  const object = await env.IMAGES_BUCKET.get(imagePath)
  if (object) {
    return assetResponse(request, object, imagePath, saveData)
  }

  for (const fallback of buildFallbackKeys(
    imagePath,
    supportedFormats,
    variantSizes
  )) {
    const fallbackObject = await env.IMAGES_BUCKET.get(fallback)
    if (fallbackObject) {
      return assetResponse(request, fallbackObject, fallback, saveData)
    }
  }

  return imageNotFound()
}

function assetResponse(request, object, key, saveData) {
  const response = createAssetResponse(request, object, key, 'Accept, Save-Data')
  if (saveData) response.headers.set('X-Save-Data', 'on')
  return response
}

async function selectBestFormat(imagePath, supportedFormats, variantSizes, env) {
  for (const candidate of buildFormatCandidates(
    imagePath,
    supportedFormats,
    variantSizes
  )) {
    if (await checkIfExists(candidate, env)) return candidate
  }

  return imagePath
}

async function checkIfExists(path, env) {
  try {
    return (await env.IMAGES_BUCKET.head(path)) !== null
  } catch {
    return false
  }
}

function imageNotFound() {
  return new Response('Image not found', {
    status: 404,
    headers: { 'Cache-Control': 'public, max-age=60' },
  })
}
