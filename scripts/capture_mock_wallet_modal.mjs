import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureMockWalletModal() {
  console.log('Launching Chrome to capture Connect Wallet modal with mock EIP-6963 providers...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--incognito', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  const outDir = path.resolve('docs/screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const viewports = [
    { name: 'desktop_1280', width: 1280, height: 900, isMobile: false },
    { name: 'mobile_390', width: 390, height: 844, isMobile: true, hasTouch: true },
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });

    // Inject mock EIP-6963 providers before page load
    await page.evaluateOnNewDocument(() => {
      function emitMockProvider(info) {
        const detail = {
          info,
          provider: {
            request: async ({ method }) => {
              if (method === 'eth_requestAccounts') return ['0x4c3605baF9adc5e7473332D84F85a8D13938cF18'];
              if (method === 'eth_chainId') return '0xf22f';
              return null;
            },
            on: () => {},
            removeListener: () => {},
          },
        };
        const event = new CustomEvent('eip6963:announceProvider', { detail });
        window.dispatchEvent(event);
      }

      window.addEventListener('eip6963:requestProvider', () => {
        emitMockProvider({
          uuid: 'mock-metamask-uuid',
          name: 'MetaMask (Mock Provider)',
          icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23E2761B"/><circle cx="12" cy="12" r="6" fill="%23FFFFFF"/></svg>',
          rdns: 'io.metamask.mock',
        });
        emitMockProvider({
          uuid: 'mock-rabby-uuid',
          name: 'Rabby Wallet (Mock Provider)',
          icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="%238697FF"/><circle cx="12" cy="12" r="6" fill="%23FFFFFF"/></svg>',
          rdns: 'io.rabby.mock',
        });
      });
    });

    await page.goto('https://citation-court.vercel.app/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await new Promise((res) => setTimeout(res, 2000));

    // Click "Connect Wallet" button
    const connectBtn = await page.$('.btn-connect');
    if (connectBtn) {
      await connectBtn.click();
      await new Promise((res) => setTimeout(res, 1000));
    }

    const targetFile = path.join(outDir, `connect_modal_mock_provider_${vp.name}.png`);
    await page.screenshot({ path: targetFile, fullPage: false });
    console.log(`Saved screenshot: ${targetFile}`);

    await page.close();
  }

  await browser.close();
  console.log('Connect modal screenshots captured successfully!');
}

captureMockWalletModal().catch((err) => {
  console.error('Failed to capture mock wallet modal:', err);
  process.exit(1);
});
