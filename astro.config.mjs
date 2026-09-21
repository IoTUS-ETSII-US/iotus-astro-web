// @ts-check
import { defineConfig } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'

import tailwindcss from '@tailwindcss/vite'

import react from '@astrojs/react'

import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://iotus.etsii.es',
  output: 'server',
  trailingSlash: 'never',
  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        page !== 'https://iotus.etsii.es/admin' &&
        page !== 'https://iotus.etsii.es/inventario' &&
        page !== 'https://iotus.etsii.es/perfil',
    }),
  ],
})
