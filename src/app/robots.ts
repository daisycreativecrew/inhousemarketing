import type { MetadataRoute } from 'next'
import { siteURL } from '@/lib/content'
export const dynamic = 'force-dynamic'
export default function robots(): MetadataRoute.Robots {
  return process.env.SITE_MODE !== 'live' ? { rules: { userAgent: '*', disallow: '/' } } : { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/checkout/', '/jelentkezes/', '/audit/'] }, sitemap: siteURL()+'/sitemap.xml' }
}
