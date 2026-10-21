import { checkoutEnabled } from '@/lib/content'
import { NextResponse } from 'next/server'
export async function GET() {
  if (!await checkoutEnabled()) return NextResponse.json({ error: 'A vásárlás még nem nyílt meg.' }, { status: 503 })
  return NextResponse.redirect(process.env.START_CHECKOUT_URL!, 303)
}
