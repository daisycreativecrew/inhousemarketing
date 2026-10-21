'use client'
import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { track, eventNames, type EventName } from '@/lib/analytics'
import { Arrow } from './ui'
import type { Site } from '@/payload-types'

export function Navigation({ links }: { links: Site['navigation'] }) {
  const [open, setOpen] = useState(false)
  const path = usePathname()
  return <><button className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? 'Bezárás' : 'Menü'}<span aria-hidden="true">{open ? '−' : '+'}</span></button><nav id="main-navigation" aria-label="Fő navigáció" className={open ? 'nav open' : 'nav'} onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); document.querySelector<HTMLButtonElement>('.menu-toggle')?.focus() } }}>{links?.map(l => <Link key={l.id || l.href} href={l.href} onClick={() => setOpen(false)} aria-current={path === l.href.replace(/\/$/, '') || path === l.href ? 'page' : undefined}>{l.label}</Link>)}</nav></>
}
const consentSubscribe = (listener: () => void) => {
  window.addEventListener('storage', listener)
  window.addEventListener('ih:consent-change', listener)
  return () => { window.removeEventListener('storage', listener); window.removeEventListener('ih:consent-change', listener) }
}
const consentSnapshot = () => { try { const value = localStorage.getItem('ih-consent'); return value === 'necessary' || value === 'analytics' ? value : 'unset' } catch { return 'unset' } }
export function Consent() {
  const saved = useSyncExternalStore(consentSubscribe, consentSnapshot, () => 'pending')
  const [forced, setForced] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const visible = forced || saved === 'unset' && !dismissed
  useEffect(() => {
    const stored = (() => { try { return localStorage.getItem('ih-consent') } catch { return null } })()
    window.dataLayer ??= []
    window.dataLayer.push({ consent: 'default', analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
    if (stored === 'analytics') window.dataLayer.push({ consent: 'update', analytics_storage: 'granted' })
    const show = () => setForced(true)
    window.addEventListener('ih:consent', show)
    return () => window.removeEventListener('ih:consent', show)
  }, [])
  function choose(value: 'necessary' | 'analytics') {
    try { localStorage.setItem('ih-consent', value) } catch { /* Storage can be blocked. Default remains denied. */ }
    window.dataLayer ??= []
    window.dataLayer.push({ consent: 'update', analytics_storage: value === 'analytics' ? 'granted' : 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
    setForced(false)
    setDismissed(true)
    window.dispatchEvent(new Event('ih:consent-change'))
  }
  return <>{visible && <aside className="consent" aria-label="Adatvédelmi beállítások"><div><strong>A választás a tiétek.</strong><p>Az oldal mérés nélkül is működik. Engedélyezitek a személyes adatot nem tartalmazó használati események mérését? <Link href="/adatkezeles/">Részletek</Link></p></div><button onClick={() => choose('necessary')}>Csak szükséges</button><button onClick={() => choose('analytics')}>Mérés engedélyezése</button></aside>}</>
}
export function ConsentButton() { return <button className="text-button" onClick={() => window.dispatchEvent(new Event('ih:consent'))}>Sütibeállítások</button> }
export function Experience() {
  const pathname = usePathname()
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('revealed')
        const chapter = entry.target.getAttribute('data-chapter')
        const tier = entry.target.getAttribute('data-package')
        if (chapter) track('trustphone_chapter_view', { chapter })
        if (tier) track('package_view', { package_tier: tier })
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.15 })
    document.querySelectorAll('[data-reveal], [data-chapter], [data-package]').forEach(el => {
      if (!reduced) el.classList.add('will-reveal')
      observer.observe(el)
    })
    if (pathname.includes('/esettanulmanyok/trustphone')) track('trustphone_case_view')
    function click(e: MouseEvent) {
      const element = (e.target as HTMLElement).closest<HTMLElement>('[data-event]')
      const event = element?.dataset.event
      if (event && eventNames.includes(event as EventName)) track(event as EventName, { location: element?.dataset.location || 'page', ...(element?.dataset.tier ? { package_tier: element.dataset.tier } : {}) })
    }
    document.addEventListener('click', click)
    return () => { observer.disconnect(); document.removeEventListener('click', click) }
  }, [pathname])
  return null
}
export function FAQ({ items }: { items: { title: string; body: string; id?: string | null }[] }) {
  return <div className="faq">{items.map((item, index) => <details key={item.id || index} onToggle={e => { if (e.currentTarget.open) track('faq_expand', { question_id: item.id || `faq-${index}` }) }}><summary>{item.title}<span aria-hidden="true">+</span></summary><p>{item.body}</p></details>)}</div>
}
export function PathSelector({ items }: { items: { title: string; body: string; kicker?: string | null; href?: string | null }[] }) {
  const [selected, setSelected] = useState(1)
  const active = items[selected]
  return <div className="path-selector"><div className="path-options" role="group" aria-label="A helyzetetek"><span className="label">MELYIK MONDAT ISMERŐS?</span>{items.map((item, index) => <button key={item.title} aria-pressed={selected === index} onClick={() => { setSelected(index); track('persona_select', { persona: item.kicker?.toLowerCase() || `path-${index}` }) }}><span className="path-index">0{index + 1}</span><span className="path-label">{item.title}</span><Arrow /></button>)}</div><div className="path-result" aria-live="polite"><span className="eyebrow">EGY LEHETSÉGES ÚT</span><strong key={selected}>{active?.kicker}</strong><p>{active?.body}</p><Link className="button" href={active?.href || '/self-audit/'} data-event="select_package" data-tier={active?.kicker?.toLowerCase()}>Megnézem ezt az utat<Arrow /></Link></div></div>
}
export function SkillMap({ capabilities }: { capabilities: { label: string; tasks: string }[] }) {
  const [active, setActive] = useState(0)
  return <div className="skill-map"><div className="skill-origin"><span className="label">A KIINDULÓPONT</span><strong>Apróhirdetés<br />+ termékfotózás</strong><span className="map-slash" aria-hidden="true">/</span></div><div className="skill-network"><div className="skill-nodes" role="group" aria-label="Kibővült kompetenciaterületek">{capabilities.map((capability, i) => <button key={capability.label} aria-pressed={active === i} onClick={() => { setActive(i); track('proof_interaction', { proof_id: `capability-${i}` }) }}><span>0{i + 1}</span>{capability.label}<span aria-hidden="true">↗</span></button>)}</div><div className="skill-description" aria-live="polite"><span className="label">{capabilities[active]?.label}</span><p>{capabilities[active]?.tasks}</p></div></div></div>
}
export function ConceptPreview({ items }: { items: { title: string; body: string }[] }) {
  const [active, setActive] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  return <div className="product-preview"><div className="preview-tabs" role="group" aria-label="Koncepcionális termékrészletek">{items.map((item,i) => <button key={item.title} onClick={() => setActive(i)} aria-pressed={active === i}>{item.title}</button>)}</div><div className="preview-sheet"><div className="sheet-top"><span>IN/HOUSE <b>/</b> SYSTEM TOOLS</span><span>KONCEPCIÓ / NEM VÉGLEGES TERMÉK</span></div><div className="sheet-content"><div className="sheet-number">0{active + 1}<span>/</span></div><div><p className="label">A KÖVETKEZŐ JÓ LÉPÉS</p><h3>{items[active]?.title}</h3><p>{items[active]?.body}</p><div className="workflow-mini" aria-hidden="true"><span>CÉL</span><i>→</i><span>FELADAT</span><i>→</i><span>REVIEW</span></div></div></div><button className="text-button" onClick={() => dialog.current?.showModal()}>Részletes nézet <Arrow diagonal /></button></div><dialog ref={dialog} className="preview-dialog" onClick={e => { if (e.target === e.currentTarget) dialog.current?.close() }}><button className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Előnézet bezárása">×</button><p className="eyebrow">KONCEPCIONÁLIS MINTA</p><h2>{items[active]?.title}</h2><p>{items[active]?.body}</p><ol><li>Rögzítsétek a kívánt változást.</li><li>Jelöljetek ki felelőst és elfogadási feltételt.</li><li>Beszéljétek át a következő lépést.</li></ol><p>A végleges termékanyagok tartalma külön jóváhagyást igényel.</p></dialog></div>
}
