import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const axeSource = fs.readFileSync(
  path.resolve('node_modules/axe-core/axe.min.js'),
  'utf-8'
);

const outDir = path.resolve('docs/a11y');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const baseUrl = 'https://citation-court.vercel.app';

const targets = [
  { name: 'landing', route: '/', url: `${baseUrl}/` },
  { name: 'app_home', route: '/app', url: `${baseUrl}/app` },
  { name: 'claim_1_supports', route: '/app/claim/1', url: `${baseUrl}/claim/1` },
  { name: 'claim_6_unreadable', route: '/app/claim/6', url: `${baseUrl}/claim/6` },
  { name: 'lodge_new', route: '/app/new', url: `${baseUrl}/new` },
  { name: 'my_claims', route: '/app/mine', url: `${baseUrl}/mine` },
  { name: 'evidence', route: '/app/evidence', url: `${baseUrl}/evidence` },
  { name: 'about', route: '/app/about', url: `${baseUrl}/about` },
  { name: 'claim_waiting_state', route: '/app/claim/1 (waiting)', url: `${baseUrl}/claim/1`, simulateWaiting: true },
];

const viewports = [
  { name: 'desktop_1280', width: 1280, height: 900, isMobile: false },
  { name: 'mobile_390', width: 390, height: 844, isMobile: true, hasTouch: true },
];

const RULE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

async function run() {
  console.log('=== CITATION COURT COMPREHENSIVE AXE-CORE ACCESSIBILITY AUDIT ===');
  console.log(`axe-core version: 4.14.0`);
  console.log(`Rule tags: ${JSON.stringify(RULE_TAGS)}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--incognito', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  const auditRows = [];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });

    for (const t of targets) {
      const slug = `${t.name}_${vp.name}`;
      console.log(`\nAuditing ${t.name} (${t.route}) @ ${vp.name}...`);

      await page.goto(t.url, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise((r) => setTimeout(r, 1200));

      if (t.simulateWaiting) {
        // Inject a simulated active waiting container to test accessibility of live consensus waiting states
        await page.evaluate(() => {
          const actionBox = document.querySelector('.claim-actions-box');
          if (actionBox) {
            const waitingDiv = document.createElement('div');
            waitingDiv.className = 'judging-waiting-state';
            waitingDiv.setAttribute('role', 'status');
            waitingDiv.setAttribute('aria-live', 'polite');
            waitingDiv.innerHTML = `
              <div class="waiting-spinner-track" aria-hidden="true"></div>
              <div class="waiting-text-group">
                <p class="waiting-title">Awaiting consensus on GenLayer Studionet...</p>
                <p class="waiting-time">Elapsed time: 14s</p>
                <p class="waiting-longer-notice">Waiting for the validators to agree. This transaction is not confirmed yet.</p>
                <p class="waiting-subtext">Transaction submitted to GenLayer Studionet consensus.</p>
              </div>
            `;
            actionBox.prepend(waitingDiv);
          }
        });
        await new Promise((r) => setTimeout(r, 300));
      }

      // Inject axe-core
      await page.evaluate(axeSource);

      // Run axe
      const axeResult = await page.evaluate(async (tags) => {
        return await window.axe.run({
          runOnly: {
            type: 'tag',
            values: tags,
          },
        });
      }, RULE_TAGS);

      const jsonFileName = `${slug}.json`;
      const jsonFilePath = path.join(outDir, jsonFileName);

      // Save raw JSON
      fs.writeFileSync(jsonFilePath, JSON.stringify(axeResult, null, 2), 'utf-8');

      const row = {
        target: t.name,
        route: t.route,
        viewport: vp.name,
        resolution: `${vp.width}x${vp.height}`,
        violations: axeResult.violations.length,
        incomplete: axeResult.incomplete.length,
        passes: axeResult.passes.length,
        inapplicable: axeResult.inapplicable.length,
        file: `docs/a11y/${jsonFileName}`,
      };
      auditRows.push(row);

      console.log(`  Passes: ${row.passes} | Incomplete: ${row.incomplete} | Violations: ${row.violations}`);
      if (axeResult.violations.length > 0) {
        console.log('  VIOLATIONS:', axeResult.violations.map((v) => v.id));
      }
    }

    await page.close();
  }

  await browser.close();

  const summary = {
    axeVersion: '4.14.0',
    ruleTags: RULE_TAGS,
    testedAt: new Date().toISOString(),
    totalAudits: auditRows.length,
    results: auditRows,
  };

  fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf-8');
  console.log('\nSaved all raw JSONs and master summary to docs/a11y/summary.json');
}

run().catch((err) => {
  console.error('Audit run failed:', err);
  process.exit(1);
});
