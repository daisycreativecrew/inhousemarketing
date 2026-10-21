import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
const routes = ['/', '/start/','/build/','/custom/','/arak/','/esettanulmanyok/','/esettanulmanyok/trustphone/','/self-audit/','/tudasbazis/','/tudasbazis/marketing-workflow/','/tudasbazis/marketing-insourcing/','/tudasbazis/marketing-meres/','/modszer/','/rolunk/','/kapcsolat/','/checkout/start/','/jelentkezes/build/','/audit/','/adatkezeles/','/aszf/']
test.beforeEach(async ({ page }) => { await page.addInitScript(() => localStorage.setItem('ih-consent','necessary')) })
test('all authored routes render server content, distinct SEO and one H1', async ({ page }) => {
  const titles = new Set<string>()
  for (const route of routes) {
    const response = await page.goto(route)
    expect(response?.status(), route).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).not.toBeEmpty()
    const title = await page.title()
    expect(titles.has(title), route+' unique title').toBe(false)
    titles.add(title)
    const canonical = await page.locator('link[rel=canonical]').getAttribute('href')
    expect(new URL(canonical!).pathname.replace(/\/$/,''), route).toBe(route.replace(/\/$/,''))
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/)
  }
})
test('all local content links resolve without dead ends', async ({ page, request }) => {
  const seen = new Set<string>()
  for (const route of ['/', '/start/','/build/','/custom/','/kapcsolat/','/tudasbazis/','/esettanulmanyok/trustphone/']) {
    await page.goto(route)
    const links = await page.locator('main a[href^="/"]').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')!))
    for (const href of links) if (!seen.has(href)) { seen.add(href); expect((await request.get(href)).status(),href).toBe(200) }
  }
})
test('self audit works without an email gate, allows backtracking and returns each path', async ({ page }) => {
  for (const [answer, tier] of [[0,'START'],[1,'BUILD'],[2,'CUSTOM']] as const) {
    await page.goto('/self-audit/')
    const audit = page.locator('.audit-shell')
    await expect(audit.getByRole('button',{name:'Következő kérdés'})).toBeDisabled()
    for (let step = 0; step < 7; step++) {
      await audit.locator('input[type=radio]').nth(answer).check()
      if (step === 1) { await audit.getByRole('button',{name:'Vissza'}).click(); await expect(audit.locator('input[type=radio]').nth(answer)).toBeChecked(); await audit.getByRole('button',{name:'Következő kérdés'}).click() }
      await audit.getByRole('button',{name:step === 6 ? 'Megnézem a javaslatot' : 'Következő kérdés'}).click()
    }
    await expect(page.locator('.audit-result h2')).toContainText(tier)
    await expect(page.locator('.audit-result input[type=email]')).toHaveCount(0)
    await page.locator('.audit-result').getByRole('link',{name:`Megnézem a ${tier} megoldást`}).click()
    await expect(page).toHaveURL(new RegExp('/'+tier.toLowerCase()))
  }
})
test('package selector, skill map, FAQ and modal respond to keyboard and pointer', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button',{name:/03.*Új működés kell/}).click()
  await expect(page.locator('.path-result')).toContainText('CUSTOM')
  await page.getByRole('button',{name:/PPC/}).click()
  await expect(page.locator('.skill-description')).toContainText('Reddit')
  await page.locator('.faq summary').first().click()
  await expect(page.locator('.faq details').first()).toHaveAttribute('open','')
  await page.getByRole('button',{name:'Részletes nézet'}).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
})
test('forms download an honest local summary and checkout cannot fake a purchase', async ({ page, request }) => {
  await page.goto('/jelentkezes/build/')
  await expect(page.locator('.lead-form input[name=email]')).toHaveAttribute('type','email')
  await page.locator('textarea[name=message]').fill('Saját belső marketingműködést szeretnénk.')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button',{name:'Összefoglaló letöltése'}).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('inhouse-build-osszefoglalo.txt')
  await expect(page.locator('#form-status')).toContainText('nem küldtük el')
  await page.goto('/checkout/start/')
  await expect(page.getByRole('heading',{name:'A vásárlás még nem nyílt meg.'})).toBeVisible()
  expect((await request.get('/api/checkout')).status()).toBe(503)
  expect((await request.get('/api/preview?path=/')).status()).toBe(401)
  expect((await request.get('/api/leads')).status()).toBe(403)
  const cases = await request.get('/api/cases?draft=true')
  expect((await cases.json()).docs).toHaveLength(0)
})
test('consent defaults to denied and can be revoked without sending PII', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button',{name:'Sütibeállítások'}).click()
  await page.getByRole('button',{name:'Mérés engedélyezése'}).click()
  await page.locator('.hero-copy .button').first().click()
  expect(await page.evaluate(() => window.dataLayer?.some(e => typeof e === 'object' && e != null && 'event' in e && e.event === 'hero_cta_click'))).toBe(true)
  await page.getByRole('button',{name:'Sütibeállítások'}).click()
  await page.getByRole('button',{name:'Csak szükséges'}).click()
  expect(await page.evaluate(() => localStorage.getItem('ih-consent'))).toBe('necessary')
})
for (const width of [360,390,768,1024,1280,1440]) test(`responsive layout and accessibility at ${width}px`, async ({ page }) => {
  await page.setViewportSize({width,height:900})
  for (const path of ['/', '/esettanulmanyok/trustphone/','/self-audit/','/audit/']) {
    await page.goto(path)
    await page.emulateMedia({ reducedMotion:'reduce' })
    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), path+' no overflow').toBe(true)
    const result = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()
    expect(result.violations.map(v => ({id:v.id, nodes:v.nodes.map(n=>n.target)})), path).toEqual([])
  }
})
test('mobile menu and reduced motion remain usable', async ({ page }) => {
  await page.setViewportSize({width:390,height:844})
  await page.emulateMedia({reducedMotion:'reduce'})
  await page.goto('/')
  await page.getByRole('button',{name:'Menü'}).click()
  await expect(page.locator('#main-navigation')).toBeVisible()
  await page.locator('#main-navigation a').first().focus()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button',{name:'Menü'})).toBeFocused()
  expect(await page.locator('.system-module').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none')
  expect(await page.locator('.hero-copy .button').first().evaluate(el => el.getBoundingClientRect().bottom < 844)).toBe(true)
})
test('default motion also preserves readable text contrast', async ({ page }) => {
  await page.setViewportSize({width:390,height:844})
  await page.emulateMedia({reducedMotion:'no-preference'})
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()
  expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([])
})
