/**
 * Shared helpers for serving R2-backed image assets from the Worker.
 *
 * Adapted from the canonical r2-assets-astro-template, with this repo's
 * production cache policy preserved (immutable one-year browser cache).
 * Variant sizes come from assets.config.js so generated keys, format
 * negotiation, and Save-Data downgrades stay aligned.
 */
import assetConfig from '../assets.config.js'

export const BROWSER_CACHE_CONTROL = 'public, max-age=31536000, immutable'
export const CDN_CACHE_CONTROL = 'max-age=31536000'

export function isSupportedAssetMethod(method) {
  return method === 'GET' || method === 'HEAD'
}

export function methodNotAllowedResponse() {
  return new Response('Method not allowed', {
    status: 405,
    headers: { Allow: 'GET, HEAD' },
  })
}

export function buildAssetHeaders(object, assetPath, vary = 'Accept') {
  const headers = new Headers()

  if (typeof object.writeHttpMetadata === 'function') {
    object.writeHttpMetadata(headers)
  }

  if (!headers.has('Content-Type')) {
    headers.set(
      'Content-Type',
      object.httpMetadata?.contentType || getContentType(assetPath)
    )
  }

  headers.set('Cache-Control', BROWSER_CACHE_CONTROL)
  headers.set('CDN-Cache-Control', CDN_CACHE_CONTROL)
  headers.set('Vary', vary)
  headers.set('X-Content-Type-Options', 'nosniff')

  if (object.httpEtag) headers.set('ETag', object.httpEtag)
  if (Number.isFinite(object.size)) {
    headers.set('Content-Length', String(object.size))
  }

  return headers
}

export function createAssetResponse(
  request,
  object,
  assetPath,
  vary = 'Accept'
) {
  const body = request.method === 'HEAD' ? null : object.body
  return new Response(body, {
    status: 200,
    headers: buildAssetHeaders(object, assetPath, vary),
  })
}

export function buildFormatCandidates(
  imagePath,
  supportedFormats,
  variantSizes = getVariantSizesForPath(imagePath)
) {
  const basePath = imagePath.replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, '')
  const requestedSize = basePath.match(/-(\d+)$/)?.[1]
  const defaultWidth = selectDefaultVariantWidth(variantSizes)
  const variantBases = requestedSize
    ? [basePath]
    : [defaultWidth ? `${basePath}-${defaultWidth}` : null, basePath].filter(
        Boolean
      )
  const candidates = []

  for (const variantBase of variantBases) {
    if (supportedFormats.avif) candidates.push(`${variantBase}.avif`)
    if (supportedFormats.webp) candidates.push(`${variantBase}.webp`)
  }

  return [...new Set(candidates)]
}

export function buildFallbackKeys(
  imagePath,
  supportedFormats,
  variantSizes = getVariantSizesForPath(imagePath)
) {
  const match = imagePath.match(
    /^(.+?)(?:-(\d+))?\.(webp|avif|jpe?g|png|gif|svg)$/i
  )
  if (!match) return []

  const [, baseName, size, rawFormat] = match
  const format = rawFormat.toLowerCase()
  const fallbacks = []

  if (format === 'avif' && supportedFormats.webp) {
    fallbacks.push(`${baseName}${size ? `-${size}` : ''}.webp`)
  }

  if (size) {
    const currentSize = Number.parseInt(size, 10)
    const smallerSizes = normalizeVariantSizes(variantSizes)
      .filter((candidate) => candidate < currentSize)
      .sort((a, b) => b - a)

    for (const candidate of smallerSizes) {
      fallbacks.push(`${baseName}-${candidate}.${format}`)
      if (format === 'avif' && supportedFormats.webp) {
        fallbacks.push(`${baseName}-${candidate}.webp`)
      }
    }
  }

  fallbacks.push(`${baseName}.${format}`)
  if (format === 'avif' && supportedFormats.webp) {
    fallbacks.push(`${baseName}.webp`)
  }

  fallbacks.push(`${baseName}.jpg`, `${baseName}.jpeg`, `${baseName}.png`)

  return [...new Set(fallbacks)]
}

export function downgradeVariantKey(
  imagePath,
  variantSizes = getVariantSizesForPath(imagePath)
) {
  const match = imagePath.match(/^(.*)-(\d+)\.(webp|avif)$/i)
  if (!match) return imagePath

  const [, baseName, rawSize, format] = match
  const currentSize = Number.parseInt(rawSize, 10)
  const nextSize = normalizeVariantSizes(variantSizes)
    .filter((candidate) => candidate < currentSize)
    .sort((a, b) => b - a)[0]

  return nextSize ? `${baseName}-${nextSize}.${format}` : imagePath
}

export function getVariantSizesForPath(imagePath, config = assetConfig) {
  const extension = imagePath.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase()
  const configuredRule = extension ? config.rules?.[`.${extension}`] : null
  if (configuredRule) return normalizeVariantSizes(configuredRule.sizes)

  return normalizeVariantSizes(
    Object.values(config.rules || {}).flatMap((rule) => rule.sizes || [])
  )
}

function selectDefaultVariantWidth(variantSizes) {
  return normalizeVariantSizes(variantSizes).sort(
    (a, b) => Math.abs(a - 800) - Math.abs(b - 800) || a - b
  )[0]
}

function normalizeVariantSizes(variantSizes) {
  if (!Array.isArray(variantSizes)) return []

  return [...new Set(variantSizes.filter((size) => Number.isInteger(size) && size > 0))]
}

export function getContentType(assetPath) {
  const ext = assetPath.split('.').pop()?.toLowerCase()
  const types = {
    webp: 'image/webp',
    avif: 'image/avif',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
  }
  return types[ext] || 'application/octet-stream'
}
