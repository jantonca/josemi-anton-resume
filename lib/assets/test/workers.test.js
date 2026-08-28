import assert from 'node:assert/strict'
import { test } from 'node:test'

import worker from '../../../worker.js'
import {
  BROWSER_CACHE_CONTROL,
  buildFallbackKeys,
  downgradeVariantKey,
  getVariantSizesForPath,
} from '../../../workers/r2-response.js'

function createObject(key) {
  return {
    key,
    body: 'asset-body',
    httpEtag: '"etag-1"',
    httpMetadata: { contentType: 'image/webp' },
    size: 10,
    writeHttpMetadata(headers) {
      headers.set('content-type', this.httpMetadata.contentType)
    },
  }
}

function createEnv(existingKeys = []) {
  const requested = []
  const objects = new Map(existingKeys.map((key) => [key, createObject(key)]))

  return {
    requested,
    env: {
      IMAGES_BUCKET: {
        async get(key) {
          requested.push(key)
          return objects.get(key) ?? null
        },
        async head(key) {
          return objects.get(key) ?? null
        },
      },
    },
  }
}

test('variant sizes come from assets.config.js, including skip rules', () => {
  assert.deepEqual(getVariantSizesForPath('images/photo.webp'), [400, 800, 1200])
  assert.deepEqual(getVariantSizesForPath('images/photo.jpg'), [400, 800, 1200])
})

test('Save-Data downgrades exactly one configured step', () => {
  assert.equal(
    downgradeVariantKey('images/profile-1200.webp'),
    'images/profile-800.webp'
  )
  assert.equal(
    downgradeVariantKey('images/profile-400.webp'),
    'images/profile-400.webp'
  )
})

test('fallbacks prefer the nearest smaller size and webp for avif misses', () => {
  assert.deepEqual(
    buildFallbackKeys('images/profile-1200.avif', { avif: false, webp: true }),
    [
      'images/profile-1200.webp',
      'images/profile-800.avif',
      'images/profile-800.webp',
      'images/profile-400.avif',
      'images/profile-400.webp',
      'images/profile.avif',
      'images/profile.webp',
      'images/profile.jpg',
      'images/profile.jpeg',
      'images/profile.png',
    ]
  )
})

test('non-GET/HEAD methods are rejected with 405', async () => {
  const { env } = createEnv(['images/profile-800.webp'])
  const request = new Request('https://josemianton.com/images/profile-800.webp', {
    method: 'POST',
  })

  const response = await worker.fetch(request, env)
  assert.equal(response.status, 405)
  assert.equal(response.headers.get('Allow'), 'GET, HEAD')
})

test('image responses carry the production cache policy and metadata', async () => {
  const { env } = createEnv(['images/profile-800.webp'])
  const request = new Request('https://josemianton.com/images/profile-800.webp')

  const response = await worker.fetch(request, env)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('content-type'), 'image/webp')
  assert.equal(response.headers.get('etag'), '"etag-1"')
  assert.equal(response.headers.get('cache-control'), BROWSER_CACHE_CONTROL)
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(response.headers.get('vary'), 'Accept, Save-Data')
})

test('HEAD requests receive headers without a body', async () => {
  const { env } = createEnv(['images/profile-800.webp'])
  const request = new Request('https://josemianton.com/images/profile-800.webp', {
    method: 'HEAD',
  })

  const response = await worker.fetch(request, env)
  assert.equal(response.status, 200)
  assert.equal(await response.text(), '')
})

test('Save-Data serves the next smaller variant, not the smallest', async () => {
  const { env, requested } = createEnv([
    'images/profile-400.webp',
    'images/profile-800.webp',
    'images/profile-1200.webp',
  ])
  const request = new Request('https://josemianton.com/images/profile-1200.webp', {
    headers: { 'Save-Data': 'on' },
  })

  const response = await worker.fetch(request, env)
  assert.equal(response.status, 200)
  assert.equal(requested[0], 'images/profile-800.webp')
  assert.equal(response.headers.get('x-save-data'), 'on')
})

test('directory markers and missing images return 404 with a short cache', async () => {
  const { env } = createEnv([])
  const markerRequest = new Request('https://cdn.josemianton.com/')
  const markerResponse = await worker.fetch(markerRequest, env)
  assert.equal(markerResponse.status, 404)
  assert.equal(markerResponse.headers.get('cache-control'), 'public, max-age=60')

  const missingRequest = new Request(
    'https://josemianton.com/images/missing-800.webp'
  )
  const missingResponse = await worker.fetch(missingRequest, env)
  assert.equal(missingResponse.status, 404)
})

test('original raster requests upgrade to the webp variant', async () => {
  const { env, requested } = createEnv(['images/profile-800.webp'])
  const request = new Request(
    'https://cdn.josemianton.com/images/profile.jpg',
    { headers: { Accept: 'image/webp,image/*' } }
  )

  const response = await worker.fetch(request, env)
  assert.equal(response.status, 200)
  assert.equal(requested[0], 'images/profile-800.webp')
})
