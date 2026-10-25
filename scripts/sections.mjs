import { chromium } from 'playwright'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 60000 })
const sels = ['.category-grid', '.promo-banner', '.collection-grid', '.split-highlight', '.community-banner', '.newsletter']
for (const sel of sels) {
  const el = page.locator(sel).first()
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(700)
  const name = sel.replace(/[^a-z]/g, '')
  await el.screenshot({ path: '/tmp/sec-' + name + '.jpg', type: 'jpeg', quality: 78 })
  console.log('shot', name)
}
await browser.close()
