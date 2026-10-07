# SDK and Network Probe Notes

This document records raw findings from probing `genlayer-js@1.1.8` and the GenLayer Studionet RPC (`https://studio.genlayer.com/api`) on contract `0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5`.

## 1. Network Parameters & Chain Verification
Examined from SDK export `import { studionet } from 'genlayer-js/chains'`:
```json
{
  "id": 61999,
  "name": "Genlayer Studio Network",
  "nativeCurrency": {
    "name": "GEN Token",
    "symbol": "GEN",
    "decimals": 18
  },
  "rpcUrls": {
    "default": {
      "http": ["https://studio.genlayer.com/api"]
    }
  },
  "consensusMainContract": {
    "address": "0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575"
  },
  "isStudio": true
}
```
**Comparison**:
- Chain ID `61999` matches the contract configuration.
- Default RPC `https://studio.genlayer.com/api` matches the deployment config.
- `isStudio` flag is `true`.

---

## 2. CORS Probe from Vercel Preview Origin
We probed `https://studio.genlayer.com/api` with `Origin: https://citation-court.vercel.app`:
- **OPTIONS Preflight**:
  - HTTP Status: `200 OK`
  - `access-control-allow-origin: https://citation-court.vercel.app`
  - `access-control-allow-methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT`
  - `access-control-allow-headers: Content-Type`
  - `access-control-allow-credentials: true`
- **POST JSON-RPC**:
  - HTTP Status: `200 OK`
  - `access-control-allow-origin: https://citation-court.vercel.app`
  - RPC result received without errors.
**Conclusion**: The Studionet RPC allows direct browser cross-origin requests from `citation-court.vercel.app`. No proxy server is required for read calls.

---

## 3. Read-Back Verification (Node.js & Read-Only Client)
Probed using `createClient({ chain: studionet })`:
- `get_stats()`:
  ```json
  {"contradicts":2,"not_addressed":2,"supports":2,"total_claims":8,"total_judgments":9,"unreadable":3}
  ```
- `list_recent(10)`:
  ```json
  ["8", "7", "6", "5", "4", "3", "2", "1"]
  ```
- `get_claim("1")`:
  ```json
  {
    "author": "0x06cd2B6279B28A3E82D6b97A35a1bB170a9654bF",
    "claim": "Project Nova quarterly revenue reached $14.2 million representing an increase of 42 percent.",
    "id": "1",
    "schema_version": "1",
    "seq": "1",
    "url": "https://raw.githubusercontent.com/huzyow155/citation-court-genlayer/main/fixtures/supports.md"
  }
  ```
- `get_ruling("1")`:
  ```json
  {
    "attempts": 1,
    "claim_id": "1",
    "schema_version": "1",
    "verdict": "SUPPORTS"
  }
  ```

---

## 4. End-to-End Write Probe & Zero-Balance Account Test
- **Throwaway Key Account**: `0x4c3605baF9adc5e7473332D84F85a8D13938cF18`
- **Initial Balance Check**: `0 wei` (`client.getBalance` confirmed 0).
- **Result**: Zero-balance throwaway account successfully submitted non-payable writes without requiring faucet funding.

### Write 1: Deliberate Failing Write (UserError Test)
- **Input**: `lodge_claim("Short claim", "https://raw.githubusercontent.com/...")` (11 characters < 20 min).
- **Transaction Hash**: `0xdbdaff03f3535d34ffb4c2296ed9b9bd19d8a8cd385e979d0980d90b60ef9100`
- **Receipt Status**:
  - `status_name`: `ACCEPTED`
  - `result_name`: `MAJORITY_AGREE`
  - `consensus_data.leader_receipt[0].execution_result`: `ERROR`
  - `.consensus_data.leader_receipt[0].result.payload`: `"claim length below minimum 20 characters"`
- **Fixture Saved**: `tests/fixtures/receipt_failing_write.json`

### Write 2: Successful `lodge_claim`
- **Input**: 93-character claim against `supports.md`.
- **Transaction Hash**: `0xa3875af779a334ce6d925ccf90ed78b4d53bb93591d51291f623c41523616cd0`
- **Latency**: `8.677s`
- **Receipt Triple**:
  - `status_name`: `ACCEPTED`
  - `result_name`: `MAJORITY_AGREE`
  - `consensus_data.leader_receipt[0].execution_result`: `SUCCESS`
- **State Read-Back**:
  - `latest_by_author("0x4c36...cF18")`: `9`
  - `get_claim("9")`: valid claim record with id `9`.
- **Fixture Saved**: `tests/fixtures/receipt_lodge_success.json`

### Write 3: Successful `judge_claim`
- **Input**: Claim ID `9`.
- **Transaction Hash**: `0x54f9e0692aa2ae52e362b3e06764990e32689ab2663ecffe31dadc995c0791f2`
- **Latency**: `25.353s` (multi-validator web retrieval and LLM evaluation).
- **Receipt Triple**:
  - `status_name`: `ACCEPTED`
  - `result_name`: `MAJORITY_AGREE`
  - `consensus_data.leader_receipt[0].execution_result`: `SUCCESS`
- **State Read-Back**:
  - `get_ruling("9")`: `{"attempts":1,"claim_id":"9","schema_version":"1","verdict":"SUPPORTS"}`
  - `get_stats()`: incremented from 8 claims / 9 judgments to 9 claims / 10 judgments (supports counter incremented from 2 to 3).
- **Fixture Saved**: `tests/fixtures/receipt_judge_success.json`

---

## 5. SDK Architecture & Browser Wallet Integration
Inspected `genlayer-js@1.1.8` source (`node_modules/genlayer-js/dist/index.js`):

1. **Client Construction**:
   - `createClient({ chain, endpoint, account, provider })`
   - Accepts an optional `provider: EthereumProvider`.
   - If `config.provider` is provided, all wallet-bound calls (`eth_sendTransaction`, `eth_signTransaction`, etc.) are dispatched directly to `provider.request()`.
   - If `config.provider` is omitted, it falls back to `window.ethereum` if present.

2. **Transaction Dispatch (`_sendTransaction`)**:
   - When a browser account address is provided (`typeof account !== 'object'`), the SDK calls `_encodeAddTransactionData` to encode the payload for the consensus contract `0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575`.
   - It issues `eth_sendTransaction` with params `[formattedRequest]` through the selected provider.
   - For `chain.isStudio === true`, `_sendTransaction` immediately returns the EVM transaction hash without waiting for an intermediate external EVM log receipt.
   - Polling for finality is then performed via `client.waitForTransactionReceipt({ hash, retries: 120, interval: 3000 })` against `studio.genlayer.com/api`.

3. **EIP-6963 Wallet Discovery**:
   - EIP-6963 events (`eip6963:announceProvider` and `eip6963:requestProvider`) allow detecting all installed extensions independently (MetaMask, Rabby, Coinbase Wallet, etc.).
   - The selected provider instance (`detail.provider`) is passed directly to `createClient({ chain: studionet, account: address, provider })`.
   - This prevents conflict when multiple extensions are installed.

4. **Receipt Success Rule**:
   A transaction succeeded when:
   `status_name === "ACCEPTED" || status_name === "FINALIZED"` AND
   `result_name === "MAJORITY_AGREE"` AND
   `consensus_data.leader_receipt[0].execution_result === "SUCCESS"`.
