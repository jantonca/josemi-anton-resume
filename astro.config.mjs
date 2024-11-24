import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'

import icon from 'astro-icon';

export default defineConfig({
  integrations: [tailwind({
    // Disable the default base styles
    applyBaseStyles: false,
  }), react(), icon()],
})