import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import { siteURL } from '@/lib/content'
export async function GET() { (await draftMode()).disable(); return NextResponse.redirect(new URL('/', siteURL())) }
