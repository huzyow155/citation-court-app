import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

async function main() {
  const html = await (await fetch('https://citation-court.vercel.app/')).text();
  const match = html.match(/src="(\/assets\/(index-[^"]+\.js))"/);
  if (!match) {
    console.error('Could not find JS bundle in production HTML');
    process.exit(1);
  }
  const prodFilename = match[2];
  const prodUrl = 'https://citation-court.vercel.app' + match[1];
  console.log('Production JS filename:', prodFilename);
  console.log('Production JS URL     :', prodUrl);

  const prodJs = await (await fetch(prodUrl)).text();
  const prodSha = crypto.createHash('sha256').update(prodJs).digest('hex');
  console.log('Production JS SHA-256 :', prodSha);
  console.log('Production JS bytes   :', prodJs.length);

  // Check local build in dist/assets
  const distDir = path.resolve('dist/assets');
  const localFiles = fs.readdirSync(distDir).filter((f) => f.startsWith('index-') && f.endsWith('.js'));
  console.log('\nLocal dist JS files   :', localFiles);

  for (const f of localFiles) {
    const localJs = fs.readFileSync(path.join(distDir, f), 'utf-8');
    const localSha = crypto.createHash('sha256').update(localJs).digest('hex');
    console.log(`Local [${f}] SHA-256 :`, localSha);
    console.log(`Local [${f}] bytes   :`, localJs.length);
    if (f === prodFilename) {
      console.log(`Matching filename found! Exact SHA match: ${prodSha === localSha}`);
    }
  }

  // Check secret leaks in prod JS
  const hasAddr = prodJs.toLowerCase().includes('0x58adf2fd47dd939623bfd66929ec26117fb8cfa5');
  const hasSecrets = /privateKey|PRIVATE_KEY|mnemonic/i.test(prodJs);
  console.log('\nContract address in production bundle:', hasAddr);
  console.log('Secret leaks in production bundle    :', hasSecrets);
}

main().catch(console.error);
