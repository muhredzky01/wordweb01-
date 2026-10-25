import { chromium } from 'playwright'
const sets = [
  ['--no-sandbox','--disable-gpu'],
  ['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-gpu-compositing'],
  ['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--use-angle=swiftshader','--enable-unsafe-swiftshader'],
]
for (const args of sets) {
  const browser = await chromium.launch({ args })
  const page = await browser.newPage({ viewport: { width: 800, height: 600 } })
  page.on('crash', () => console.log('CRASH'))
  try {
    await page.goto('https://en.wikipedia.org/wiki/Main_Page', { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForTimeout(1000)
    await page.screenshot({ path: '/tmp/wiki_' + args.length + '.png', timeout: 15000 })
    console.log('OK', args.join(' '))
  } catch (e) { console.log('FAIL', args.join(' '), e.message.split('\n')[0]) }
  await browser.close()
}
