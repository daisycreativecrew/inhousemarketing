import type { Payload } from 'payload'
// Payload's Drizzle destroy clears its schema but does not close the underlying
// PostgreSQL pool. CLI commands must release it to terminate normally.
export async function closePayload(payload: Payload) {
  const adapter = payload.db as unknown as { pool?: { end: () => Promise<void> }; client?: { close: () => void } }
  const pool = adapter.pool
  const client = adapter.client
  await payload.destroy()
  if (pool) void pool.end()
  else client?.close()
}
