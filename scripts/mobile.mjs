import { chromium } from 'playwright'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] })
const pages = [
  ['m-home', '/', 390, 844],
  ['m-catalog', '/katalog', 390, 844],
  ['m-detail', '/kitab/tafsir-al-azhar-k205', 390, 844],
]
for (const [name, path, w, h] of pages) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true })
  const errors=[]
  page.on('pageerror', e=>errors.push(e.message))
  await page.goto('http://localhost:5173' + path, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(1200)
  await page.screenshot({ path: '/tmp/' + name + '.jpg', type: 'jpeg', quality: 80 })
  console.log(name, 'scrollW', await page.evaluate(()=>document.documentElement.scrollWidth), 'errors', errors.slice(0,2))
  await page.close()
}
await browser.close()
