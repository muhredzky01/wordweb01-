import { chromium } from 'playwright'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--enable-logging=stderr','--v=0'] })
const page = await browser.newPage({ viewport: { width: 900, height: 700 } })
page.on('crash', () => console.log('PAGE CRASH'))
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(2000)
console.log('done')
await browser.close()
