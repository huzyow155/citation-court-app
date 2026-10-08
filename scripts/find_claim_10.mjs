async function main() {
  const url = 'https://explorer-studio.genlayer.com/address/0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5';
  const res = await fetch(url);
  const text = await res.text();

  const author = '0xEC61D374C70dd208890667b227666C0673090264';
  
  // Find where transactions: [ starts
  const txStart = text.indexOf('\\"transactions\\":[');
  console.log('txStart index:', txStart);
  
  // Grab 20000 chars from txStart
  const slice = text.slice(txStart, txStart + 15000);
  
  // Find all hashes in this slice
  const hashes = [...slice.matchAll(/0x[a-fA-F0-9]{64}/g)].map(m => m[0]);
  console.log('Found hashes in transactions block:', [...new Set(hashes)]);
  
  // Let's print occurrences of author with context
  let pos = 0;
  while ((pos = text.indexOf(author, pos)) !== -1) {
    console.log('\n--- Match at pos', pos, '---');
    console.log(text.slice(Math.max(0, pos - 200), pos + 300));
    pos += author.length;
  }
}

main().catch(console.error);
