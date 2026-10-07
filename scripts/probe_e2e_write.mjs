import { createClient, createAccount } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import fs from 'fs';
import path from 'path';

// Read throwaway key from local .env
const envFile = fs.readFileSync('.env', 'utf8');
const match = envFile.match(/THROWAWAY_PRIVATE_KEY=(0x[a-fA-F0-9]{64})/);
if (!match) {
  throw new Error('THROWAWAY_PRIVATE_KEY not found in .env');
}
const privateKey = match[1];
const account = createAccount(privateKey);

const client = createClient({
  chain: studionet,
  account,
});

const contractAddress = '0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5';

async function main() {
  console.log('=== GenLayer Studionet E2E Write & Probe ===');
  console.log('Throwaway Account:', account.address);

  // 1. Check initial balance
  const balance = await client.getBalance({ address: account.address });
  console.log('Initial balance (wei):', balance.toString());

  const fixturesDir = path.resolve('tests/fixtures');
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }

  // 2. Test deliberate failing write: claim under 20 characters
  console.log('\n--- 1. Testing failing write (too short claim) ---');
  try {
    const failTx = await client.writeContract({
      address: contractAddress,
      functionName: 'lodge_claim',
      args: [
        'Short claim', // 11 characters < 20
        'https://raw.githubusercontent.com/huzyow155/citation-court-genlayer/main/fixtures/supports.md',
      ],
    });
    console.log('Failing write submitted tx:', failTx);
    const failReceipt = await client.waitForTransactionReceipt({
      hash: failTx,
      retries: 120,
      interval: 3000,
    });
    console.log('Failing write receipt status:', failReceipt.status_name, failReceipt.result_name);
    fs.writeFileSync(
      path.join(fixturesDir, 'receipt_failing_write.json'),
      JSON.stringify(failReceipt, null, 2)
    );
  } catch (err) {
    console.log('Failing write caught error:', err.message);
  }

  // 3. Test successful lodge_claim
  console.log('\n--- 2. Testing successful lodge_claim ---');
  const claimText = 'Project Nova quarterly revenue reached $14.2 million representing an increase of 42 percent.';
  const sourceUrl = 'https://raw.githubusercontent.com/huzyow155/citation-court-genlayer/main/fixtures/supports.md';

  const t0Lodge = Date.now();
  const lodgeTx = await client.writeContract({
    address: contractAddress,
    functionName: 'lodge_claim',
    args: [claimText, sourceUrl],
  });
  console.log('Lodge submitted tx:', lodgeTx);
  const lodgeReceipt = await client.waitForTransactionReceipt({
    hash: lodgeTx,
    retries: 120,
    interval: 3000,
  });
  const lodgeLatency = ((Date.now() - t0Lodge) / 1000).toFixed(3);
  console.log(`Lodge confirmed in ${lodgeLatency}s:`, {
    status_name: lodgeReceipt.status_name,
    result_name: lodgeReceipt.result_name,
    leader_result: lodgeReceipt.consensus_data?.leader_receipt?.[0]?.execution_result,
  });
  fs.writeFileSync(
    path.join(fixturesDir, 'receipt_lodge_success.json'),
    JSON.stringify(lodgeReceipt, null, 2)
  );

  // Read back latest id
  const latestIdRaw = await client.readContract({
    address: contractAddress,
    functionName: 'latest_by_author',
    args: [account.address],
  });
  console.log('latest_by_author read-back:', latestIdRaw);
  const newId = JSON.parse(latestIdRaw);
  console.log('New Claim ID:', newId);

  const claimRecord = await client.readContract({
    address: contractAddress,
    functionName: 'get_claim',
    args: [String(newId)],
  });
  console.log('get_claim read-back:', claimRecord);

  // 4. Test judge_claim
  console.log(`\n--- 3. Testing judge_claim for ID ${newId} ---`);
  const t0Judge = Date.now();
  const judgeTx = await client.writeContract({
    address: contractAddress,
    functionName: 'judge_claim',
    args: [String(newId)],
  });
  console.log('Judge submitted tx:', judgeTx);
  const judgeReceipt = await client.waitForTransactionReceipt({
    hash: judgeTx,
    retries: 120,
    interval: 3000,
  });
  const judgeLatency = ((Date.now() - t0Judge) / 1000).toFixed(3);
  console.log(`Judge confirmed in ${judgeLatency}s:`, {
    status_name: judgeReceipt.status_name,
    result_name: judgeReceipt.result_name,
    leader_result: judgeReceipt.consensus_data?.leader_receipt?.[0]?.execution_result,
  });
  fs.writeFileSync(
    path.join(fixturesDir, 'receipt_judge_success.json'),
    JSON.stringify(judgeReceipt, null, 2)
  );

  // Read back ruling
  const rulingRecord = await client.readContract({
    address: contractAddress,
    functionName: 'get_ruling',
    args: [String(newId)],
  });
  console.log('get_ruling read-back:', rulingRecord);

  // Read back stats
  const statsRecord = await client.readContract({
    address: contractAddress,
    functionName: 'get_stats',
    args: [],
  });
  console.log('get_stats read-back:', statsRecord);
}

main().catch(console.error);
