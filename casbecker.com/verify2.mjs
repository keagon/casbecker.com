import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1150 } });
await page.goto('http://localhost:3853/', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(3000);
// pause autoplay by hovering, then settle on card 1
await page.locator('.portfolio-stage').hover();
await page.waitForTimeout(800);
await page.locator('#portfolio').scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await page.locator('#portfolio').screenshot({ path: '/tmp/v2-hero.jpg', type: 'jpeg', quality: 88 });

// zoom into the active card top to check glass fade
const card = page.locator('.portfolio-card--active').first();
await card.screenshot({ path: '/tmp/v2-card.jpg', type: 'jpeg', quality: 90 });
await browser.close();
console.log('Done');
