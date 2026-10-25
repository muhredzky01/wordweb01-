import { chromium } from 'playwright'
const browser = await chromium.launch({ args: ['--no-sandbox','--disable-gpu'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
await page.goto('http://localhost:5173/', { waitUntil: 'load' })
await page.waitForTimeout(800)
const info = await page.evaluate(() => {
  const els = [...document.querySelectorAll('.btn-primary')].slice(0,3)
  return els.map(e => ({ text: e.textContent.trim(), color: getComputedStyle(e).color, bg: getComputedStyle(e).backgroundColor, font: getComputedStyle(e).fontFamily, size: getComputedStyle(e).fontSize }))
})
console.log(info)
await browser.close()
