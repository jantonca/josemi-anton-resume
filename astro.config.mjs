import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import cssnano from 'cssnano'

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://www.josemianton.com',
  output: 'static',

  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  integrations: [
    icon({
      svgoOptions: {
        plugins: [
          {
            name: 'preset-default',
          },
        ],
      },
    }),
    // Keep the sitemap to canonical URLs. Build-time modification dates and
    // unsupported freshness hints would not describe the content accurately.
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
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
    css: {
      devSourcemap: true,
      postcss: {
        plugins: [cssnano()],
      },
    },
  },
})
