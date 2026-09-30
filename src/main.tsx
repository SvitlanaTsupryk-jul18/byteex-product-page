import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/jost'
import './index.css'
import App from './App'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production builds with Contentful are prerendered (scripts/prerender.mjs): hydrate them.
if (rootElement.hasChildNodes()) hydrateRoot(rootElement, app)
else createRoot(rootElement).render(app)
