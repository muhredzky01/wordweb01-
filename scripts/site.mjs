import { chromium } from 'playwright'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'] })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
page.on('crash', () => console.log('CRASH'))
await page.goto('https://en.wikipedia.org/wiki/Main_Page', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(2000)
await page.screenshot({ path: '/tmp/wiki.png' })
console.log('wiki ok', await page.title())
await browser.close()
