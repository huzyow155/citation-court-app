async function auditDeployed() {
  const html = await (await fetch('https://citation-court.vercel.app/')).text();
  const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  if (!match) {
    console.error('JS bundle not found in HTML');
    process.exit(1);
  }
  const jsUrl = 'https://citation-court.vercel.app' + match[1];
  console.log('Fetching deployed JS:', jsUrl);
  const js = await (await fetch(jsUrl)).text();
  
  const hasAddr = js.toLowerCase().includes('0x58adf2fd47dd939623bfd66929ec26117fb8cfa5');
  console.log('Contract address present:', hasAddr);
  
  const leakedPK = /THROWAWAY_PRIVATE_KEY|0x4c3605baF9adc5e7473332D84F85a8D13938cF18|mnemonic/i.test(js);
  console.log('Secret leaks detected in bundle:', leakedPK);
  
  if (!hasAddr || leakedPK) {
    console.error('Audit failed!');
    process.exit(1);
  }
  console.log('Remote bundle audit PASSED!');
}
auditDeployed();
