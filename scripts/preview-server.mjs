import { spawn } from 'node:child_process'
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { previewOrigin } from './lib/preview-origin.mjs'

if (existsSync('.env.local')) process.loadEnvFile('.env.local')
const origin = previewOrigin()
const configured = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
if (configured !== origin) throw new Error('A SITE_URL nem ehhez a tesztkörnyezethez tartozik. Állítsd erre a környezet címére a .env.local fájlban, a többi érték megtartásával.')
if (!existsSync('.next/BUILD_ID')) throw new Error('Hiányzik a build. Futtasd: npm run build')
mkdirSync('.data', { recursive: true })

async function probe() {
  try {
    const response = await fetch('http://127.0.0.1:3000/', { signal: AbortSignal.timeout(3000) })
    const html = await response.text()
    return response.ok && html.includes('id="main"') && html.includes('<h1') && html.includes('SZERKESZTŐI ELŐNÉZET') ? 'ready' : 'occupied'
  } catch { return 'offline' }
}
const state = await probe()
if (state === 'occupied') throw new Error('A 3000-es porton más vagy nem előnézeti szerver fut. Nem állítjuk le.')
if (state === 'ready') {
  console.log(`A tesztoldal már fut.\nWeboldal: ${origin}\nSaját adminfiók: ${origin}/admin`)
  process.exit(0)
}
const log = openSync('.data/preview-server.log', 'a', 0o600)
const child = spawn(process.execPath, [resolve('node_modules/next/dist/bin/next'), 'start', '--hostname', '0.0.0.0', '--port', '3000'], {
  cwd: process.cwd(), detached: true, stdio: ['ignore', log, log],
  env: { ...process.env, SITE_URL: origin, SITE_MODE: 'preview', LEAD_CAPTURE_ENABLED: 'false', START_CHECKOUT_URL: '', BOOKING_URL: '' },
})
closeSync(log)
child.unref()
const startTicks = readFileSync(`/proc/${child.pid}/stat`, 'utf8').split(') ')[1].split(' ')[19]
writeFileSync('.data/preview-server.json', JSON.stringify({ pid: child.pid, startTicks, origin }), { mode: 0o600 })
const deadline = Date.now() + 60000
while (Date.now() < deadline) {
  if (await probe() === 'ready') {
    const audit = await fetch('http://127.0.0.1:3000/self-audit/', { signal: AbortSignal.timeout(5000) })
    if (!audit.ok || !(await audit.text()).includes('<h1')) throw new Error('A Self-Audit ellenőrzése sikertelen. Napló: .data/preview-server.log')
    console.log(`A tesztverzió elindult.\nWeboldal: ${origin}\nSaját adminfiók: ${origin}/admin\nGitHub Codespaces esetén a 3000-es port láthatósága maradjon Private.`)
    process.exit(0)
  }
  await new Promise(resolve => setTimeout(resolve, 500))
}
throw new Error('A tesztverzió nem lett kész 60 másodpercen belül. Ellenőrizd: .data/preview-server.log')
