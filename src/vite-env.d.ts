/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTENTFUL_SPACE_ID?: string
  readonly VITE_CONTENTFUL_ACCESS_TOKEN?: string
  readonly VITE_CONTENTFUL_ENVIRONMENT?: string
  /** Public site address, e.g. https://user.github.io/repo/. Enables canonical and og:url. */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
