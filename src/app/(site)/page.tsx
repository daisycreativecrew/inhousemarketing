import { metadataFor, renderPage } from '@/lib/pages'
export const dynamic = 'force-dynamic'
export const generateMetadata = () => metadataFor('/')
export default function Page() { return renderPage('/') }
