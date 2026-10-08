import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';

const client = createClient({ chain: studionet });
const CONTRACT_ADDRESS = '0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5';

async function main() {
  console.log('--- RPC Query for Claim 9 ---');
  const claimRaw = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: 'get_claim',
    args: ['9'],
  });
  console.log('get_claim(9) raw:');
  console.log(claimRaw);

  const rulingRaw = await client.readContract({
    address: CONTRACT_ADDRESS,
    functionName: 'get_ruling',
    args: ['9'],
  });
  console.log('\nget_ruling(9) raw:');
  console.log(rulingRaw);

  const claim = typeof claimRaw === 'string' ? JSON.parse(claimRaw) : claimRaw;
  const sourceUrl = claim.url;
  console.log('\nClaim 9 Source URL:', sourceUrl);

  console.log('\n--- Fetching Source Webpage Content ---');
  const pageText = await (await fetch(sourceUrl)).text();
  console.log(`Page bytes: ${pageText.length}`);
  const matchCount = (pageText.match(/14\.2 million/g) || []).length;
  console.log(`grep -c "14.2 million": ${matchCount}`);
  const contextIdx = pageText.indexOf('14.2 million');
  if (contextIdx !== -1) {
    console.log('Passage snippet:', pageText.slice(Math.max(0, contextIdx - 40), contextIdx + 60).replace(/\n/g, ' '));
  }

  console.log('\n--- Claim 9 Transactions & Receipts ---');
  const lodgeTx = '0xa3875af779a334ce6d925ccf90ed78b4d53bb93591d51291f623c41523616cd0';
  const judgeTx = '0x54f9e0692aa2ae52e362b3e06764990e32689ab2663ecffe31dadc995c0791f2';

  console.log(`Lodge Tx: ${lodgeTx}`);
  const lodgeReceipt = await client.waitForTransactionReceipt({ hash: lodgeTx, retries: 5, interval: 1000 });
  console.log('Lodge Receipt Triple:');
  console.log('  status_name     :', lodgeReceipt.status_name);
  console.log('  result_name     :', lodgeReceipt.result_name);
  console.log('  execution_result:', lodgeReceipt.consensus_data?.leader_receipt?.[0]?.execution_result);

  console.log(`\nJudge Tx: ${judgeTx}`);
  const judgeReceipt = await client.waitForTransactionReceipt({ hash: judgeTx, retries: 5, interval: 1000 });
  console.log('Judge Receipt Triple:');
  console.log('  status_name     :', judgeReceipt.status_name);
  console.log('  result_name     :', judgeReceipt.result_name);
  console.log('  execution_result:', judgeReceipt.consensus_data?.leader_receipt?.[0]?.execution_result);
}

main().catch(console.error);
