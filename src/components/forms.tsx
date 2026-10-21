'use client'
import { useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import type { Site } from '@/payload-types'
import { Arrow } from './ui'
import { track } from '@/lib/analytics'
type Intent = 'build' | 'custom' | 'start' | 'audit-result'
export function LeadForm({ intent, enabled, copy, email, booking }: { intent: Intent; enabled: boolean; copy: Site['formCopy']; email?: string | null; booking?: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const requestKey = useRef('')
  const started = useRef(false)
  const statusElement = useRef<HTMLDivElement>(null)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const data = Object.fromEntries(new FormData(form))
    if (!enabled) {
      const labels: Record<string, string> = { name: copy?.nameLabel || 'Név', email: copy?.emailLabel || 'E-mail', company: copy?.companyLabel || 'Cég', team: copy?.teamLabel || 'Csapat', timing: copy?.timingLabel || 'Időzítés', capacity: copy?.capacityLabel || 'Kapacitás', platforms: copy?.platformsLabel || 'Csatornák', decisionMakers: copy?.decisionMakersLabel || 'Döntéshozók', message: copy?.messageLabel || 'Cél' }
      const text = `IN/HOUSE / ${intent.toUpperCase()} — saját összefoglaló\nNEM ELKÜLDÖTT MEGKERESÉS\n\n` + Object.entries(data).filter(([key]) => labels[key]).map(([key,value]) => `${labels[key]}: ${value}`).join('\n\n')
      const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `inhouse-${intent}-osszefoglalo.txt`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
      setError('Az összefoglalót letöltöttétek. Az adatokat nem küldtük el.'); setStatus('idle'); return
    }
    setStatus('loading'); setError('')
    requestKey.current ||= crypto.randomUUID()
    try {
      const response = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, consent: data.consent === 'on', intent, requestKey: requestKey.current }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'A küldés nem sikerült. Próbáljátok újra később.')
      setStatus('success')
      track('generate_lead', { form_type: intent })
      if (intent === 'build') track('build_application_submit')
      setTimeout(() => statusElement.current?.focus(), 0)
    } catch (err) { setStatus('error'); setError(err instanceof Error ? err.message : 'Nem sikerült elküldeni.'); track('form_error', { form_type: intent }) }
  }
  if (status === 'success') return <div className="form-success" ref={statusElement} tabIndex={-1} role="status"><span className="success-mark" aria-hidden="true">✓</span><h2>Megérkezett a megkeresés.</h2><p>{copy?.successMessage}</p>{booking && <a className="button" href={booking} rel="noopener noreferrer">Tovább az időpontválasztáshoz<Arrow /></a>}<Link className="text-link" href="/modszer/">Addig megismerem a módszert →</Link></div>
  return <div className="form-layout"><aside><p className="eyebrow">{intent.toUpperCase()} / KÖVETKEZŐ LÉPÉS</p><h2>{enabled ? 'Beszéljünk a működésetekről.' : 'Gondoljátok végig a saját helyzeteteket.'}</h2><p>{enabled ? 'A beküldött megkeresést a csapat tudja áttekinteni. Marketinglevélre nem iratkoztok fel.' : copy?.fallbackNotice}</p>{email && <a className="text-link" href={`mailto:${email}`}>{email} <Arrow diagonal /></a>}<p className="muted">{enabled ? 'A csillaggal jelölt mezők szükségesek.' : 'Letöltéskor a kitöltés a böngészőtökben marad. A kapcsolati mezők ilyenkor opcionálisak.'}</p></aside><form className="lead-form" onSubmit={submit} onFocus={() => { if (!started.current) { started.current = true; if (intent === 'build') track('build_application_start'); if (intent === 'custom') track('custom_audit_start') } }}>
    <div className="field-row"><label>{copy?.nameLabel}{enabled && ' *'}<input name="name" autoComplete="name" maxLength={100} required={enabled} /></label><label>{copy?.emailLabel}{enabled && ' *'}<input name="email" type="email" autoComplete="email" maxLength={254} required={enabled} /></label></div>
    <label>{copy?.companyLabel}{enabled && ' *'}<input name="company" autoComplete="organization" maxLength={200} required={enabled} /></label>
    {['build','custom'].includes(intent) && <><label>{copy?.teamLabel}<input name="team" maxLength={300} /></label><label>{copy?.capacityLabel}<input name="capacity" maxLength={300} /></label><label>{copy?.timingLabel}<select name="timing" defaultValue=""><option value="">Még egyeztetnénk</option><option value="soon">Amint a feltételek adottak</option><option value="quarter">A következő negyedévben</option><option value="exploring">Most tájékozódunk</option></select></label></>}
    {intent === 'custom' && <><label>{copy?.platformsLabel}<input name="platforms" maxLength={500} /></label><label>{copy?.decisionMakersLabel}<input name="decisionMakers" maxLength={300} /></label></>}
    <label>{copy?.messageLabel} *<textarea name="message" rows={4} minLength={10} maxLength={3000} required aria-describedby="message-hint" /><span className="field-hint" id="message-hint">Legalább egy mondatban. Érzékeny adatot ne írjatok ide.</span></label>
    <div className="honeypot" aria-hidden="true"><label>Weboldal<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    {enabled && <label className="checkbox"><input name="consent" type="checkbox" required /><span>{copy?.privacyLabel} <Link href="/adatkezeles/">Adatkezelési tájékoztató</Link></span></label>}
    <div id="form-status" role="status" className={status === 'error' ? 'form-error' : 'field-hint'}>{error}</div><button className="button" disabled={status === 'loading'} aria-describedby="form-status">{status === 'loading' ? 'Küldés…' : enabled ? copy?.submitLabel : copy?.downloadLabel}<Arrow /></button>
  </form></div>
}
