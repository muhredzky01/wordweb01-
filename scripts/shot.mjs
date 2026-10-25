import { chromium } from 'playwright'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 60000 })
await page.waitForTimeout(2500)
await page.screenshot({ path: '/tmp/home.png' })
console.log('title', await page.title())
console.log('cards', await page.locator('.book-card').count(), 'errors', errors.slice(0, 5))
await browser.close()
