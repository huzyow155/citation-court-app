# Troubleshooting & Operational Guide

This document covers operational procedures for GenLayer Studionet environment resets, wallet configuration issues, transaction latency, and contract execution errors.

---

## 1. Handling Studionet Resets

GenLayer periodically resets the Studionet state. When a reset occurs, existing contract deployments and storage entries are cleared.

### Step 1: Deploy a Fresh Contract
From the contract repository (`citation-court-genlayer`):
```bash
# Verify environment and run deployment script
python scripts/deploy.py
```
Note the newly assigned contract address (e.g., `0x...`).

### Step 2: Update Application Configuration
Update the contract address in `src/config.ts` or set the environment variable:
```bash
# In local development (.env):
VITE_CITATION_COURT_ADDRESS=0x<NEW_CONTRACT_ADDRESS>
```

### Step 3: Resynchronize Evidence Data
Run the reference case sync script against the new contract:
```bash
node scripts/sync_evidence.mjs
```

### Step 4: Redeploy to Vercel
Push to GitHub or trigger a production deployment:
```bash
vercel --prod
```

---

## 2. Wallet & Network Configuration

### Network Details for Studionet
If automatic chain addition via EIP-3085 fails in your wallet, configure the network manually:
- **Network Name**: GenLayer Studio
- **RPC URL**: `https://studio.genlayer.com/api`
- **Chain ID**: `61999` (Hex: `0xf22f`)
- **Currency Symbol**: `GEN`
- **Block Explorer URL**: `https://explorer-studio.genlayer.com`

### Zero Balance Notice
Studionet allows non-payable transactions (`lodge_claim`, `judge_claim`) from accounts with zero balance (0 GEN). However, a wallet may show a zero-balance warning if an account has 0 wei. If prompted, proceed with the transaction submission; Studionet nodes accept the transaction without requiring gas fees.

---

## 3. Transaction Latency & Consensus Timeouts

### Expected Latency (8.4 to 25.4 Seconds, n=11)
Based on repository benchmarks across 11 measured transactions (lodge: 8.4s–8.7s [n=2], judge: 9.4s–25.4s [n=9]), GenLayer transactions require validator nodes to:
1. Make external HTTP requests to fetch the referenced URL.
2. Normalize whitespace, punctuation, and casing from the HTML body.
3. Run equivalence prompts through validator LLMs.
4. Reach consensus among validator nodes.

### Resume After Reload
If you refresh the browser or navigate away while a judgment is in progress:
- The transaction hash is stored in `localStorage` (`citation_court_pending_tx`).
- Upon returning to the claim page, the interface automatically resumes polling for the receipt up to a 6-minute window.

---

## 4. Contract Outcomes & Resolution

### Verdict: UNREADABLE
- **Cause**: The web page returned an HTTP error (4xx/5xx), was blocked by an anti-bot challenge, or the extracted body contained fewer than 200 characters.
- **Action**: Verify the URL is publicly reachable. If the issue was temporary, click "Judge again" if attempts remain.

### Result: MAJORITY_DISAGREE / UNDETERMINED
- **Cause**: Validator nodes received divergent web page contents (such as personalized A/B test variations or geo-targeted headers) and could not form a consensus majority.
- **Action**: Submit the judgment again.

### Contract UserError Messages
- `claim length below minimum 20 characters`: Claims must be at least 20 characters long.
- `claim length exceeds maximum 400 characters`: Claims must not exceed 400 characters.
- `source url exceeds maximum 300 characters`: The URL is too long.
- `unsupported url scheme`: The URL must start with `http://` or `https://`.
- `ip literal hosts not permitted`: Numeric IPv4 and IPv6 hosts are disallowed for safety.
- `localhost and loopback hosts not permitted`: Private network URLs cannot be evaluated.
- `userinfo in url not permitted`: URLs containing credentials (e.g., `user:pass@`) are rejected.
