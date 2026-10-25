import { chromium } from 'playwright'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
for (const path of ['/', '/katalog', '/kitab/tafsir-al-azhar-k205']) {
  await page.goto('http://localhost:5173' + path, { waitUntil: 'load' })
  await page.waitForTimeout(600)
  const out = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth
    return [...document.querySelectorAll('header *, main *, footer *')]
      .map(el => ({ el, r: el.getBoundingClientRect() }))
      .filter(x => x.r.right > vw + 1 && x.r.width > 0)
      .slice(0, 20)
      .map(x => ({ tag: x.el.tagName, cls: (x.el.className || '').toString().slice(0,60), right: Math.round(x.r.right), w: Math.round(x.r.width) }))
  })
  console.log(path, JSON.stringify(out, null, 1))
}
await browser.close()
