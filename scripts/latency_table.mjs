import fs from 'fs';

const liveEvidencePath = 'E:/Citation Court/scripts/deploy/live_evidence.json';
const liveRaw = fs.readFileSync(liveEvidencePath, 'utf8');
const liveData = JSON.parse(liveRaw);

// Case definitions from live_evidence.json
// Cases A-E and H are full LLM judgments
// Case F has initial judge (12.081s) and rejudge (8.850s) -> fast UNREADABLE
// Case G has judge (9.423s) -> fast UNREADABLE

console.log('=== CITATION COURT LATENCY AUDIT TABLE ===\n');

const cases = liveData.cases;
const measuredRows = [];

// Mapping cases
for (let i = 0; i < cases.length; i++) {
  const c = cases[i];
  if (c.case_name === 'case_a_supports') {
    measuredRows.push({
      case: 'Case A (SUPPORTS)',
      name: c.case_name,
      type: 'Full LLM Judgment',
      latency: c.latency_sec, // 15.123
      source: `live_evidence.json:cases[${i}].latency_sec`,
    });
  } else if (c.case_name === 'case_b_contradicts') {
    measuredRows.push({
      case: 'Case B (CONTRADICTS)',
      name: c.case_name,
      type: 'Full LLM Judgment',
      latency: c.latency_sec, // 15.519
      source: `live_evidence.json:cases[${i}].latency_sec`,
    });
  } else if (c.case_name === 'case_c_not_addressed') {
    measuredRows.push({
      case: 'Case C (NOT_ADDRESSED)',
      name: c.case_name,
      type: 'Full LLM Judgment',
      latency: c.latency_sec, // 15.319
      source: `live_evidence.json:cases[${i}].latency_sec`,
    });
  } else if (c.case_name === 'case_d_near_miss') {
    measuredRows.push({
      case: 'Case D (Near Miss)',
      name: c.case_name,
      type: 'Full LLM Judgment',
      latency: c.latency_sec, // 12.058
      source: `live_evidence.json:cases[${i}].latency_sec`,
    });
  } else if (c.case_name === 'case_e_prompt_injection') {
    measuredRows.push({
      case: 'Case E (Prompt Injection)',
      name: c.case_name,
      type: 'Full LLM Judgment',
      latency: c.latency_sec, // 15.403
      source: `live_evidence.json:cases[${i}].latency_sec`,
    });
  } else if (c.case_name === 'case_f_unreadable_404_and_rejudge') {
    measuredRows.push({
      case: 'Case F (initial 404, F1)',
      name: c.case_name,
      type: 'Fast UNREADABLE',
      latency: c.latency_sec, // 12.081
      source: `live_evidence.json:cases[${i}].latency_sec`,
    });
    measuredRows.push({
      case: 'Case F (re-judge 404, F2)',
      name: c.case_name,
      type: 'Fast UNREADABLE',
      latency: 8.850,
      source: `Citation Court/docs/VERIFICATION.md:45 (rejudge_tx ${c.rejudge_tx.slice(0, 10)}...)`,
    });
  } else if (c.case_name === 'case_g_unreadable_short_page') {
    measuredRows.push({
      case: 'Case G (Short Page)',
      name: c.case_name,
      type: 'Fast UNREADABLE',
      latency: c.latency_sec, // 9.423
      source: `live_evidence.json:cases[${i}].latency_sec`,
    });
  } else if (c.case_name === 'case_wiki_earth') {
    measuredRows.push({
      case: 'Case H (Wiki Earth)',
      name: c.case_name,
      type: 'Full LLM Judgment',
      latency: c.latency_sec, // 15.330
      source: `live_evidence.json:cases[${i}].latency_sec`,
    });
  }
}

// App E2E probe runs (Claim 9 & write tests)
const appE2ERows = [
  {
    case: 'Claim 9 (Lodge Write)',
    name: 'probe_e2e_write_lodge_success',
    type: 'Lodge Transaction',
    latency: 8.677,
    source: 'docs/SDK_NOTES.md:101 / scripts/probe_e2e_write.mjs',
  },
  {
    case: 'Deliberate Failing Write',
    name: 'probe_e2e_write_short_claim_fail',
    type: 'Write Failure',
    latency: 8.441,
    source: 'docs/SDK_NOTES.md:90 / scripts/probe_e2e_write.mjs',
  },
  {
    case: 'Claim 9 (Judge Consensus)',
    name: 'probe_e2e_write_judge_success',
    type: 'Full LLM Judgment',
    latency: 25.353,
    source: 'docs/SDK_NOTES.md:114 / scripts/probe_e2e_write.mjs',
  },
];

console.log('--- 1. Individual Raw Measurements ---');
console.log(
  `${'Case / Operation'.padEnd(28)} ${'Type'.padEnd(20)} ${'Latency (s)'.padEnd(14)} ${'Source Field Path'}`
);
console.log('-'.repeat(105));
for (const r of [...measuredRows, ...appE2ERows]) {
  console.log(
    `${r.case.padEnd(28)} ${r.type.padEnd(20)} ${r.latency.toFixed(3).padEnd(14)} ${r.source}`
  );
}

// Groupings and Statistical Calculations
console.log('\n--- 2. Segmented Group Statistics ---');

