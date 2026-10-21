import 'server-only'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
export const cms = cache(() => getPayload({ config }))
export const isPreview = cache(async () => process.env.SITE_MODE !== 'live' || (await draftMode()).isEnabled)
export const siteURL = () => (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
export const getSite = cache(async () => (await cms()).findGlobal({ slug: 'site', depth: 1 }))
export const getAudit = cache(async () => (await cms()).findGlobal({ slug: 'audit' }))
export const getProducts = cache(async () => (await (await cms()).find({ collection: 'products', where: { _status: { equals: 'published' } }, limit: 3, depth: 2, sort: 'slug' })).docs.sort((a,b) => ['start', 'build', 'custom'].indexOf(a.slug) - ['start', 'build', 'custom'].indexOf(b.slug)))
export const getPage = cache(async (path: string) => {
  const preview = await isPreview()
  return (await (await cms()).find({ collection: 'pages', where: { and: [{ path: { equals: path } }, ...(preview ? [] : [{ _status: { equals: 'published' } }])] }, draft: preview, depth: 3, limit: 1, overrideAccess: true })).docs[0]
})
export const getCases = cache(async () => {
  const preview = await isPreview()
  const where: Where = preview ? {} : { and: [{ approval: { equals: 'approved' } }, { _status: { equals: 'published' } }] }
  return (await (await cms()).find({ collection: 'cases', where, draft: preview, depth: 2, limit: 100, overrideAccess: true })).docs
})
export const getArticles = cache(async () => (await (await cms()).find({ collection: 'articles', where: { _status: { equals: 'published' } }, limit: 100, sort: '-publishedAt', depth: 2 })).docs)
export const getExperts = cache(async () => (await (await cms()).find({ collection: 'experts', where: { and: [{ approval: { equals: 'approved' } }, { _status: { equals: 'published' } }] }, limit: 50, depth: 1 })).docs)
async function publishedLegal(path: string) {
  return (await (await cms()).find({ collection:'pages', where:{ and:[{ path:{equals:path} }, { _status:{equals:'published'} }] }, draft:false, limit:1, depth:0, overrideAccess:true })).docs[0]
}
export async function captureEnabled() {
  const [site, privacy] = await Promise.all([getSite(), publishedLegal('/adatkezeles/')])
  return process.env.LEAD_CAPTURE_ENABLED === 'true' && site.privacyApproved === true && privacy?.legalApproved === true
}
export async function checkoutEnabled() {
  const [products, site, terms, privacy] = await Promise.all([getProducts(), getSite(), publishedLegal('/aszf/'), publishedLegal('/adatkezeles/')])
  const product = products.find(p => p.slug === 'start')
  return Boolean(product?.businessApproved && product.priceHuf && product.vatPercent != null && terms?.legalApproved && privacy?.legalApproved && site.privacyApproved && /^https:\/\//.test(process.env.START_CHECKOUT_URL || ''))
}
