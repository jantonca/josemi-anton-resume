// src/worker.js - Complete Worker for josemianton.com with R2 image handling

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // Handle image requests from R2
    if (
      url.pathname.startsWith('/api/images/') ||
      url.pathname.startsWith('/images/')
    ) {
      return handleImageRequest(request, env, ctx)
    }

    // Handle image upload (optional - for admin use)
    if (url.pathname === '/api/upload' && request.method === 'POST') {
      return handleImageUpload(request, env)
    }

    // Handle static assets (your existing Astro site)
    return env.ASSETS.fetch(request)
  },
}

/**
 * Handle image requests from R2 with caching and optimization
 */
async function handleImageRequest(request, env, ctx) {
  const url = new URL(request.url)

  // Extract image path - support both /images/ and /api/images/ prefixes
  let imagePath = url.pathname
  if (imagePath.startsWith('/api/images/')) {
    imagePath = imagePath.replace('/api/images/', '')
  } else if (imagePath.startsWith('/images/')) {
    imagePath = imagePath.replace('/images/', '')
  }

  // Generate cache key for this request
  const cacheKey = new Request(url.toString(), request)
  const cache = caches.default

  // Check cache first
  let response = await cache.match(cacheKey)
  if (response) {
    return response
  }

  try {
    // Get image from R2 bucket
    const object = await env.IMAGES_BUCKET.get(imagePath)

    if (!object) {
      return new Response('Image not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'public, max-age=60',
        },
      })
    }

    // Get the image body and metadata
    const headers = new Headers()
    object.writeHttpMetadata(headers)

    // Set proper content type if not already set
    if (!headers.get('Content-Type')) {
      const contentType = getContentType(imagePath)
      headers.set('Content-Type', contentType)
    }

    // Add performance and caching headers
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('X-Content-Type-Options', 'nosniff')

    // Add ETag for browser caching
    if (object.etag) {
      headers.set('ETag', object.etag)
    }

    // Handle conditional requests (304 Not Modified)
    const ifNoneMatch = request.headers.get('If-None-Match')
    if (ifNoneMatch && object.etag && ifNoneMatch === object.etag) {
      return new Response(null, {
        status: 304,
        headers,
      })
    }

    // Get transformation parameters
    const width = url.searchParams.get('w')
    const height = url.searchParams.get('h')
    const quality = url.searchParams.get('q') || '85'
    const format = url.searchParams.get('f') // webp, avif, auto

    // Check if we need to transform the image
    if (width || height || format) {
      return transformImage(
        object,
        { width, height, quality, format },
        headers,
        ctx
      )
    }

    // Return the original image
    response = new Response(object.body, {
      headers,
      status: 200,
    })

    // Store in cache
    ctx.waitUntil(cache.put(cacheKey, response.clone()))

    return response
  } catch (error) {
    console.error('Error fetching image:', error)
    return new Response('Error loading image', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
      },
    })
  }
}

/**
 * Transform images using Cloudflare's Image Resizing API
 * Note: This requires the paid Cloudflare Images plan
 * For free tier, we'll return the original image
 */
async function transformImage(object, params, headers, ctx) {
  const { width, height, quality, format } = params

  // For free tier: return original image
  // Uncomment the code below if you have Cloudflare Images paid plan

  /*
  // Build Cloudflare Image Resizing options
  const cf = {
    image: {
      width: width ? parseInt(width) : undefined,
      height: height ? parseInt(height) : undefined,
      quality: parseInt(quality),
      format: format || 'auto',
      fit: 'scale-down',
      metadata: 'none',
      sharpen: 1.0
    }
  };
  
  // Create a new request with the image body
  const imageRequest = new Request(request.url, {
    body: object.body,
    headers: {
      'Content-Type': headers.get('Content-Type')
    },
    cf
  });
  
  return fetch(imageRequest);
  */

  // Free tier: Return original with a note in headers
  headers.set('X-Transform-Note', 'Transformations require paid plan')
  return new Response(object.body, { headers })
}

/**
 * Handle image uploads (optional - for admin use)
 * Protect this endpoint in production!
 */
async function handleImageUpload(request, env) {
  // Simple auth check - replace with your auth method
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${env.UPLOAD_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const path = formData.get('path') || `uploads/${Date.now()}-${file.name}`

    if (!file) {
      return new Response('No file provided', { status: 400 })
    }

    // Upload to R2
    await env.IMAGES_BUCKET.put(path, file.stream(), {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
      },
    })

    return new Response(
      JSON.stringify({
        success: true,
        path: path,
        url: `/images/${path}`,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return new Response('Upload failed', { status: 500 })
  }
}

/**
 * Helper function to determine content type from file extension
 */
function getContentType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  const types = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    avif: 'image/avif',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    bmp: 'image/bmp',
    tiff: 'image/tiff',
    tif: 'image/tiff',
  }
  return types[ext] || 'application/octet-stream'
}
