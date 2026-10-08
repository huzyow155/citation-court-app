import puppeteer from 'puppeteer-core';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('docs/screenshots');

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--incognito', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Desktop 1280px
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('https://citation-court.vercel.app/', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: path.join(outDir, 'landing_desktop_1280.png'), fullPage: false });
  console.log('Saved landing_desktop_1280.png');

  // Mobile 390px
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('https://citation-court.vercel.app/', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: path.join(outDir, 'landing_mobile_390.png'), fullPage: false });
  console.log('Saved landing_mobile_390.png');

  await browser.close();
}

capture().catch(console.error);
