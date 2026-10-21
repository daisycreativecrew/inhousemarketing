import { ImageResponse } from 'next/og'
export const alt = 'IN/HOUSE MARKETING — A káoszból kontroll lesz.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default function Image() {
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', background: '#0B0B0B', color: '#F4F2ED', width: '100%', height: '100%', padding: '70px', fontFamily: 'sans-serif' }}><div style={{ display:'flex', fontSize: 32 }}>IN<span style={{ color: '#C6FF00' }}>/</span>HOUSE MARKETING</div><div style={{ display:'flex', flexDirection: 'column', marginTop: 90, fontSize: 88, fontWeight: 900, lineHeight: 1 }}>A KÁOSZBÓL<span style={{ color: '#C6FF00' }}>KONTROLL LESZ.</span></div><div style={{ display:'flex', marginTop: 50, fontSize: 22 }}>TUDÁS. MÓDSZER. MŰKÖDÉS. HÁZON BELÜL.</div></div>, size)
}
