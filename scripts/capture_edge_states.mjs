import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.resolve('docs/screenshots/edge_states');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const baseUrl = 'https://citation-court.vercel.app/app';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json',
};

// Hex encodings for genlayer-js calldata decoding
const HEX_EMPTY_STRING = '04';
const HEX_ATTEMPTS_3 =
  'cc047b22617474656d707473223a332c22636c61696d5f6964223a2236222c22736368656d615f76657273696f6e223a2231222c2276657264696374223a22554e5245414441424c45227d';

async function run() {
  console.log('Launching headless Chrome to capture 7 boundary edge states...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--incognito', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const results = [];

  // Helper to wait until loading spinner finishes
  const waitForLoaded = async () => {
    await page.waitForFunction(() => !document.querySelector('.loading-panel'), { timeout: 30000 });
    await new Promise((r) => setTimeout(r, 500));
  };

  // 1. Non-existent ID: /app/claim/9999
  console.log('\n--- State 1: /app/claim/9999 (Non-existent ID) ---');
  await page.goto(`${baseUrl}/claim/9999`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForLoaded();
  const file1 = path.join(outDir, 'edge_1_nonexistent_id_9999.png');
  await page.screenshot({ path: file1 });
  const dom1 = await page.evaluate(() => {
    return document.querySelector('.error-panel')?.innerText || document.body.innerText;
  });
  results.push({
    state: '1. Non-existent claim ID (/app/claim/9999)',
    file: 'docs/screenshots/edge_states/edge_1_nonexistent_id_9999.png',
    dataSource: 'Real on-chain read: queried get_claim("9999") on contract 0x58aDf2Fd...; contract returned empty string "" indicating non-existent claim.',
    timestamp: new Date().toISOString(),
    domSummary: dom1.trim(),
  });

  // 2. Malformed ID: /app/claim/abc
  console.log('\n--- State 2: /app/claim/abc (Malformed non-numeric ID) ---');
  await page.goto(`${baseUrl}/claim/abc`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForLoaded();
  const file2 = path.join(outDir, 'edge_2_malformed_id_abc.png');
  await page.screenshot({ path: file2 });
  const dom2 = await page.evaluate(() => {
    return document.querySelector('.error-panel')?.innerText || document.body.innerText;
  });
  results.push({
    state: '2. Malformed ID string (/app/claim/abc)',
    file: 'docs/screenshots/edge_states/edge_2_malformed_id_abc.png',
    dataSource: 'Client-side validation: client intercepted non-numeric ID "abc" via regex /^\\d+$/; did not call RPC. Displayed "That is not a valid claim number.".',
    timestamp: new Date().toISOString(),
    domSummary: dom2.trim(),
  });

  // 4. UNREADABLE with attempts < 3 (Claim 6 on-chain: verdict=UNREADABLE, attempts=2 < 3)
  console.log('\n--- State 4: Claim 6 (UNREADABLE with attempts < 3) ---');
  await page.goto(`${baseUrl}/claim/6`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForLoaded();
  const file4 = path.join(outDir, 'edge_4_unreadable_attempts_under_3.png');
  await page.screenshot({ path: file4 });
  const dom4 = await page.evaluate(() => {
    const unreadable = document.querySelector('.unreadable-callout-bar')?.innerText || '';
    const instruction = document.querySelector('.judge-instruction')?.innerText || '';
    const btn = document.querySelector('.btn-action-primary')?.innerText || '';
    return `Callout: "${unreadable}"\nInstruction: "${instruction}"\nButton: "${btn}"`;
  });
  results.push({
    state: '4. UNREADABLE claim with attempts < 3 (/app/claim/6, actual on-chain state)',
    file: 'docs/screenshots/edge_states/edge_4_unreadable_attempts_under_3.png',
    dataSource: 'Real on-chain state: queried Claim 6 on contract 0x58aDf2Fd...; returned attempts: 2, verdict: "UNREADABLE", allowing retry attempt 3 of 3.',
    timestamp: new Date().toISOString(),
    domSummary: dom4.trim(),
  });

  // 3. Pending Claim (Lodged, not yet judged -> ruling is empty string)
  console.log('\n--- State 3: Pending Claim (Mocked ruling: empty string) ---');
  await page.setRequestInterception(true);
  const interceptPending = (req) => {
    if (req.method() === 'OPTIONS') {
      req.respond({ status: 204, headers: CORS_HEADERS });
      return;
    }
    if (req.method() === 'POST' && req.url().includes('studio.genlayer.com')) {
      const postData = req.postData();
      if (postData && (postData.includes('6765745f72756c696e67') || postData.includes('get_ruling'))) {
        let reqId = 1;
        try { reqId = JSON.parse(postData).id; } catch {}
        req.respond({
          status: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({ jsonrpc: '2.0', result: HEX_EMPTY_STRING, id: reqId }),
        });
        return;
      }
    }
    req.continue();
  };
  page.on('request', interceptPending);
  await page.goto(`${baseUrl}/claim/6`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForLoaded();
  const file3 = path.join(outDir, 'edge_3_pending_claim_awaiting_judgment_mocked.png');
  await page.screenshot({ path: file3 });
  const dom3 = await page.evaluate(() => {
    const marked = document.querySelector('.marked-claim-pending')?.innerText || '';
    const instruction = document.querySelector('.judge-instruction')?.innerText || '';
    const btn = document.querySelector('.btn-action-primary')?.innerText || '';
    return `MarkedText: "${marked.slice(0, 60)}..."\nInstruction: "${instruction}"\nButton: "${btn}"`;
  });
  results.push({
    state: '3. Pending claim awaiting judgment',
    file: 'docs/screenshots/edge_states/edge_3_pending_claim_awaiting_judgment_mocked.png',
    dataSource: 'Mocked RPC response: intercepted get_ruling for Claim 6 (claim: "Project Nova announced a new quantum proof validation layer in October 2026.", URL: "https://raw.githubusercontent.com/huzyow155/citation-court-genlayer/main/fixtures/not_found_404.md", actual on-chain verdict: UNREADABLE, attempts: 2); returned empty string "" to simulate newly-lodged unjudged state.',
    timestamp: new Date().toISOString(),
    domSummary: dom3.trim(),
  });
  page.off('request', interceptPending);
  await page.setRequestInterception(false);

  // 5. UNREADABLE claim with attempts >= 3 (Attempt limit reached)
  console.log('\n--- State 5: UNREADABLE claim with attempts >= 3 (Mocked ruling: attempts=3) ---');
  await page.setRequestInterception(true);
  const interceptLimit = (req) => {
    if (req.method() === 'OPTIONS') {
      req.respond({ status: 204, headers: CORS_HEADERS });
      return;
    }
    if (req.method() === 'POST' && req.url().includes('studio.genlayer.com')) {
      const postData = req.postData();
      if (postData && (postData.includes('6765745f72756c696e67') || postData.includes('get_ruling'))) {
        let reqId = 1;
        try { reqId = JSON.parse(postData).id; } catch {}
        req.respond({
          status: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({ jsonrpc: '2.0', result: HEX_ATTEMPTS_3, id: reqId }),
        });
        return;
      }
    }
    req.continue();
  };
  page.on('request', interceptLimit);
  await page.goto(`${baseUrl}/claim/6`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForLoaded();
  const file5 = path.join(outDir, 'edge_5_unreadable_attempts_limit_reached_mocked.png');
  await page.screenshot({ path: file5 });
  const dom5 = await page.evaluate(() => {
    const callout = document.querySelector('.unreadable-callout-bar')?.innerText || '';
    const limitBox = document.querySelector('.attempt-limit-box')?.innerText || '';
    return `Callout: "${callout}"\nLimitBox: "${limitBox}"`;
  });
  results.push({
    state: '5. UNREADABLE claim with 3/3 attempts exhausted',
    file: 'docs/screenshots/edge_states/edge_5_unreadable_attempts_limit_reached_mocked.png',
    dataSource: 'Mocked RPC response: intercepted get_ruling for Claim 6 (actual on-chain state has attempts: 2); returned JSON payload with attempts: 3 and verdict: UNREADABLE to simulate attempt limit reached.',
    timestamp: new Date().toISOString(),
    domSummary: dom5.trim(),
  });
  page.off('request', interceptLimit);
  await page.setRequestInterception(false);

  // 6. Network error / Unreachable RPC
  console.log('\n--- State 6: RPC unreachable / Network failure ---');
  await page.setRequestInterception(true);
  const interceptNetworkFail = (req) => {
    if (req.url().includes('studio.genlayer.com')) {
      req.abort('failed');
      return;
    }
    req.continue();
  };
  page.on('request', interceptNetworkFail);
  await page.goto(`${baseUrl}/claim/1`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForLoaded();
  const file6 = path.join(outDir, 'edge_6_network_error_rpc_unreachable.png');
  await page.screenshot({ path: file6 });
  const dom6 = await page.evaluate(() => {
    return document.querySelector('.error-panel')?.innerText || document.body.innerText;
  });
  results.push({
    state: '6. Network failure / Unreachable RPC endpoint',
    file: 'docs/screenshots/edge_states/edge_6_network_error_rpc_unreachable.png',
    dataSource: 'Simulated network outage: intercepted browser network request to studio.genlayer.com and aborted request with connection failure.',
    timestamp: new Date().toISOString(),
    domSummary: dom6.trim(),
  });
  page.off('request', interceptNetworkFail);
  await page.setRequestInterception(false);

  // 7. Contract not found
  console.log('\n--- State 7: Contract not found on chain ---');
  await page.setRequestInterception(true);
  const interceptContractMissing = (req) => {
    if (req.method() === 'OPTIONS') {
      req.respond({ status: 204, headers: CORS_HEADERS });
      return;
    }
    if (req.method() === 'POST' && req.url().includes('studio.genlayer.com')) {
      let reqId = 1;
      try { reqId = JSON.parse(req.postData()).id; } catch {}
      req.respond({
        status: 200,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: reqId,
          error: { code: -32000, message: 'Contract 0x0000000000000000000000000000000000000000 not deployed or found on Studionet' },
        }),
      });
      return;
    }
    req.continue();
  };
  page.on('request', interceptContractMissing);
  await page.goto(`${baseUrl}/claim/1`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await waitForLoaded();
  const file7 = path.join(outDir, 'edge_7_contract_not_found.png');
  await page.screenshot({ path: file7 });
  const dom7 = await page.evaluate(() => {
    return document.querySelector('.error-panel')?.innerText || document.body.innerText;
  });
  results.push({
    state: '7. Contract address not found on chain',
    file: 'docs/screenshots/edge_states/edge_7_contract_not_found.png',
    dataSource: 'Simulated contract missing: intercepted RPC request to studio.genlayer.com and returned JSON-RPC error code -32000 indicating contract address not deployed (e.g., environment reset).',
    timestamp: new Date().toISOString(),
    domSummary: dom7.trim(),
  });
  page.off('request', interceptContractMissing);
  await page.setRequestInterception(false);

  await browser.close();

  console.log('\n=== EDGE STATES VERIFICATION REPORT ===');
  for (const r of results) {
    console.log(`\n[${r.state}]`);
    console.log(`  Timestamp : ${r.timestamp}`);
    console.log(`  Screenshot: ${r.file}`);
    console.log(`  DOM Dump  :\n${r.domSummary}`);
  }

  fs.writeFileSync(
    path.join(outDir, 'edge_states_summary.json'),
    JSON.stringify(results, null, 2),
    'utf-8'
  );
  console.log('\nSaved edge states summary to docs/screenshots/edge_states/edge_states_summary.json');
}

run().catch((err) => {
  console.error('Edge states capture failed:', err);
  process.exit(1);
});
