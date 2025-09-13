// worker.js - Add this to your Worker or create a new file
export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // Handle image requests from R2
    if (url.pathname.startsWith('/images/')) {
      return handleImageRequest(request, env)
    }

    // Handle static assets (your existing Astro site)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request)
    } else {
      // Fallback if ASSETS is not available
      return new Response('Not found', { status: 404 })
    }
  },
}

async function handleImageRequest(request, env) {
  const url = new URL(request.url)
  // Remove /images/ prefix to get the actual path in R2
  const imagePath = url.pathname.replace('/images/', '')

  try {
    // Get image from R2 bucket
    const object = await env.IMAGES_BUCKET.get(imagePath)

    if (!object) {
      return new Response('Image not found', { status: 404 })
    }

    // Get headers for proper content type
    const headers = new Headers()
    object.writeHttpMetadata(headers)

    // Add caching headers for better performance
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('Access-Control-Allow-Origin', '*')

    // Get optimization parameters from URL
    const width = url.searchParams.get('w')
    const quality = url.searchParams.get('q')
    const format = url.searchParams.get('f')

    // Apply Cloudflare Image Optimization if parameters are provided
    if (width || quality || format) {
      return applyImageOptimization(request, object, { width, quality, format }, headers)
    }

    // Return the original image
    return new Response(object.body, { headers })
  } catch (error) {
    console.error('Error fetching image:', error)
    return new Response('Error loading image', { status: 500 })
  }
}

// Apply Cloudflare Image Optimization
async function applyImageOptimization(request, object, params, headers) {
  const { width, quality, format } = params
  
  // Create a temporary URL for the image
  const imageUrl = new URL(request.url)
  
  // Use Cloudflare's Image Resizing feature
  // Note: This requires Cloudflare Images (paid feature) or Pro plan with Image Resizing
  const optimizationOptions = {
    cf: {
      image: {
        width: width ? parseInt(width) : undefined,
        quality: quality ? parseInt(quality) : 85,
        format: format || 'webp', // Default to WebP for better compression
        fit: 'scale-down',
        metadata: 'none',
        sharpen: 1.0
      }
    }
  }

  try {
    // Create a response with the image body
    const imageResponse = new Response(object.body, { headers })
    
    // Apply Cloudflare Image Resizing
    const optimizedRequest = new Request(imageUrl.toString(), {
      method: 'GET',
      ...optimizationOptions
    })
    
    // For free tier, we'll return the original image with optimization headers
    // To enable actual resizing, uncomment the line below (requires paid plan):
    // return fetch(optimizedRequest)
    
    // Free tier fallback: just return original with WebP content-type hint
    headers.set('X-Optimization-Note', 'Image resizing requires Cloudflare Images plan')
    if (format === 'webp') {
      headers.set('Vary', 'Accept')
    }
    
    return new Response(object.body, { headers })
  } catch (error) {
    console.error('Optimization error:', error)
    // Fallback to original image
    return new Response(object.body, { headers })
  }
}
