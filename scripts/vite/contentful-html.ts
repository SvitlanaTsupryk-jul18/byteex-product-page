/**
 * Vite plugin that speeds up the first paint when Contentful is configured.
 *
 * - build: fetches the landing page once and embeds the raw Delivery API response
 *   in index.html. scripts/prerender.mjs renders HTML from it, and the app uses it
 *   for its first render, then refetches in the background, so CMS edits show up
 *   without a rebuild.
 * - dev, or if the build-time request fails: only preloads the API request.
 */
import type { HtmlTagDescriptor, Plugin } from 'vite'
import type { EntriesResponse } from '../../src/lib/contentful/resolveLinks.ts'
import { entriesUrl, landingPageQuery, SNAPSHOT_ELEMENT_ID } from '../../src/lib/contentful/url.ts'

export function contentfulHtml(env: Record<string, string>): Plugin {
  const spaceId = env.VITE_CONTENTFUL_SPACE_ID
  const accessToken = env.VITE_CONTENTFUL_ACCESS_TOKEN
  const environment = env.VITE_CONTENTFUL_ENVIRONMENT || 'master'
  let isBuild = false

  return {
    name: 'contentful-html',
    configResolved(config) {
      isBuild = config.command === 'build'
    },
    async transformIndexHtml() {
      if (!spaceId || !accessToken) return []
      const url = entriesUrl({ spaceId, accessToken, environment }, landingPageQuery())
      const preloadRequest: HtmlTagDescriptor = {
        tag: 'link',
        attrs: { rel: 'preload', as: 'fetch', crossorigin: 'anonymous', href: url },
        injectTo: 'head',
      }
      if (!isBuild) return [preloadRequest]

      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const body = (await response.json()) as EntriesResponse

        const tags: HtmlTagDescriptor[] = [
          {
            tag: 'script',
            attrs: { id: SNAPSHOT_ELEMENT_ID, type: 'application/json' },
            // Escape "<" so content can never close the script tag.
            children: JSON.stringify(body).replace(/</g, '\\u003c'),
            injectTo: 'body-prepend',
          },
        ]

        return tags
      } catch (error) {
        console.warn(`[contentful-html] No content snapshot, falling back to preload: ${error}`)
        return [preloadRequest]
      }
    },
  }
}
