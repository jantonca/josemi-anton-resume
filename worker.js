// worker.js - Add this to your Worker or create a new file
export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // Handle image requests from R2
    if (url.pathname.startsWith('/images/')) {
      return handleImageRequest(request, env)
    }

    // Handle static assets (your existing Astro site)
    return env.ASSETS.fetch(request)
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

    // Optional: Add image transformation parameters
    const width = url.searchParams.get('w')
    const quality = url.searchParams.get('q')

    if (width || quality) {
      // Use Cloudflare Image Resizing (if you have it enabled)
      // This requires the paid Images plan
      return fetch(request, {
        cf: {
          image: {
            width: width ? parseInt(width) : undefined,
            quality: quality ? parseInt(quality) : 85,
            format: 'auto',
          },
        },
      })
    }

    // Return the original image
    return new Response(object.body, { headers })
  } catch (error) {
    console.error('Error fetching image:', error)
    return new Response('Error loading image', { status: 500 })
  }
}
