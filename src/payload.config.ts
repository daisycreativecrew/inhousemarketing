import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { hu } from '@payloadcms/translations/languages/hu'
import { en } from '@payloadcms/translations/languages/en'
import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Users, Media, Pages, Products, Cases, Evidence, Articles, Experts, Leads, Activity, Site, Audit } from './cms/schema'
import { transactionalEmail } from './lib/email'
const dirname = path.dirname(fileURLToPath(import.meta.url))
const collections = [Users, Media, Pages, Products, Cases, Evidence, Articles, Experts, Leads, Activity]
for (const collection of collections.filter(c => !['users', 'leads', 'activity'].includes(c.slug))) {
  collection.hooks ??= {}
  collection.hooks.afterChange = [...(collection.hooks.afterChange ?? []), async ({ doc, req, operation }) => {
    if (req.user) await req.payload.create({ collection: 'activity', data: { actor: String(req.user.id), action: `${operation}:${collection.slug}`, document: String(doc.id) }, req, overrideAccess: true })
    return doc
  }]
}
if (!process.env.PAYLOAD_SECRET) throw new Error('PAYLOAD_SECRET missing. Run npm run setup:local or configure the environment.')
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  admin: { user: 'users', avatar: 'default', importMap: { baseDir: dirname }, meta: { titleSuffix: ' — IN/HOUSE Studio' }, autoLogin: false },
  i18n: { supportedLanguages: { hu, en }, fallbackLanguage: 'hu' },
  collections, globals: [Site, Audit], sharp, email: transactionalEmail,
  db: process.env.DATABASE_URL?.startsWith('postgres')
    ? postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL }, push: process.env.NODE_ENV !== 'production' && process.env.PAYLOAD_AUTO_PUSH !== 'false', migrationDir: path.resolve(dirname, 'migrations/postgres') })
    : sqliteAdapter({ client: { url: process.env.DATABASE_URL || 'file:./.data/inhouse.db' }, push: process.env.PAYLOAD_AUTO_PUSH !== 'false', migrationDir: path.resolve(dirname, 'migrations/sqlite'), busyTimeout: 5000 }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  upload: { limits: { fileSize: 25 * 1024 * 1024 }, abortOnLimit: true },
  csrf: [process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'],
})
