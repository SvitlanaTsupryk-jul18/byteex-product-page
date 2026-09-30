/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { entriesUrl, landingPageQuery } from './src/lib/contentful/url.ts'

/**
 * Starts the Contentful request from index.html, in parallel with the JS bundle,
 * instead of waiting until React mounts. Skipped when Contentful is not configured.
 */
function preloadContentful(env: Record<string, string>): Plugin {
  const spaceId = env.VITE_CONTENTFUL_SPACE_ID
  const accessToken = env.VITE_CONTENTFUL_ACCESS_TOKEN
  const environment = env.VITE_CONTENTFUL_ENVIRONMENT || 'master'
  return {
    name: 'preload-contentful',
    transformIndexHtml() {
      if (!spaceId || !accessToken) return []
      return [
        {
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'fetch',
            crossorigin: 'anonymous',
            href: entriesUrl({ spaceId, accessToken, environment }, landingPageQuery()),
          },
          injectTo: 'head',
        },
      ]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), preloadContentful(loadEnv(mode, process.cwd(), 'VITE_'))],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
  },
}))
