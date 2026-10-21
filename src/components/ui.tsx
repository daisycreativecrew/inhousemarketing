import Link from 'next/link'
import type { ReactNode } from 'react'
export type LinkData = { label?: string | null; href?: string | null } | null | undefined
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg className="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.6" /></svg>
}
export function Button({ link, secondary = false, event, location, children }: { link?: LinkData; secondary?: boolean; event?: string; location?: string; children?: ReactNode }) {
  if (!link?.href || !link.label) return null
  return <Link className={`button ${secondary ? 'button-secondary' : ''}`} href={link.href} data-event={event} data-location={location}>{children || link.label}<Arrow /></Link>
}
export function Logo({ name = 'IN/HOUSE MARKETING' }: { name?: string }) {
  return <span className="wordmark" aria-label={name}>IN<span className="slash">/</span>HOUSE<span className="wordmark-sub">MARKETING</span></span>
}
export function SectionHeading({ eyebrow, title, body }: { eyebrow?: string | null; title: string; body?: string | null }) {
  return <div className="section-heading">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{body && <p className="section-intro">{body}</p>}</div>
}
