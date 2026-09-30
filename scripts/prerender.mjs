// Inserts prerendered markup into dist/index.html (run after both Vite builds).
// Skipped when the build has no Contentful snapshot, e.g. without credentials.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'

const htmlPath = 'dist/index.html'
let html = readFileSync(htmlPath, 'utf8')
const snapshot = html.match(
  /<script id="contentful-snapshot" type="application\/json">([\s\S]*?)<\/script>/,
)

if (!snapshot) {
  console.log('[prerender] No content snapshot, keeping client-side rendering.')
} else {
  const { renderSnapshot } = await import('../dist-ssr/entry-server.js')
  const rendered = renderSnapshot(snapshot[1])
  if (rendered) {
    // React emits hoistable tags (<title>, <meta>, image preloads) at the start of
    // the markup; they belong in <head>, replacing the static title and description.
    const [, hoisted, markup] = rendered.match(
      /^((?:<title>[^<]*<\/title>|<meta[^>]*>|<link[^>]*>)*)([\s\S]*)$/,
    )
    if (hoisted.includes('<title>')) html = html.replace(/<title>[^<]*<\/title>/, '')
    if (hoisted.includes('name="description"')) {
      html = html.replace(/<meta\s+name="description"[^>]*>/, '')
    }
    html = html
      .replace('</head>', `${hoisted}</head>`)
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
    writeFileSync(htmlPath, html)
    console.log(`[prerender] Inserted ${Math.round(markup.length / 1024)} kB of markup.`)
  }
}

rmSync('dist-ssr', { recursive: true, force: true })
