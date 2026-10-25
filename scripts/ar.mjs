import { chromium } from 'playwright'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'] })
const page = await browser.newPage({ viewport: { width: 500, height: 400 } })
await page.setContent('<h1>Hello</h1><p style="font-size:40px">مكتبة القرآن محمد ﷺ</p>')
await page.waitForTimeout(500)
await page.screenshot({ path: '/tmp/ar.png' })
console.log('arabic shot ok')
await browser.close()
