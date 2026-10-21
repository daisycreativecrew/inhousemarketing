import type { MetadataRoute } from 'next'
import { cms, getCases, getArticles, getProducts, siteURL } from '@/lib/content'
export const dynamic = 'force-dynamic'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (process.env.SITE_MODE !== 'live') return []
  const [pages, cases, articles, products] = await Promise.all([(await cms()).find({ collection: 'pages', where: { _status: { equals: 'published' } }, limit: 1000 }), getCases(), getArticles(), getProducts()])
  return [...pages.docs.filter(p => !p.seo?.noindex).map(p => ({ url: siteURL()+p.path, lastModified: p.updatedAt })), ...cases.filter(c => c.approval === 'approved' && c._status === 'published' && !c.seo?.noindex).map(c => ({ url: `${siteURL()}/esettanulmanyok/${c.slug}/`, lastModified: c.updatedAt })), ...articles.filter(a => !a.seo?.noindex).map(a => ({ url: `${siteURL()}/tudasbazis/${a.slug}/`, lastModified: a.updatedAt })), ...products.filter(p => !p.seo?.noindex).map(p => ({ url: `${siteURL()}/${p.slug}/`, lastModified: p.updatedAt }))]
}
