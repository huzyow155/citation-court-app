import { createClient } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';
import fs from 'fs';
import path from 'path';

const client = createClient({ chain: studionet });
const contractAddress = '0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5';

async function syncEvidence() {
  console.log('=== Verifying Reference Evidence against Studionet ===');
  const sourcePath = 'e:/Citation Court/scripts/deploy/live_evidence.json';
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Cannot find ${sourcePath}`);
  }
  const rawLive = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  const verifiedCases = [];

  for (const c of rawLive.cases) {
    console.log(`Checking Claim #${c.claim_id} (${c.case_name})...`);
    
    // Read on-chain claim
    const claimRaw = await client.readContract({
      address: contractAddress,
      functionName: 'get_claim',
      args: [String(c.claim_id)],
    });
    const onChainClaim = JSON.parse(claimRaw);

    // Read on-chain ruling
    const rulingRaw = await client.readContract({
      address: contractAddress,
      functionName: 'get_ruling',
      args: [String(c.claim_id)],
    });
    const onChainRuling = JSON.parse(rulingRaw);

    const expectedVerdict = c.rejudge_ruling ? c.rejudge_ruling.verdict : c.recorded_verdict;
    const expectedAttempts = c.rejudge_ruling ? c.rejudge_ruling.attempts : c.attempts;

    if (onChainRuling.verdict !== expectedVerdict) {
      throw new Error(`Verdict mismatch for claim ${c.claim_id}: expected ${expectedVerdict}, on-chain ${onChainRuling.verdict}`);
    }
    if (onChainRuling.attempts !== expectedAttempts) {
      throw new Error(`Attempts mismatch for claim ${c.claim_id}: expected ${expectedAttempts}, on-chain ${onChainRuling.attempts}`);
    }

    verifiedCases.push({
      claim_id: String(c.claim_id),
      case_name: c.case_name,
      description: c.description,
      claim_text: onChainClaim.claim,
      source_url: onChainClaim.url,
      author: onChainClaim.author,
      lodge_tx: c.lodge_tx,
      judge_tx: c.rejudge_tx || c.judge_tx,
      initial_judge_tx: c.judge_tx,
      rejudge_tx: c.rejudge_tx || null,
      verdict: onChainRuling.verdict,
      attempts: onChainRuling.attempts,
      latency_sec: c.latency_sec,
    });
    console.log(`  ✓ Verified Claim #${c.claim_id}: verdict=${onChainRuling.verdict}, attempts=${onChainRuling.attempts}`);
  }

  // Check stats
  const statsRaw = await client.readContract({
    address: contractAddress,
    functionName: 'get_stats',
    args: [],
  });
  const onChainStats = JSON.parse(statsRaw);
  console.log('On-chain stats read-back:', onChainStats);

  const evidencePayload = {
    verifiedAt: new Date().toISOString(),
    contractAddress,
    consumerAddress: '0x339dA01705d57f0d6AD917f0eC4950f8a8f95CC4',
    sourceSha256: '459370ecf5916af40937602d1c266f467aa9228e832545e989aa0718a2e0a7e2',
    statsSnapshot: onChainStats,
    cases: verifiedCases,
  };

  const outDir = path.resolve('src/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, 'evidence.json');
  fs.writeFileSync(outFile, JSON.stringify(evidencePayload, null, 2));
  console.log(`Successfully verified and saved ${verifiedCases.length} cases to ${outFile}`);
}

syncEvidence().catch(console.error);
