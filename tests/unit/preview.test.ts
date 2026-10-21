import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { previewOrigin } from '../../scripts/lib/preview-origin.mjs'

const created: string[] = []
const setup = resolve('scripts/setup-local.mjs')
const temporary = () => { const path=mkdtempSync(join(tmpdir(),'inhouse-preview-')); created.push(path); return path }
afterEach(() => { for (const path of created.splice(0)) rmSync(path,{recursive:true,force:true}) })
describe('private preview configuration', () => {
  it('uses the actual Codespaces HTTPS forwarding origin', () => {
    expect(previewOrigin({CODESPACE_NAME:'friendly-space-abc123',GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:'app.github.dev'})).toBe('https://friendly-space-abc123-3000.app.github.dev')
  })
  it('uses the local origin outside Codespaces', () => expect(previewOrigin({})).toBe('http://localhost:3000'))
  it.each([
    {CODESPACE_NAME:'name\nLEAD_CAPTURE_ENABLED=true'},
    {CODESPACE_NAME:'valid-name',GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:'example.test/path'},
    {CODESPACE_NAME:'valid-name',GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:'example.test:443'},
  ])('rejects origin injection %j', environment => expect(() => previewOrigin(environment)).toThrow())
  it('creates private, HTTPS-cookie configuration without enabling lead collection', () => {
    const cwd=temporary()
    const result=spawnSync(process.execPath,[setup],{cwd,env:{...process.env,CODESPACE_NAME:'review-abc123',GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:'app.github.dev'},encoding:'utf8'})
    expect(result.status).toBe(0)
    const content=readFileSync(join(cwd,'.env.local'),'utf8')
    expect(content.includes('SITE_URL=https://review-abc123-3000.app.github.dev\n')).toBe(true)
    expect(content.includes('COOKIE_SECURE=true\n')).toBe(true)
    expect(content.includes('SITE_MODE=preview\n')).toBe(true)
    expect(content.includes('LEAD_CAPTURE_ENABLED=false\n')).toBe(true)
    expect(/^PAYLOAD_SECRET=[a-f0-9]{96}$/m.test(content)).toBe(true)
    expect(statSync(join(cwd,'.env.local')).mode & 0o777).toBe(0o600)
  })
  it('preserves existing configuration byte for byte', () => {
    const cwd=temporary(),file=join(cwd,'.env.local')
    writeFileSync(file,'SITE_URL=https://existing.example\nSITE_MODE=preview\n',{mode:0o600})
    const digest=() => createHash('sha256').update(readFileSync(file)).digest('hex')
    const before=digest()
    expect(spawnSync(process.execPath,[setup],{cwd,env:{...process.env,CODESPACE_NAME:'new-name'},stdio:'ignore'}).status).toBe(0)
    expect(digest()).toBe(before)
  })
  it('does not create a configuration after rejecting an invalid origin', () => {
    const cwd=temporary()
    expect(spawnSync(process.execPath,[setup],{cwd,env:{...process.env,CODESPACE_NAME:'name\nINJECTED=true'},stdio:'ignore'}).status).not.toBe(0)
    expect(existsSync(join(cwd,'.env.local'))).toBe(false)
  })
})
