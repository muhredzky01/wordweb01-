import { chromium } from 'playwright'
const base = 'http://localhost:5173'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] })
const shots = [
  ['home-full', '/', 1440, 1000, true],
  ['catalog', '/katalog', 1440, 1000, true],
  ['detail', '/kitab/tafsir-al-azhar-k205', 1440, 1000, true],
  ['about', '/tentang', 1440, 1000, false],
]
for (const [name, path, w, h, full] of shots) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', m => { if (m.type()==='error') errors.push(m.text()) })
  await page.goto(base + path, { waitUntil: 'load', timeout: 60000 })
  await page.waitForTimeout(1800)
  await page.screenshot({ path: '/tmp/' + name + '.png', fullPage: full })
  console.log(name, 'cards', await page.locator('.book-card').count(), 'errors', errors.slice(0,3))
  await page.close()
}
await browser.close()
