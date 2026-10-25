import { chromium } from 'playwright'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const errors = []
page.on('pageerror', e => errors.push('PAGEERROR ' + e.message))
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
const step = async (name, fn) => {
  try { await fn(); console.log('PASS', name) }
  catch (e) { console.log('FAIL', name, '-', e.message.split('\n')[0].slice(0,140)) }
}

await step('home loads', async () => {
  await page.goto('http://localhost:5173/', { waitUntil: 'load' })
  await page.waitForTimeout(600)
  if (await page.locator('.hero-copy h1').count() !== 1) throw new Error('no hero')
})

await step('search overlay via / key', async () => {
  await page.keyboard.press('/')
  await page.waitForTimeout(300)
  const input = page.locator('.search-panel-input input')
  await input.fill('tafsir')
  await page.waitForTimeout(400)
  const rows = await page.locator('.search-result-row').count()
  if (rows < 2) throw new Error('only ' + rows + ' results')
  await page.screenshot({ path: '/tmp/search-overlay.jpg', type: 'jpeg', quality: 78 })
  await page.locator('.search-results .btn-primary').click()
  await page.waitForTimeout(500)
  if (!page.url().includes('q=tafsir')) throw new Error('url ' + page.url())
})

await step('catalog filter category', async () => {
  await page.goto('http://localhost:5173/katalog', { waitUntil: 'load' })
  await page.waitForTimeout(500)
  await page.locator('.filter-options .check-row', { hasText: 'Fikih & Fatwa' }).click()
  await page.waitForTimeout(400)
  if (!page.url().includes('category=fiqh')) throw new Error('url ' + page.url())
  const cards = await page.locator('.book-card').count()
  if (cards === 0) throw new Error('no cards')
  await page.screenshot({ path: '/tmp/catalog-filter.jpg', type: 'jpeg', quality: 75 })
})

await step('catalog sort + pagination', async () => {
  await page.locator('.sort-select select').selectOption('title')
  await page.waitForTimeout(300)
  await page.locator('.page-btn', { hasText: '2' }).first().click()
  await page.waitForTimeout(300)
  if (!page.url().includes('page=2')) throw new Error('no page param')
  const count = await page.locator('.book-card').count()
  if (count === 0) throw new Error('empty page')
})

await step('detail favorite + shelf', async () => {
  await page.goto('http://localhost:5173/kitab/tafsir-al-azhar-k205', { waitUntil: 'load' })
  await page.waitForTimeout(400)
  await page.locator('.detail-heart').click()
  await page.locator('.detail-actions .btn-outline').filter({ hasText: 'Simpan' }).click()
  await page.waitForTimeout(300)
  const favs = await page.evaluate(() => JSON.parse(localStorage.getItem('mk-favorites') || '[]'))
  const shelf = await page.evaluate(() => JSON.parse(localStorage.getItem('mk-shelf') || '[]'))
  if (!favs.includes('k205')) throw new Error('favorite missing')
  if (!shelf.includes('k205')) throw new Error('shelf missing')
})

await step('reader loads volume', async () => {
  await page.goto('http://localhost:5173/baca/tafsir-al-azhar-k205', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1200)
  const src = await page.locator('.reader-frame-wrap iframe').getAttribute('src')
  if (!src?.includes('drive.google.com/file/d/')) throw new Error('iframe ' + src)
  const volumes = await page.locator('.reader-volume').count()
  if (volumes < 2) throw new Error('volumes ' + volumes)
  await page.locator('input[type=range]').fill('45')
  await page.waitForTimeout(200)
  const prog = await page.evaluate(() => JSON.parse(localStorage.getItem('mk-progress') || '{}'))
  if (prog.k205 !== 45) throw new Error('progress ' + JSON.stringify(prog))
  await page.screenshot({ path: '/tmp/reader.jpg', type: 'jpeg', quality: 70 })
})

await step('auth login modal', async () => {
  await page.goto('http://localhost:5173/', { waitUntil: 'load' })
  await page.waitForTimeout(400)
  await page.locator('.header-login').click()
  await page.waitForTimeout(300)
  await page.locator('.auth-modal input[type=email]').fill('budi@example.com')
  await page.locator('.auth-modal input[type=password]').fill('rahasia123')
  await page.screenshot({ path: '/tmp/auth-modal.jpg', type: 'jpeg', quality: 80 })
  await page.locator('.auth-modal button[type=submit]').click()
  await page.waitForTimeout(400)
  if (await page.locator('.avatar-btn').count() !== 1) throw new Error('not logged in')
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('mk-user') || 'null'))
  if (!stored?.email) throw new Error('user not stored')
})

await step('shelf drawer + favorites page', async () => {
  await page.locator('.badge-wrap').nth(1).click()
  await page.waitForTimeout(300)
  if (await page.locator('.shelf-drawer').count() !== 1) throw new Error('drawer missing')
  await page.locator('.shelf-drawer-head .icon-btn').click()
  await page.goto('http://localhost:5173/favorit', { waitUntil: 'load' })
  await page.waitForTimeout(300)
  if (await page.locator('.book-card').count() < 1) throw new Error('no favorite cards')
})

await step('dark mode + lang toggle', async () => {
  await page.goto('http://localhost:5173/', { waitUntil: 'load' })
  await page.waitForTimeout(300)
  await page.locator('.header-actions .hide-sm').click()
  await page.waitForTimeout(300)
  const theme = await page.evaluate(() => document.documentElement.dataset.theme)
  if (theme !== 'dark') throw new Error('theme ' + theme)
  await page.screenshot({ path: '/tmp/home-dark.jpg', type: 'jpeg', quality: 76 })
  await page.locator('.lang-switch').click()
  await page.waitForTimeout(300)
  if (!(await page.locator('.header-nav').innerText()).includes('Home')) throw new Error('lang not switched')
})

await step('about faq', async () => {
  await page.goto('http://localhost:5173/tentang', { waitUntil: 'load' })
  await page.waitForTimeout(300)
  await page.locator('.faq-item button').nth(1).click()
  await page.waitForTimeout(200)
  if (await page.locator('.faq-item p').count() < 1) throw new Error('faq not open')
})

console.log('ERRORS', errors.slice(0, 8))
await browser.close()
