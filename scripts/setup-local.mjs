import { mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import { previewOrigin } from './lib/preview-origin.mjs'
mkdirSync('.data', { recursive: true })
mkdirSync('media', { recursive: true })
if (!existsSync('.env.local')) {
  const origin = previewOrigin()
  writeFileSync('.env.local', `PAYLOAD_SECRET=${randomBytes(48).toString('hex')}\nDATABASE_URL=file:./.data/inhouse.db\nSITE_URL=${origin}\nSITE_MODE=preview\nLEAD_CAPTURE_ENABLED=false\nCOOKIE_SECURE=${origin.startsWith('https:')}\n`, { mode: 0o600 })
  console.log('Local preview configuration created. Secret values are not printed.')
} else console.log('Existing .env.local preserved.')
