/**
 * Creates or updates all content types from model.ts and publishes them.
 * Idempotent: safe to run again after changing the model.
 *
 * Usage: npm run cms:setup
 */
import { createManagementClient, isNotFound } from './client.ts'
import { CONTENT_MODEL } from './model.ts'

const client = createManagementClient()

async function upsertContentType({ id, ...data }: (typeof CONTENT_MODEL)[number]) {
  let existing
  try {
    existing = await client.contentType.get({ contentTypeId: id })
  } catch (error) {
    if (!isNotFound(error)) throw error
  }

  const saved = existing
    ? await client.contentType.update({ contentTypeId: id }, { ...existing, ...data })
    : await client.contentType.createWithId({ contentTypeId: id }, data)

  await client.contentType.publish({ contentTypeId: id }, saved)
  console.log(`${existing ? 'updated' : 'created'}  ${id}`)
}

for (const contentType of CONTENT_MODEL) {
  await upsertContentType(contentType)
}

console.log('\nContent model is ready. Next step: npm run cms:seed')