// Group 1: Lodge Success
const lodgeSuccess = [8.677];
// Group 2: Write Failure
const writeFail = [8.441];

// Group 3: Full LLM Consensus Judgments
// Baseline 6 runs: A (15.123), B (15.519), C (15.319), D (12.058), E (15.403), H (15.330)
const llmBaseline = [15.123, 15.519, 15.319, 12.058, 15.403, 15.330];
const llmBaselineSum = llmBaseline.reduce((a, b) => a + b, 0);
const llmBaselineMean = llmBaselineSum / llmBaseline.length;

// All 7 LLM runs: Baseline 6 + Claim 9 (25.353)
const llmAll = [...llmBaseline, 25.353];
const llmAllSum = llmAll.reduce((a, b) => a + b, 0);
const llmAllMean = llmAllSum / llmAll.length;

// Group 4: Fast UNREADABLE Consensus
// F1 (12.081), F2 (8.850), G (9.423)
const unreadableFast = [12.081, 8.850, 9.423];
const unreadableSum = unreadableFast.reduce((a, b) => a + b, 0);
const unreadableMean = unreadableSum / unreadableFast.length;

// All 10 measured judgments on chain (Cases A-H including F2 + Claim 9)
const allJudgments = [...llmAll, ...unreadableFast];
const allJudgmentsSum = allJudgments.reduce((a, b) => a + b, 0);
const allJudgmentsMean = allJudgmentsSum / allJudgments.length;

const statsTable = [
  {
    group: 'Lodge Transaction (success)',
    n: lodgeSuccess.length,
    mean: lodgeSuccess[0].toFixed(3) + ' s',
    range: `${Math.min(...lodgeSuccess).toFixed(3)} s`,
    budget: '8 – 10 s',
  },
  {
    group: 'Write Failure (rejected)',
    n: writeFail.length,
    mean: writeFail[0].toFixed(3) + ' s',
    range: `${Math.min(...writeFail).toFixed(3)} s`,
    budget: '8 – 10 s',
  },
  {
    group: 'LLM Judgments (Baseline A-E, H)',
    n: llmBaseline.length,
    mean: llmBaselineMean.toFixed(3) + ' s',
    range: `${Math.min(...llmBaseline).toFixed(3)} s – ${Math.max(...llmBaseline).toFixed(3)} s`,
    budget: '15 – 25 s',
  },
  {
    group: 'LLM Judgments (All, incl. Claim 9)',
    n: llmAll.length,
    mean: llmAllMean.toFixed(3) + ' s',
    range: `${Math.min(...llmAll).toFixed(3)} s – ${Math.max(...llmAll).toFixed(3)} s`,
    budget: '15 – 28 s',
  },
  {
    group: 'Fast UNREADABLE (F1, F2, G)',
    n: unreadableFast.length,
    mean: unreadableMean.toFixed(3) + ' s',
    range: `${Math.min(...unreadableFast).toFixed(3)} s – ${Math.max(...unreadableFast).toFixed(3)} s`,
    budget: '10 – 15 s',
  },
  {
    group: 'All 10 Measured Judgments',
    n: allJudgments.length,
    mean: allJudgmentsMean.toFixed(3) + ' s',
    range: `${Math.min(...allJudgments).toFixed(3)} s – ${Math.max(...allJudgments).toFixed(3)} s`,
    budget: '30 s (threshold)',
  },
];

console.log(
  `${'Execution Group'.padEnd(35)} ${'n'.padEnd(5)} ${'Mean Latency'.padEnd(16)} ${'Observed Range'.padEnd(24)} ${'Recommended Budget'}`
);
console.log('-'.repeat(105));
for (const s of statsTable) {
  console.log(
    `${s.group.padEnd(35)} ${String(s.n).padEnd(5)} ${s.mean.padEnd(16)} ${s.range.padEnd(24)} ${s.budget}`
  );
}

console.log('\n--- Detailed Breakdown of LLM Baseline 6 Runs ---');
console.log(`Sum of 6 baseline runs: ${llmBaselineSum.toFixed(3)} s`);
console.log(`Calculation: (${llmBaseline.map(v => v.toFixed(3)).join(' + ')}) / 6 = ${llmBaselineMean.toFixed(3)} s`);
console.log(`\nDetailed Breakdown of All 7 LLM Runs:`);
console.log(`Sum of 7 LLM runs: ${llmAllSum.toFixed(3)} s`);
console.log(`Calculation: (${llmAll.map(v => v.toFixed(3)).join(' + ')}) / 7 = ${llmAllMean.toFixed(3)} s`);
console.log(`\nDetailed Breakdown of 3 Fast UNREADABLE Runs:`);
console.log(`Sum of 3 UNREADABLE runs: ${unreadableSum.toFixed(3)} s`);
console.log(`Calculation: (${unreadableFast.map(v => v.toFixed(3)).join(' + ')}) / 3 = ${unreadableMean.toFixed(3)} s`);
console.log(`\nDetailed Breakdown of All 10 Judgments:`);
console.log(`Sum of 10 judgment runs: ${allJudgmentsSum.toFixed(3)} s`);
console.log(`Calculation: (${allJudgments.map(v => v.toFixed(3)).join(' + ')}) / 10 = ${allJudgmentsMean.toFixed(3)} s`);
