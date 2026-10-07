import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const routes = [
  { path: '', name: 'home' },
  { path: 'claim/1', name: 'claim_1' },
  { path: 'claim/8', name: 'claim_8' },
  { path: 'new', name: 'lodge' },
  { path: 'mine', name: 'mine' },
  { path: 'evidence', name: 'evidence' },
  { path: 'about', name: 'about' },
];

const viewports = [
  { name: 'desktop_1280', width: 1280, height: 900, isMobile: false },
  { name: 'mobile_390', width: 390, height: 844, isMobile: true, hasTouch: true },
];

async function capture() {
  console.log('Launching Chrome in headless incognito mode for screenshot capture...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--incognito', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  const outDir = path.resolve('docs/screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const baseUrl = 'https://citation-court.vercel.app';

  for (const vp of viewports) {
    console.log(`\n--- Capturing viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const page = await browser.newPage();
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });

    for (const r of routes) {
      const url = `${baseUrl}/${r.path}`;
      const filename = `${r.name}_${vp.name}.png`;
      const targetFile = path.join(outDir, filename);

      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      // Delay for RPC data and fonts to render
      await new Promise((res) => setTimeout(res, 4000));

      await page.screenshot({ path: targetFile, fullPage: false });
      console.log(`Saved screenshot: ${targetFile}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('\nAll screenshots captured successfully!');
}

capture().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
