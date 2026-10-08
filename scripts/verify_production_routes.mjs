import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = 'https://citation-court.vercel.app';

const routesToTest = [
  // Primary application routes
  { path: '/', expectedType: 'landing' },
  { path: '/app', expectedType: 'app-home' },
  { path: '/app/claim/1', expectedType: 'claim-1' },
  { path: '/app/claim/9', expectedType: 'claim-9' },
  { path: '/app/claim/10', expectedType: 'claim-10' },
  { path: '/app/new', expectedType: 'lodge' },
  { path: '/app/mine', expectedType: 'mine' },
  { path: '/app/evidence', expectedType: 'evidence' },
  { path: '/app/about', expectedType: 'about' },
  // Legacy routes that must redirect to /app/...
  { path: '/claim/9', expectedRedirect: '/app/claim/9' },
  { path: '/new', expectedRedirect: '/app/new' },
  { path: '/mine', expectedRedirect: '/app/mine' },
  { path: '/evidence', expectedRedirect: '/app/evidence' },
  { path: '/about', expectedRedirect: '/app/about' },
];

async function main() {
  console.log('=== CITATION COURT PRODUCTION ROUTES HEADLESS CHROME AUDIT ===');
  console.log(`Target: ${baseUrl}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--incognito', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const results = [];

  for (const r of routesToTest) {
    const consoleErrors = [];
    const onConsole = (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    };
    page.on('console', onConsole);

    const fullUrl = `${baseUrl}${r.path}`;
    await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    // Small extra wait for client state hydration
    await new Promise((resolve) => setTimeout(resolve, 800));

    const finalUrl = page.url();
    const title = await page.title();
    const identifyingText = await page.evaluate(() => {
      const h1 = document.querySelector('h1')?.innerText?.trim();
      const h2 = document.querySelector('h2')?.innerText?.trim();
      const kicker = document.querySelector('.cc-hero-kicker')?.innerText?.trim();
      const p = document.querySelector('p')?.innerText?.trim();
      return h1 || kicker || h2 || p || 'N/A';
    });

    page.off('console', onConsole);

    results.push({
      path: r.path,
      fullUrl,
      finalUrl,
      title,
      identifyingText: identifyingText.replace(/\n+/g, ' '),
      consoleErrorCount: consoleErrors.length,
      consoleErrors,
      redirectedAsExpected: r.expectedRedirect ? finalUrl.endsWith(r.expectedRedirect) : true,
    });
  }

  await browser.close();

  console.log('\n--- AUDIT RESULTS TABLE ---');
  console.log(
    'Route'.padEnd(16) +
    'Final URL'.padEnd(36) +
    'Title'.padEnd(46) +
    'Errors'.padEnd(8) +
    'Identifying Text'
  );
  console.log('-'.repeat(130));

  for (const res of results) {
    const finalPath = res.finalUrl.replace(baseUrl, '');
    console.log(
      res.path.padEnd(16) +
      finalPath.padEnd(36) +
      res.title.slice(0, 44).padEnd(46) +
      String(res.consoleErrorCount).padEnd(8) +
      res.identifyingText.slice(0, 50)
    );
  }

  console.log('\nJSON Output:');
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
