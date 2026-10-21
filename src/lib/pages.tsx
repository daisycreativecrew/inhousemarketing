import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPage, getProducts, getCases, getArticles, getSite, getAudit, isPreview, captureEnabled, checkoutEnabled, siteURL } from './content'
import { Hero, Sections, CaseStory, MediaView } from '@/components/experience'
import { Arrow, Button } from '@/components/ui'
import { SelfAudit } from '@/components/audit'
import { LeadForm } from '@/components/forms'
import type { Page } from '@/payload-types'
export function JsonLD({ data }: { data: unknown }) { return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} /> }
export async function metadataFor(path: string): Promise<Metadata> {
  const page = await getPage(path)
  const product = (await getProducts()).find(p => path === `/${p.slug}/`)
  const story = (await getCases()).find(c => path === `/esettanulmanyok/${c.slug}/`)
  const article = (await getArticles()).find(a => path === `/tudasbazis/${a.slug}/`)
  const doc = product || story || article || page
  if (!doc) return { title: 'Az oldal nem található', robots: { index: false, follow: false } }
  const seo = doc.seo
  const site = await getSite()
  const image = seo?.image || site.socialImage
  return { title: seo?.title || doc.title, description: seo?.description || (product ? product.intro : page?.intro), alternates: { canonical: path }, robots: await isPreview() || seo?.noindex ? { index: false, follow: false } : { index: true, follow: true }, openGraph: { title: seo?.title || doc.title, description: seo?.description || undefined, url: path, images: typeof image === 'object' && image?.approval === 'approved' && image.url ? [image.url] : ['/opengraph-image'] } }
}
function Breadcrumbs({ path, title }: { path: string; title: string }) {
  const segments = [{ label: 'Főoldal', href: '/' }]
  if (path.startsWith('/esettanulmanyok/')) segments.push({ label: 'Történetek', href: '/esettanulmanyok/' })
  if (path.startsWith('/tudasbazis/')) segments.push({ label: 'Tudástár', href: '/tudasbazis/' })
  return <><nav className="container breadcrumbs" aria-label="Morzsanavigáció"><ol>{segments.filter(s => s.href !== path).map(s => <li key={s.href}><Link href={s.href}>{s.label}</Link><span aria-hidden="true">/</span></li>)}<li aria-current="page">{title}</li></ol></nav><JsonLD data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [...segments.filter(s => s.href !== path), { label: title, href: path }].map((s,i) => ({ '@type': 'ListItem', position: i+1, name: s.label, item: siteURL()+s.href })) }} /></>
}
export async function renderPage(path: string) {
  const [page, products, stories, articles, site, preview] = await Promise.all([getPage(path), getProducts(), getCases(), getArticles(), getSite(), isPreview()])
  const product = products.find(p => path === `/${p.slug}/`)
  const story = stories.find(c => path === `/esettanulmanyok/${c.slug}/`)
  const article = articles.find(a => path === `/tudasbazis/${a.slug}/`)
  if (story) return <><Breadcrumbs path={path} title={story.client} /><CaseStory story={story} /></>
  if (article) return <><Breadcrumbs path={path} title={article.title} /><article><header className="container article-hero"><p className="eyebrow">{article.category} / IN/HOUSE TUDÁSTÁR</p><h1>{article.title}</h1><p className="editorial-lead">{article.intro}</p><p className="label">{new Date(article.publishedAt).toLocaleDateString('hu-HU', { timeZone: 'Europe/Budapest' })}</p><MediaView media={article.cover} /></header><Sections sections={article.sections} /></article><JsonLD data={{ '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.intro, datePublished: article.publishedAt, dateModified: article.updatedAt, author: { '@type': 'Organization', name: site.companyName }, mainEntityOfPage: siteURL()+path }} /></>
  if (product) {
    const hero: Page = { ...product, path, title: product.title, cta: product.cta, secondary: { label: 'Összehasonlítom a három utat', href: '/arak/' }, createdAt: product.createdAt, updatedAt: product.updatedAt }
    return <><Breadcrumbs path={path} title={product.name} /><div data-package={product.slug}><Hero page={hero} /><div className="container product-summary"><strong>{product.responsibility}</strong><span>{product.delivery}</span><span>{product.priceLabel}</span></div></div><section className="section light-section"><div className="container"><p className="eyebrow">AMIRE ÉPÍTHETTEK</p><div className="editorial-columns">{product.includes?.map(item => <article key={item.id}><h2 className="h3">{item.title}</h2><p>{item.body}</p></article>)}</div><div className="exclusions"><h2 className="h3">A keretek is számítanak.</h2>{product.excludes?.map(item => <p key={item.id}><strong>{item.title}.</strong> {item.body}</p>)}</div></div></section><Sections sections={product.sections} /></>
  }
  if (!page) notFound()
  const home = path === '/'
  return <>{!home && <Breadcrumbs path={path} title={page.seo?.title || page.title} />}<Hero page={page} home={home} />{home && <JsonLD data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: siteURL(), publisher: { '@type': 'Organization', name: site.companyName, url: siteURL() } }} />}<Sections sections={page.sections} />
    {path === '/self-audit/' && <section className="section container audit-container"><SelfAudit audit={await getAudit()} /></section>}
    {path === '/esettanulmanyok/' && <section className="section container case-index">{stories.length ? stories.map(s => <Link key={s.id} href={`/esettanulmanyok/${s.slug}/`} className="case-preview"><div><span className="eyebrow">{s.client} / {s.industry}</span><h2>{s.title}</h2><p>{s.intro}</p>{s.approval !== 'approved' && <span className="label">JÓVÁHAGYÁSRA VÁRÓ ELŐNÉZET</span>}<span className="text-link">Elolvasom a történetet<Arrow /></span></div><span className="case-preview-slash" aria-hidden="true">/</span></Link>) : <div className="notice"><h2>Az ügyféltörténetek jóváhagyás alatt állnak.</h2><p>Addig is megismerhetitek a módszert és a három együttműködési utat.</p><Button link={{ label: 'A módszertan', href: '/modszer/' }} /></div>}</section>}
    {path === '/tudasbazis/' && <section className="section container article-index">{articles.map((a,i) => <Link key={a.id} href={`/tudasbazis/${a.slug}/`}><span className="article-index-number">0{i+1}</span><div><p className="eyebrow">{a.category}</p><h2>{a.title}</h2><p>{a.intro}</p></div><Arrow diagonal /></Link>)}</section>}
    {['/jelentkezes/build/','/audit/'].includes(path) && <section className="section container"><LeadForm intent={path === '/audit/' ? 'custom' : 'build'} enabled={await captureEnabled()} copy={site.formCopy} email={site.contactEmail} booking={/^https:\/\//.test(process.env.BOOKING_URL || '') ? process.env.BOOKING_URL : undefined} /></section>}
    {path === '/checkout/start/' && <section className="section container"><div className="checkout-panel"><p className="eyebrow">START / ÁTLÁTHATÓ FELTÉTELEK</p>{await checkoutEnabled() ? <><h2>A fizetési szolgáltatóhoz léptek tovább.</h2><p>A végleges fizetendő összeget és a vásárlási feltételeket a szolgáltatói felületen is ellenőrizzétek.</p><Link className="button" href="/api/checkout" prefetch={false} data-event="begin_checkout">Tovább a biztonságos fizetéshez<Arrow /></Link></> : <><h2>A vásárlás még nem nyílt meg.</h2><p>A végleges ár, a hozzáférés és a szerződési feltételek jóváhagyása szükséges. Most nem kérünk fizetési vagy számlázási adatot.</p><Button link={{ label: 'Megnézem, mit ad a START', href: '/start/' }} /><Button link={{ label: 'Másik utat keresek', href: '/self-audit/' }} secondary />{site.contactEmail && <a className="text-link" href={`mailto:${site.contactEmail}`}>Kérdésem van a termékről<Arrow /></a>}</>}</div></section>}
    {!home && preview && ['/aszf/','/adatkezeles/'].includes(path) && <div className="container notice">Éles használat előtt jogi ellenőrzés szükséges. A rendszer nem tekinti ezt végleges jogi dokumentumnak.</div>}
  </>
}
