import { metadataFor, renderPage } from '@/lib/pages'
export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ slug: string[] }> }
export const generateMetadata = async ({ params }: Props) => metadataFor('/'+(await params).slug.join('/')+'/')
export default async function Page({ params }: Props) { return renderPage('/'+(await params).slug.join('/')+'/') }
