import { test, expect } from '@playwright/test'
import { randomBytes } from 'node:crypto'

test.use({ trace: 'off' })

test('the first-user form creates an authenticated admin', async ({ page, baseURL }) => {
  test.skip(process.env.E2E_FIRST_USER !== 'true', 'Explicit opt-in; requires a preview database without users.')
  const origin = new URL(baseURL!).origin
  const initialized = await page.request.get('/api/users/init')
  expect(initialized.ok()).toBe(true)
  expect((await initialized.json()).initialized).toBe(false)
  let createdID: number | undefined
  try {
    await page.goto('/admin')
    await page.locator('input[name=email]').waitFor()
    await expect(page).toHaveURL(/\/admin\/create-first-user$/)
    const password = randomBytes(32).toString('hex')
    await page.locator('input[name=email]').fill(`first-user-qa-${randomBytes(6).toString('hex')}@example.test`)
    await page.locator('input[name=name]').fill('Temporary first-user QA')
    await page.locator('input[name=password]').fill(password)
    await page.locator('input[name=confirm-password]').fill(password)
    await page.locator('button[type=submit]').click()
    await page.waitForURL(`${origin}/admin`)
    const authenticated = await page.request.get('/api/users/me', { headers: { Origin: origin } })
    expect(authenticated.ok()).toBe(true)
    const { user } = await authenticated.json()
    createdID = user?.id
    expect(createdID).toBeDefined()
    expect(user.role).toBe('admin')
  } finally {
    if (createdID !== undefined) {
      const removed = await page.request.delete(`/api/users/${createdID}`, { headers: { Origin: origin } })
      expect(removed.ok()).toBe(true)
    }
  }
  const reset = await page.request.get('/api/users/init')
  expect((await reset.json()).initialized).toBe(false)
})
