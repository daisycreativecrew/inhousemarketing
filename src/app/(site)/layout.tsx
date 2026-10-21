import localFont from 'next/font/local'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getSite, isPreview, siteURL } from '@/lib/content'
import { Logo, Arrow } from '@/components/ui'
import { Consent, ConsentButton, Experience, Navigation } from '@/components/client'
import './style.css'
const display = localFont({ src: '../../../public/fonts/archivo-black.woff2', variable: '--font-display', display: 'swap' })
const body = localFont({ src: '../../../public/fonts/ibm-plex-sans.woff2', variable: '--font-body', display: 'optional', weight: '400 700' })
const serif = localFont({ src: '../../../public/fonts/source-serif.woff2', variable: '--font-editorial', display: 'swap', weight: '400', preload: false })
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  const social = typeof site.socialImage === 'object' && site.socialImage?.approval === 'approved' ? site.socialImage.url : null
  return { metadataBase: new URL(siteURL()), title: { default: site.defaultSeoTitle, template: '%s — IN/HOUSE MARKETING' }, description: site.defaultSeoDescription, robots: await isPreview() ? { index: false, follow: false } : { index: true, follow: true }, openGraph: { type: 'website', locale: 'hu_HU', siteName: site.name, images: [social || '/opengraph-image'] }, twitter: { card: 'summary_large_image' } }
}
export default async function Layout({ children }: { children: React.ReactNode }) {
  const [site, preview] = await Promise.all([getSite(), isPreview()])
  const logo = typeof site.logo === 'object' && site.logo?.approval === 'approved' && site.logo.usageRightsConfirmed && site.logo.url ? <Image className="custom-logo" src={site.logo.url} alt={site.name} width={160} height={60} priority /> : <Logo name={site.name} />
  return <html lang="hu" className={`${display.variable} ${body.variable} ${serif.variable}`}><body><a className="skip-link" href="#main">Ugrás a tartalomra</a>{preview && <div className="preview-bar"><span>SZERKESZTŐI ELŐNÉZET</span><span>Jóváhagyásra váró tartalom · nem éles értékesítés</span><Link href="/admin">Tartalomkezelés ↗</Link></div>}<header className="site-header"><div className="container header-inner"><Link href="/" className="logo-link" aria-label={`${site.name} — főoldal`}>{logo}</Link><Navigation links={site.navigation} /><Link className="nav-cta" href={site.cta?.href || "/self-audit/"}><span>{site.cta?.label || "Saját utunk"}</span><Arrow diagonal /></Link></div></header><main id="main">{children}</main><footer className="site-footer"><div className="container"><div className="footer-top"><Link href="/" aria-label={`${site.name} — főoldal`}>{logo}</Link><div className="footer-copy"><strong>{site.footerTitle}</strong><p>{site.footerBody}</p></div><a className="back-top" href="#main" aria-label="Vissza az oldal tetejére">↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {site.companyName}</span><nav aria-label="Lábléc">{site.footerLinks?.map(l => <Link href={l.href} key={l.id || l.href}>{l.label}</Link>)}{site.social?.map(l => <a key={l.href} href={l.href} rel="noopener noreferrer">{l.label}</a>)}<ConsentButton /></nav></div></div></footer><Consent /><Experience /></body></html>
}
