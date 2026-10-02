import { expect, test, type Page } from '@playwright/test'

// All input is touch (tap), in iPhone emulation. See playwright.config.ts.

const action = (page: Page, name: string) => page.getByRole('button', { name, exact: true })
const subject = (page: Page) => page.getByRole('heading', { level: 1 })
const hud = (page: Page, label: string) =>
  page.locator('.hud-item', { hasText: label }).locator('.hud-value')
const stat = (page: Page, id: string) => page.locator(`[data-stat="${id}"]`)

const sidewaysScroll = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

async function start(page: Page, query: string): Promise<void> {
  await page.goto(`./${query}`)
  await expect(subject(page)).toHaveText('Reply Y’all')
  await action(page, 'Start').tap()
}

test('plays one email with a tap', async ({ page }) => {
  await start(page, '?email=1&slow=1')
  await expect(subject(page)).toHaveText('Loretta’s casserole')
  await expect(page.locator('.pill', { hasText: 'Loretta Pike' })).toBeVisible()

  await action(page, 'Reply').tap()

  await expect(page.getByRole('status')).toContainText('You quietly tell Travis who he copied.')
  await expect(hud(page, 'Score')).toHaveText('100')
  await expect(hud(page, 'Streak')).toHaveText('1')
  // The next email arrives on its own.
  await expect(subject(page)).toHaveText('Y’all shipped me the WRONG ONE')
  await expect(page.getByRole('status')).toBeHidden()
})

test('full run: awkward, disaster, game over, rematch', async ({ page }) => {
  await start(page, '?email=1&slow=1')

  await action(page, 'Archive').tap()
  await expect(page.getByRole('status')).toContainText('Awkward')
  await expect(hud(page, 'Score')).toHaveText('25')
  await expect(hud(page, 'Streak')).toHaveText('0')

  // Tapping the toast moves on without waiting.
  await page.waitForTimeout(450)
  await page.getByRole('status').tap()
  await expect(subject(page)).toHaveText('Y’all shipped me the WRONG ONE')

  await action(page, 'Reply All').tap()
  await expect(subject(page)).toHaveText('HR would like a word')
  await expect(page.getByText('You tapped Reply All')).toBeVisible()
  await expect(page.getByText('Legal thanks you for the confession.')).toBeVisible()
  expect(await sidewaysScroll(page)).toBe(0)

  await action(page, 'Continue').tap()
  await expect(subject(page)).toHaveText('Game over')
  await expect(stat(page, 'score')).toHaveText('25')
  await expect(stat(page, 'best')).toHaveText('25')
  await expect(page.getByText('New best')).toBeVisible()
  expect(await sidewaysScroll(page)).toBe(0)

  await action(page, 'Rematch').tap()
  await expect(subject(page)).toHaveText('Loretta’s casserole')
  await expect(hud(page, 'Score')).toHaveText('0')

  // Best score survives a reload, and a worse run doesn't replace it.
  await start(page, '?email=1&slow=1')
  await action(page, 'Reply All').tap()
  await action(page, 'Continue').tap()
  await expect(stat(page, 'score')).toHaveText('0')
  await expect(stat(page, 'best')).toHaveText('25')
  await expect(page.getByText('New best')).toBeHidden()
})

test('running out of time ends the run', async ({ page }) => {
  await start(page, '?email=5')
  await expect(subject(page)).toHaveText('RE: RE: RE: STOP REPLYING ALL')
  await expect(subject(page)).toHaveText('HR would like a word', { timeout: 12_000 })
  await expect(page.getByText('You ran out of time')).toBeVisible()
})

test('reduced motion: no animation, same game', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await start(page, '?email=1&slow=1')
  const animation = (selector: string) =>
    page.locator(selector).evaluate((node) => getComputedStyle(node).animationName)
  expect(await animation('.email')).toBe('none')

  await action(page, 'Reply').tap()
  await expect(hud(page, 'Score')).toHaveText('100')
  expect(await animation('.toast')).toBe('none')
  await expect(subject(page)).toHaveText('Y’all shipped me the WRONG ONE')

  await action(page, 'Reply').tap()
  await expect(subject(page)).toHaveText('HR would like a word')
  expect(await animation('.stamp')).toBe('none')
  await action(page, 'Continue').tap()
  await expect(stat(page, 'score')).toHaveText('100')
})

test('every email fits iPhone screens', async ({ page }) => {
  const sizes = [
    { width: 390, height: 844 },
    { width: 390, height: 664 },
    { width: 375, height: 667 },
    { width: 320, height: 568 },
  ]
  for (const size of sizes) {
    await page.setViewportSize(size)
    for (let n = 1; n <= 5; n++) {
      await start(page, `?email=${n}&slow=1`)
      await expect(page.locator('.email')).toBeVisible()
      const m = await page.evaluate(() => {
        const slot = document.querySelector('.card-slot')!
        const card = document.querySelector('.email')!.getBoundingClientRect()
        const buttons = [...document.querySelectorAll('.action')].map((b) => b.getBoundingClientRect())
        return {
          sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          pageScroll: document.documentElement.scrollHeight - window.innerHeight,
          cardCut: Math.ceil(card.bottom - slot.getBoundingClientRect().bottom),
          barBottom: Math.max(...buttons.map((b) => b.bottom)),
          minWidth: Math.min(...buttons.map((b) => b.width)),
          minHeight: Math.min(...buttons.map((b) => b.height)),
        }
      })
      const where = `email ${n} at ${size.width}x${size.height}`
      expect(m.sideways, `sideways scroll, ${where}`).toBe(0)
      expect(m.pageScroll, `page scroll, ${where}`).toBe(0)
      expect(m.barBottom, `action bar on screen, ${where}`).toBeLessThanOrEqual(size.height)
      expect(m.minWidth, `button width, ${where}`).toBeGreaterThanOrEqual(64)
      expect(m.minHeight, `button height, ${where}`).toBeGreaterThanOrEqual(72)
      // The whole card shows without scrolling on current iPhones.
      if (size.height >= 664) expect(m.cardCut, `card cut off, ${where}`).toBeLessThanOrEqual(0)
    }
  }
})
