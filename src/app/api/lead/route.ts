import { NextResponse } from 'next/server'
import { captureEnabled, cms, getSite, siteURL } from '@/lib/content'
import { leadSchema } from '@/lib/lead'
const attempts = new Map<string, { count: number; until: number }>()
async function boundedJSON(req: Request) {
  const reader = req.body?.getReader()
  if (!reader) throw new Error('empty')
  let size = 0
  let body = ''
  const decoder = new TextDecoder()
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > 16384) { await reader.cancel(); throw new Error('large') } body += decoder.decode(value, { stream: true }) }
  return JSON.parse(body + decoder.decode())
}
export async function POST(req: Request) {
  const json = (error: string, status: number) => NextResponse.json({ error }, { status })
  if (req.headers.get('origin') !== new URL(siteURL()).origin) return json('A kérés eredete nem engedélyezett.', 403)
  if (!req.headers.get('content-type')?.startsWith('application/json')) return json('JSON-kérés szükséges.', 415)
  if (!await captureEnabled()) return json('Az online adatküldés még nem nyílt meg. A kitöltött összefoglalót letölthetitek.', 503)
  const address = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const now = Date.now()
  for (const [key,value] of attempts) if (value.until < now) attempts.delete(key)
  const attempt = attempts.get(address) || { count: 0, until: now + 600000 }
  attempts.set(address, { ...attempt, count: attempt.count + 1 })
  if (attempt.count >= 5) return json('Túl sok kérés. Kérjük, próbáljátok újra később.', 429)
  let raw: unknown
  try { raw = await boundedJSON(req) } catch { return json('Érvénytelen vagy túl nagy kérés.', 400) }
  const parsed = leadSchema.safeParse(raw)
  if (!parsed.success) return json('Ellenőrizzétek a kötelező mezőket és az adatkezelési nyilatkozatot.', 400)
  const { consent: _consent, website: _website, ...data } = parsed.data
  void _consent; void _website
  const payload = await cms()
  const existing = await payload.find({ collection: 'leads', where: { requestKey: { equals: data.requestKey } }, limit: 1, overrideAccess: true })
  if (existing.totalDocs) return NextResponse.json({ accepted: true })
  try {
    const site = await getSite()
    const lead = await payload.create({ collection: 'leads', data: { ...data, consentAt: new Date().toISOString(), privacyVersion: site.privacyVersion }, overrideAccess: true })
    if (process.env.CRM_WEBHOOK_URL?.startsWith('https://')) {
      try {
        const response = await fetch(process.env.CRM_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': data.requestKey, ...(process.env.CRM_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify({ id: lead.id, ...data, consentAt: lead.consentAt, privacyVersion: lead.privacyVersion }), signal: AbortSignal.timeout(8000), redirect: 'error' })
        await payload.update({ collection: 'leads', id: lead.id, data: { delivery: response.ok ? 'delivered' : 'failed' }, overrideAccess: true })
      } catch { await payload.update({ collection: 'leads', id: lead.id, data: { delivery: 'failed' }, overrideAccess: true }) }
    }
    return NextResponse.json({ accepted: true }, { status: 201 })
  } catch {
    // Do not send database diagnostics, tokens or submitted PII to the client/logs.
    return json('A megkeresést nem sikerült rögzíteni. Próbáljátok újra később ugyanazzal az űrlappal.', 500)
  }
}
