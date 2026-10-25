import { chromium } from 'playwright'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] })
const page = await browser.newPage({ viewport: { width: 1200, height: 800 } })
await page.goto('http://localhost:5173/', { waitUntil: 'load', timeout: 60000 })
await page.waitForTimeout(2000)
const info = await page.evaluate(async () => {
  await document.fonts.ready
  const h1 = document.querySelector('.hero-copy h1')
  return {
    status: document.fonts.status,
    jakarta: document.fonts.check('16px "Plus Jakarta Sans"'),
    amiri: document.fonts.check('16px "Amiri"'),
    h1font: h1 ? getComputedStyle(h1).fontFamily : null,
    h1color: h1 ? getComputedStyle(h1).color : null,
    h1rect: h1 ? h1.getBoundingClientRect().toJSON() : null,
    loaded: [...document.fonts].map(f => f.family + ':' + f.weight + ':' + f.status),
  }
})
console.log(JSON.stringify(info, null, 1))
await browser.close()
