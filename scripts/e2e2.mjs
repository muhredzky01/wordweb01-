import { chromium } from 'playwright'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on('pageerror', e => errors.push('PAGEERROR ' + e.message))
const step = async (name, fn) => { try { await fn(); console.log('PASS', name) } catch (e) { console.log('FAIL', name, '-', e.message.split('\n')[0].slice(0,160)) } }

await step('search overlay from nav', async () => {
  await page.goto('http://localhost:5173/', { waitUntil: 'load' })
  await page.waitForTimeout(400)
  await page.locator('.nav-search-link').click()
  await page.waitForTimeout(300)
  await page.locator('.search-panel-input input').fill('bukhari')
  await page.waitForTimeout(400)
  const rows = await page.locator('.search-result-row').count()
  if (rows < 1) throw new Error('no rows')
  await page.screenshot({ path: '/tmp/search-overlay.png' })
  await page.locator('.search-result-row').first().click()
  await page.waitForTimeout(400)
  if (!page.url().includes('/kitab/')) throw new Error('not navigated')
})

await step('review submit persists', async () => {
  await page.locator('.detail-tabs button').filter({ hasText: 'Ulasan' }).click()
  await page.locator('.review-form input').fill('Penguji Cline')
  await page.locator('.review-form textarea').fill('Naskahnya bagus dan mudah dibaca, terima kasih.')
  await page.locator('.review-form button[type=submit]').click()
  await page.waitForTimeout(300)
  const count = await page.locator('.review').count()
  if (count < 4) throw new Error('reviews ' + count)
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('mk-reviews') || '[]'))
  if (!stored.length) throw new Error('not stored')
})

await step('dark mode', async () => {
  await page.goto('http://localhost:5173/', { waitUntil: 'load' })
  await page.waitForTimeout(400)
  await page.locator('.header-actions .hide-sm').first().click()
  await page.waitForTimeout(400)
  const theme = await page.evaluate(() => document.documentElement.dataset.theme)
  if (theme !== 'dark') throw new Error('theme ' + theme)
  await page.screenshot({ path: '/tmp/home-dark.png' })
})

await step('lang toggle', async () => {
  await page.locator('.lang-switch').click()
  await page.waitForTimeout(300)
  const nav = await page.locator('.header-nav').innerText()
  if (!nav.includes('Home')) throw new Error('nav ' + nav.replace(/\n/g, '|'))
  await page.locator('.lang-switch').click()
})

await step('mobile drawer + filter sheet', async () => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('http://localhost:5173/', { waitUntil: 'load' })
  await page.waitForTimeout(400)
  await page.locator('.header-inner .mobile-only').first().click()
  await page.waitForTimeout(300)
  if (await page.locator('.mobile-drawer').count() !== 1) throw new Error('drawer missing')
  await page.screenshot({ path: '/tmp/mobile-menu.png' })
  await page.locator('.mobile-drawer .mobile-link').filter({ hasText: /Katalog/ }).click()
  await page.waitForTimeout(400)
  await page.locator('.filter-mobile-btn').click()
  await page.waitForTimeout(300)
  if (await page.locator('.filter-drawer').count() !== 1) throw new Error('filter drawer missing')
  await page.screenshot({ path: '/tmp/mobile-filter.png' })
  const sw = await page.evaluate(() => document.documentElement.scrollWidth)
  if (sw > 391) throw new Error('overflow ' + sw)
})

console.log('ERRORS', errors.slice(0, 6))
await browser.close()
