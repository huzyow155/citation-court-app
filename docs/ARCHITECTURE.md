# Architecture & Client Design

This document details the architectural layout, client layers, wallet discovery mechanism, and transaction lifecycle in the Citation Court application.

## 1. System Topology

The application is structured into distinct decoupling layers:

```
+-------------------------------------------------------------------+
|                        React Application                          |
|  - Pages: Home, ClaimDetail, LodgeClaim, MyClaims, Evidence, About|
|  - Components: MarkedClaim, WalletModal, ReceiptViewer            |
|  - State: WalletContext (EIP-6963), pending tx localStorage cache |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                         Service Layer                             |
|  - genlayer.ts: Read/write contract calls, receipt polling        |
|  - wallet.ts: EIP-6963 provider discovery & chain switching       |
|  - error_mapper.ts: Contract UserError & JSON-RPC parser          |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     Transport & SDK Layer                         |
|  - genlayer-js@1.1.8 client abstraction                           |
|  - Read Client: HTTP JSON-RPC to https://studio.genlayer.com/api  |
|  - Write Client: EIP-1193 Provider (MetaMask/Rabby/Injected)      |
+-------------------------------------------------------------------+
                                  |
                                  v
+-------------------------------------------------------------------+
|                     GenLayer Studionet                            |
|  - Intelligent Contract: CitationCourt.py (0x58aDf2Fd...8CFa5)     |
|  - Consensus: Multi-validator web retrieval & LLM equivalence     |
+-------------------------------------------------------------------+
```

---

## 2. Decoupled Service Layer

The service functions in `src/services/genlayer.ts` do not depend on React hooks or UI state. They accept an optional `client` argument:
- When called from the browser without a wallet, a default read client (`getReadClient()`) communicates with the Studionet RPC endpoint (`https://studio.genlayer.com/api`).
- When called from a connected browser session, the wallet's EIP-1193 provider is wrapped in a `genlayer-js` client instance.
- When called from Node CLI verification scripts (such as `scripts/probe_e2e_write.mjs`), a throwaway account is passed to the same service functions.

This architecture ensures identical transaction encoding and receipt evaluation logic across both unit tests, command-line probes, and the user interface.

---

## 3. Wallet Discovery (EIP-6963) & Chain Management

### Provider Discovery
Rather than relying solely on `window.ethereum` (which suffers from conflicts when multiple extensions are installed), the application listens for EIP-6963 announcement events:
1. Dispatches `eip6963:requestProvider` upon component mount.
2. Listens for `eip6963:announceProvider` events and collects `EIP6963ProviderDetail` descriptors (UUID, name, icon, and provider reference).
3. Falls back to `window.ethereum` if no EIP-6963 announcements are emitted.
4. Renders a provider selection dialog if multiple injected wallets are present.

### Studionet Chain Switching
When a wallet connects, the app verifies that `chainId === "0xf22f"` (61999):
1. Issues `wallet_switchEthereumChain` with `{ chainId: "0xf22f" }`.
2. If the wallet returns error code `4902` (Unrecognized chain ID), the application requests `wallet_addEthereumChain` using the exact network parameters:
   - Chain ID: `0xf22f` (61999)
   - Chain Name: `GenLayer Studio`
   - RPC URL: `https://studio.genlayer.com/api`
   - Native Currency: `GEN` (18 decimals)
   - Block Explorer: `https://explorer-studio.genlayer.com`

---

## 4. Write Flow & Receipt Verification

Writing to GenLayer Studionet requires specialized consensus handling.

### Step 1: Transaction Dispatch
- `client.writeContract({ address, functionName, args })` encodes the call and dispatches it via the provider's `eth_sendTransaction`.
- The node responds immediately with an EVM transaction hash (66 hex characters).

### Step 2: Receipt Polling & Resumption
- Intelligent contracts require validator consensus and external web fetches. Execution latency typically ranges from 8 to 35 seconds.
- The app stores pending transaction records in `localStorage` under `citation_court_pending_tx` with metadata (`hash`, `type`, `claimId`, `timestamp`).
- If the user reloads or navigates away, the polling resumes upon page load with a 6-minute timeout budget.

### Step 3: Receipt Validation Triple
A transaction is considered successful when all three conditions evaluate true:
1. `receipt.status_name === "ACCEPTED" || receipt.status_name === "FINALIZED"`
2. `receipt.result_name === "MAJORITY_AGREE"`
3. `receipt.consensus_data.leader_receipt[0].execution_result === "SUCCESS"`

If `execution_result === "ERROR"`, the error message from the Python execution frame is parsed and mapped to user-friendly guidance via `error_mapper.ts`.

---

## 5. UI Proofreader Vernacular

Visual indicators on claim texts correspond directly to contract verdicts:
- **SUPPORTS**: Highlighter marker behind the quote.
- **CONTRADICTS**: Red strike-through line.
- **NOT_ADDRESSED**: Dotted underline with superscript marker.
- **UNREADABLE**: Redaction bar across the source URL line.
- **PENDING**: Dashed pencil underline.

All styling uses standard CSS properties (`box-decoration-break: clone`, variable-driven tokens) and avoids heavy third-party UI dependencies.
