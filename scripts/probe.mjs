import { chromium } from 'playwright'
const mode = process.argv[2] ?? 'hello'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] })
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } })
page.on('crash', () => console.log('CRASH'))
await page.goto('http://localhost:5173/probe.html?mode=' + mode, { waitUntil: 'load', timeout: 45000 })
await page.waitForTimeout(1200)
await page.screenshot({ path: '/tmp/probe-' + mode + '.png' })
console.log('OK', mode, await page.locator('body').innerText().then(t=>t.slice(0,50)))
await browser.close()
