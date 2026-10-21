import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { cms, siteURL } from '@/lib/content'
export async function GET(req: NextRequest) {
  const { user } = await (await cms()).auth({ headers: req.headers })
  if (!user) return NextResponse.json({ error: 'Az előnézethez adminbejelentkezés szükséges.' }, { status: 401 })
  const path = req.nextUrl.searchParams.get('path') || '/'
  if (!/^\/(?!\/)[a-z0-9/-]*$/.test(path) || path.startsWith('/api/') || path.startsWith('/admin')) return NextResponse.json({ error: 'Érvénytelen útvonal.' }, { status: 400 })
  ;(await draftMode()).enable()
  return NextResponse.redirect(new URL(path, siteURL()))
}
