import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import icon from 'astro-icon'
import sitemap from '@astrojs/sitemap'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://www.josemianton.com',
  output: 'static',

  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
    image: {
      service: {
        entrypoint: 'astro/assets/services/squoosh',
      },
      format: ['avif', 'webp'],
    },
  },
  // Remove adapter for static builds or configure properly for Workers
  // adapter: cloudflare(),
  integrations: [
    tailwind({
      applyBaseStyles: false,
      minify: true,
    }),
    react({
      include: ['**/react/*'],
      exclude: ['**/node_modules/**'],
    }),
    icon({
      svgoOptions: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.9,
      lastmod: new Date(),
      serialize(item) {
        if (item.url === 'https://www.josemianton.com/') {
          return {
            url: item.url,
            changefreq: 'weekly',
            priority: 1.0,
            lastmod: new Date().toISOString(),
          }
        }
        return item
      },
    }),
  ],

  vite: {
    build: {
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) {
                return 'react-vendor'
              }
              if (id.includes('@astrojs')) {
                return 'astro-vendor'
              }
              return 'vendor'
            }
          },
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['@astrojs/image'],
    },
    css: {
      devSourcemap: true,
      postcss: {
        plugins: [autoprefixer(), cssnano()],
      },
    },
  },
})
