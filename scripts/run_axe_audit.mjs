import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const axeSource = fs.readFileSync(
  path.resolve('node_modules/axe-core/axe.min.js'),
  'utf-8'
);

const routes = [
  { name: 'Landing (/)', url: 'https://citation-court.vercel.app/' },
  { name: 'Home (/app)', url: 'https://citation-court.vercel.app/app' },
  { name: 'Claim (/app/claim/1)', url: 'https://citation-court.vercel.app/app/claim/1' },
  { name: 'Lodge (/app/new)', url: 'https://citation-court.vercel.app/app/new' },
  { name: 'Evidence (/app/evidence)', url: 'https://citation-court.vercel.app/app/evidence' },
];

const viewports = [
  { name: 'desktop_1280', width: 1280, height: 900, isMobile: false },
  { name: 'mobile_390', width: 390, height: 844, isMobile: true, hasTouch: true },
];

async function run() {
  console.log('Launching Chrome for axe-core accessibility audit...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--incognito', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  const allResults = [];

  for (const vp of viewports) {
    console.log(`\n=== Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const page = await browser.newPage();
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });

    for (const r of routes) {
      console.log(`Auditing ${r.name} at ${vp.name}...`);
      await page.goto(r.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      // Allow fonts and RPC queries to settle
      await new Promise((res) => setTimeout(res, 3500));

      // Inject axe-core
      await page.evaluate(axeSource);

      // Run axe audit
      const results = await page.evaluate(async () => {
        return await window.axe.run({
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
          },
        });
      });

      const summary = {
        minor: 0,
        moderate: 0,
        serious: 0,
        critical: 0,
      };

      const violationsDetail = [];

      for (const v of results.violations) {
        summary[v.impact] = (summary[v.impact] || 0) + v.nodes.length;
        violationsDetail.push({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          nodesCount: v.nodes.length,
          sampleNode: v.nodes[0]?.target?.join(' > '),
        });
      }

      console.log(
        `Result for ${r.name} [${vp.name}]: Critical=${summary.critical}, Serious=${summary.serious}, Moderate=${summary.moderate}, Minor=${summary.minor}`
      );
      if (violationsDetail.length > 0) {
        console.log('  Violations:', JSON.stringify(violationsDetail, null, 2));
      }

      allResults.push({
        route: r.name,
        viewport: vp.name,
        summary,
        violationsDetail,
      });
    }

    await page.close();
  }

  await browser.close();

  fs.writeFileSync(
    'docs/axe_audit_results.json',
    JSON.stringify(allResults, null, 2),
    'utf-8'
  );
  console.log('\nAudit complete! Saved results to docs/axe_audit_results.json');
}

run().catch((err) => {
  console.error('Axe audit failed:', err);
  process.exit(1);
});
