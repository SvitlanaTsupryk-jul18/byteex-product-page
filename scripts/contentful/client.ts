import 'dotenv/config'
import { createClient, type PlainClientAPI } from 'contentful-management'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`Missing environment variable ${name}. Copy .env.example to .env and fill it in.`)
    process.exit(1)
  }
  return value
}

/**
 * Plain CMA client with space/environment defaults.
 * Uses the management token, which must never be exposed to the browser
 * (hence no VITE_ prefix).
 */
export function createManagementClient(): PlainClientAPI {
  return createClient(
    { accessToken: requireEnv('CONTENTFUL_MANAGEMENT_TOKEN') },
    {
      type: 'plain',
      defaults: {
        spaceId: requireEnv('VITE_CONTENTFUL_SPACE_ID'),
        environmentId: process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
      },
    },
  )
}

/** Contentful returns 404 as an error with name "NotFound". */
export function isNotFound(error: unknown): boolean {
  return error instanceof Error && error.name === 'NotFound'
}
