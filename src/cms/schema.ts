import type { Access, Block, CollectionConfig, Field, GlobalConfig, PayloadRequest, Where } from 'payload'

export const staff = ({ req }: { req: PayloadRequest }): boolean => Boolean(req.user)
export const admin = ({ req }: { req: PayloadRequest }): boolean => req.user?.role === 'admin'
const publisher = ({ req }: { req: PayloadRequest }): boolean => ['admin', 'publisher'].includes(req.user?.role ?? '')
const publicDocs: Access = ({ req }) => req.user ? true : { _status: { equals: 'published' } }
const approvedDocs: Access = ({ req }) => req.user ? true : ({ and: [{ _status: { equals: 'published' } }, { approval: { equals: 'approved' } }] } as Where)
const text = (name: string, required = false): Field => ({ name, type: 'text', required })
const area = (name: string, required = false): Field => ({ name, type: 'textarea', required })
export const linkFields: Field[] = [text('label', true), {
  name: 'href', type: 'text', required: true,
  validate: (value: unknown) => typeof value === 'string' && (/^\/(?!\/)/.test(value) || /^https:\/\//.test(value) || /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) || 'Belső útvonal, HTTPS URL vagy e-mail-link szükséges.',
}]
const cta = (name = 'cta'): Field => ({ name, type: 'group', fields: [text('label'), { name: 'href', type: 'text', validate: (value: unknown) => !value || typeof value === 'string' && (/^\/(?!\/)/.test(value) || /^https:\/\//.test(value)) || 'Belső útvonal vagy HTTPS URL szükséges.' }] })
const approval: Field = { name: 'approval', label: 'Bizonyíték jóváhagyása', type: 'select', defaultValue: 'pending', required: true, options: [{ label: 'Ellenőrzendő', value: 'pending' }, { label: 'Jóváhagyott', value: 'approved' }, { label: 'Elutasított', value: 'rejected' }], access: { create: publisher, update: publisher } }
const seo: Field = { name: 'seo', type: 'group', fields: [text('title', true), area('description', true), { name: 'image', type: 'upload', relationTo: 'media' }, { name: 'noindex', type: 'checkbox', defaultValue: false }] }
const items: Field = { name: 'items', type: 'array', fields: [text('kicker'), text('title', true), area('body', true), text('href'), { name: 'evidence', type: 'relationship', relationTo: 'evidence' }] }
const block = (slug: string, label: string): Block => ({ slug, labels: { singular: label, plural: label }, fields: [text('eyebrow'), text('title', true), area('body'), items, cta(), { name: 'caseStudy', type: 'relationship', relationTo: 'cases' }, { name: 'experts', type: 'relationship', relationTo: 'experts', hasMany: true }] })
export const blocks: Block[] = [
  block('story', 'Kiemelt esettanulmány'), block('problems', 'Probléma és bizonyíték'),
  block('system', 'Működési rendszer'), block('products', 'Három út'), block('selector', 'Útvonalválasztó'),
  block('preview', 'Termékbelenézés'), block('experts', 'Módszertan és szakértők'),
  block('faq', 'Gyakori kérdések'), block('editorial', 'Editorial tartalom'), block('cta', 'Záró felhívás'),
]

const versioning = { drafts: { autosave: { interval: 1000 } }, maxPerDoc: 30 }
const writeAccess = { read: publicDocs, create: staff, update: staff, delete: admin }
const publishGuard: NonNullable<CollectionConfig['hooks']>['beforeChange'] = [({ data, req }) => {
  if (data._status === 'published' && req.user && !['admin', 'publisher'].includes(req.user.role)) throw new Error('Publikáláshoz kiadói jogosultság szükséges.')
  return data
}]
const previewURL = (path: string) => `${process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/preview?path=${encodeURIComponent(path)}`

export const Users: CollectionConfig = {
  slug: 'users', labels: { singular: 'Felhasználó', plural: 'Felhasználók' },
  auth: { tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 600000, cookies: { sameSite: 'Lax', secure: process.env.COOKIE_SECURE === 'true' } },
  admin: { useAsTitle: 'email', group: 'Rendszer' },
  access: { read: ({ req }) => req.user?.role === 'admin' ? true : { id: { equals: req.user?.id } }, create: admin, update: admin, delete: admin, admin: staff },
  hooks: { beforeValidate: [async ({ data, operation, req }) => {
    if (operation === 'create' && (await req.payload.count({ collection: 'users', overrideAccess: true, req })).totalDocs === 0) return { ...data, role: 'admin' }
    return data
  }] },
  fields: [text('name', true), { name: 'role', type: 'select', required: true, defaultValue: 'editor', options: ['admin', 'publisher', 'editor'], access: { update: admin } }],
}
export const Media: CollectionConfig = {
  slug: 'media', labels: { singular: 'Média', plural: 'Médiatár' }, admin: { group: 'Tartalom', useAsTitle: 'alt' },
  access: { ...writeAccess, read: ({ req }) => req.user ? true : { approval: { equals: 'approved' } } },
  upload: { staticDir: 'media', mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'], imageSizes: [{ name: 'card', width: 800, height: 600, fit: 'inside' }, { name: 'wide', width: 1600, height: 1000, fit: 'inside' }] },
  fields: [text('alt', true), area('caption'), text('source', true), approval, { name: 'usageRightsConfirmed', type: 'checkbox', defaultValue: false }, { name: 'approvedBy', type: 'text', access: { update: publisher } }],
  hooks: { beforeChange: [({ data }) => { if (data.approval === 'approved' && (!data.usageRightsConfirmed || !data.approvedBy)) throw new Error('Jóváhagyáshoz rögzítsd a használati jogot és a jóváhagyó nevét.'); return data }] },
}
export const Pages: CollectionConfig = {
  slug: 'pages', labels: { singular: 'Oldal', plural: 'Oldalak' }, access: writeAccess, versions: versioning,
  admin: { useAsTitle: 'title', group: 'Tartalom', preview: (doc) => previewURL(String(doc.path)), livePreview: { url: ({ data }) => previewURL(String(data.path)), breakpoints: [{ label: 'Mobil', name: 'mobile', width: 390, height: 844 }, { label: 'Desktop', name: 'desktop', width: 1440, height: 1000 }] } },
  hooks: { beforeChange: publishGuard },
  fields: [{ name: 'path', type: 'text', required: true, unique: true, index: true, validate: (v: unknown) => typeof v === 'string' && /^\/(?:[a-z0-9-]+\/)*$/.test(v) || 'Perjellel kezdődő és végződő útvonal szükséges.' }, text('eyebrow'), text('title', true), text('accent'), area('intro', true), cta(), cta('secondary'), { name: 'sections', type: 'blocks', blocks }, { name: 'legalApproved', type: 'checkbox', defaultValue: false, access: { update: publisher } }, seo],
}
export const Products: CollectionConfig = {
  slug: 'products', labels: { singular: 'Termék', plural: 'Termékek' }, access: writeAccess, versions: versioning,
  admin: { group: 'Értékesítés', useAsTitle: 'name', preview: (doc) => previewURL(`/${doc.slug}/`) }, hooks: { beforeChange: publishGuard },
  fields: [{ name: 'slug', type: 'select', unique: true, required: true, options: ['start', 'build', 'custom'] }, text('name', true), text('eyebrow', true), text('title', true), area('intro', true), text('responsibility', true), text('delivery', true), text('priceLabel', true), { name: 'priceHuf', type: 'number', min: 0 }, { name: 'vatPercent', type: 'number', min: 0, max: 100 }, { name: 'businessApproved', type: 'checkbox', defaultValue: false, access: { update: publisher } }, { name: 'accessDuration', type: 'text' }, { name: 'reviewRounds', type: 'number', min: 0 }, { name: 'implementationDays', type: 'number', min: 0 }, cta(), { name: 'includes', type: 'array', fields: [text('title', true), area('body', true)] }, { name: 'excludes', type: 'array', fields: [text('title', true), area('body', true)] }, { name: 'sections', type: 'blocks', blocks }, seo],
}
export const Cases: CollectionConfig = {
  slug: 'cases', labels: { singular: 'Esettanulmány', plural: 'Esettanulmányok' }, access: { ...writeAccess, read: approvedDocs }, versions: versioning,
  admin: { group: 'Bizonyítékok', useAsTitle: 'client', preview: (doc) => previewURL(`/esettanulmanyok/${doc.slug}/`) }, hooks: { beforeChange: [...publishGuard!, ({ data }) => { if (data.approval === 'approved' && (!data.source || !data.approvedBy || !data.approvedAt)) throw new Error('Jóváhagyáshoz forrás, jóváhagyó és dátum szükséges.'); return data }] },
  fields: [text('slug', true), text('client', true), text('industry', true), text('title', true), area('intro', true), area('context', true), text('source', true), approval, { name: 'approvedBy', type: 'text', access: { update: publisher } }, { name: 'approvedAt', type: 'date', access: { update: publisher } }, { name: 'logo', type: 'upload', relationTo: 'media' }, { name: 'chapters', type: 'array', minRows: 1, fields: [text('kicker', true), text('title', true), area('body', true), { name: 'media', type: 'upload', relationTo: 'media' }, { name: 'evidence', type: 'relationship', relationTo: 'evidence', hasMany: true }] }, { name: 'capabilities', type: 'array', fields: [text('label', true), area('tasks', true)] }, cta(), seo],
}
export const Evidence: CollectionConfig = {
  slug: 'evidence', labels: { singular: 'Bizonyíték', plural: 'Bizonyítéktár' }, access: { ...writeAccess, read: approvedDocs }, versions: versioning, admin: { group: 'Bizonyítékok', useAsTitle: 'title' },
  fields: [text('title', true), { name: 'kind', type: 'select', required: true, options: ['inline', 'before-after', 'case-preview', 'testimonial', 'gallery', 'workflow', 'expert-insight', 'quote', 'video', 'timeline', 'capability', 'case-cta'] }, area('body', true), text('source', true), approval, text('approvedBy'), { name: 'approvedAt', type: 'date' }, { name: 'media', type: 'upload', relationTo: 'media', hasMany: true }, { name: 'caseStudy', type: 'relationship', relationTo: 'cases' }],
  hooks: { beforeChange: [...publishGuard!, ({ data, req }) => { if (data.approval === 'approved' && (!['admin', 'publisher'].includes(req.user?.role ?? '') && req.user || !data.approvedBy || !data.approvedAt || !data.source)) throw new Error('Kiadói jóváhagyás, forrás és dátum szükséges.'); return data }] },
}
export const Articles: CollectionConfig = {
  slug: 'articles', labels: { singular: 'Cikk', plural: 'Tudástár' }, access: writeAccess, versions: versioning, admin: { group: 'Tartalom', useAsTitle: 'title', preview: (doc) => previewURL(`/tudasbazis/${doc.slug}/`) }, hooks: { beforeChange: publishGuard },
  fields: [text('slug', true), text('title', true), text('category', true), area('intro', true), { name: 'publishedAt', type: 'date', required: true }, { name: 'author', type: 'relationship', relationTo: 'experts' }, { name: 'cover', type: 'upload', relationTo: 'media' }, { name: 'sections', type: 'blocks', blocks }, cta(), seo],
}
export const Experts: CollectionConfig = {
  slug: 'experts', labels: { singular: 'Szakértő', plural: 'Szakértők' }, access: { ...writeAccess, read: approvedDocs }, versions: versioning, admin: { group: 'Bizonyítékok', useAsTitle: 'name' }, hooks: { beforeChange: publishGuard },
  fields: [text('name', true), text('role', true), area('bio', true), text('credentials', true), { name: 'portrait', type: 'upload', relationTo: 'media' }, approval],
}
export const Leads: CollectionConfig = {
  slug: 'leads', labels: { singular: 'Megkeresés', plural: 'Megkeresések' }, admin: { group: 'Értékesítés', useAsTitle: 'email' },
  access: { read: publisher, create: () => false, update: publisher, delete: admin },
  fields: [{ name: 'intent', type: 'select', options: ['build', 'custom', 'start', 'contact', 'audit-result'], required: true }, text('name', true), text('email', true), text('company'), area('message'), text('team'), text('timing'), text('capacity'), text('platforms'), text('decisionMakers'), { name: 'consentAt', type: 'date', required: true }, text('privacyVersion', true), { name: 'status', type: 'select', defaultValue: 'new', options: ['new', 'qualified', 'contacted', 'won', 'closed'] }, { name: 'delivery', type: 'select', defaultValue: 'local', options: ['local', 'delivered', 'failed'] }, { name: 'requestKey', type: 'text', unique: true, required: true }],
}
export const Activity: CollectionConfig = {
  slug: 'activity', labels: { singular: 'Bejegyzés', plural: 'Szerkesztési napló' }, admin: { group: 'Rendszer' }, access: { read: admin, create: () => false, update: () => false, delete: () => false },
  fields: [text('actor', true), text('action', true), text('document', true)],
}

export const Site: GlobalConfig = {
  slug: 'site', label: 'Márka és navigáció', access: { read: () => true, update: publisher },
  fields: [text('name', true), text('tagline', true), { name: 'logo', type: 'upload', relationTo: 'media' }, { name: 'navigation', type: 'array', fields: linkFields }, { name: 'footerLinks', type: 'array', fields: linkFields }, text('footerTitle', true), area('footerBody', true), cta(), text('contactEmail'), text('companyName'), text('companyAddress'), text('taxNumber'), { name: 'social', type: 'array', fields: linkFields }, text('defaultSeoTitle', true), area('defaultSeoDescription', true), { name: 'socialImage', type: 'upload', relationTo: 'media' }, { name: 'privacyVersion', type: 'text', required: true }, { name: 'privacyApproved', type: 'checkbox', defaultValue: false }, { name: 'formCopy', type: 'group', fields: [text('nameLabel'), text('emailLabel'), text('companyLabel'), text('teamLabel'), text('timingLabel'), text('capacityLabel'), text('platformsLabel'), text('decisionMakersLabel'), text('messageLabel'), area('privacyLabel'), text('submitLabel'), text('downloadLabel'), area('fallbackNotice'), area('successMessage')] }],
}
export const Audit: GlobalConfig = {
  slug: 'audit', label: 'Self-Audit és routing', access: { read: () => true, update: publisher },
  fields: [text('title', true), area('intro', true), { name: 'questions', type: 'array', minRows: 1, maxRows: 10, fields: [text('key', true), text('title', true), area('hint'), { name: 'options', type: 'array', minRows: 2, fields: [text('label', true), text('reason', true), ...['start', 'build', 'custom'].map((name): Field => ({ name, type: 'number', required: true, min: -10, max: 10, defaultValue: 0 }))] }] }, ...['start', 'build', 'custom'].map((name): Field => ({ name, type: 'group', fields: [text('title', true), area('body', true)] }))],
}
