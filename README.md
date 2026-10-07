# Citation Court

Citation Court checks whether the webpage behind a link contains normalized textual evidence supporting or contradicting a single-fact claim.

Independent GenLayer validators fetch the cited URL and evaluate the claim under the Equivalence Principle. The contract stores the consensus verdict (`SUPPORTS`, `CONTRADICTS`, `NOT_ADDRESSED`, or `UNREADABLE`). It does not assert whether the cited source is trustworthy or whether the claim is objectively true in the real world; it checks textual presence and semantic alignment on the cited webpage.

- **Production Application**: [https://citation-court.vercel.app](https://citation-court.vercel.app)
- **Status**: Preview
- **Network**: GenLayer Studionet (Chain ID `61999`)
- **Studionet RPC**: `https://studio.genlayer.com/api`
- **Intelligent Contract**: [`0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5`](https://explorer-studio.genlayer.com/address/0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5)
- **Contract Source Hash (SHA-256)**: `459370ecf5916af40937602d1c266f467aa9228e832545e989aa0718a2e0a7e2`
- **Consumer Contract (CitedBoard)**: [`0x339dA01705d57f0d6AD917f0eC4950f8a8f95CC4`](https://explorer-studio.genlayer.com/address/0x339dA01705d57f0d6AD917f0eC4950f8a8f95CC4)
- **Contract Repository**: [huzyow155/citation-court-genlayer](https://github.com/huzyow155/citation-court-genlayer)
- **Application Repository**: [huzyow155/citation-court-app](https://github.com/huzyow155/citation-court-app)

---

## 1. Problem & Approach

On-chain claims frequently reference off-chain URLs, but smart contracts historically could not inspect external web content without centralized oracle intermediaries. 

Citation Court provides a decentralized verification flow on GenLayer:
1. **Lodging**: Anyone submits a single-fact claim (20–400 characters) and a source URL (HTTP/HTTPS, up to 300 characters).
2. **Independent Retrieval**: Multiple GenLayer validator nodes independently retrieve the raw web page over HTTP.
3. **HTML Normalization & Grounding**: Validators extract visible body text, normalize whitespace, punctuation, and casing, and verify whether quoted evidence exists verbatim within the retrieved body text. If a quote is absent, the verdict is downgraded to `NOT_ADDRESSED`.
4. **Equivalence Consensus**: Independent LLMs run by validators evaluate semantic alignment. If a majority agrees, the verdict is recorded on-chain.
5. **No Wallet Barrier for Readers**: Anyone can browse claims, rulings, and consensus evidence without connecting a wallet. Submitting or judging claims requires an EIP-1193 wallet (such as MetaMask or Rabby).

The on-chain store contains 8 baseline reference runs (Claims 1 through 8, representing test Cases A to H); claims after that are test or user-lodged, notably Claim 9 which is the dApp E2E write test run (`"Project Nova quarterly revenue reached $14.2 million representing an increase of 42 percent."` against `supports.md`, verdict: `SUPPORTS`). The current on-chain tally is 9 claims registered across 10 validator evaluations (`supports: 3`, `contradicts: 2`, `not_addressed: 2`, `unreadable: 3`).

---

## 2. Verdicts & Visual Vernacular

The user interface uses proofreading marks to represent consensus outcomes directly on the claim text:
- **SUPPORTS**: Highlighter marker behind the quote.
- **CONTRADICTS**: Red strike-through line across the sentence.
- **NOT_ADDRESSED**: Dotted underline with a `[not addressed]` marker.
- **UNREADABLE**: Redaction bar across the source URL line with a notice that the page could not be read.
- **PENDING**: Dashed underline indicating the claim is awaiting judgment.

---

## 3. Local Development

### Requirements
- Node.js >= 20
- npm >= 10

### Setup & Run
```bash
# Clone the repository
git clone https://github.com/huzyow155/citation-court-app.git
cd citation-court-app

# Install dependencies
npm install

# Start local development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Verification & Testing
```bash
# Run unit tests with vitest
npm test

# Run full verification (tests, typecheck, build)
npm run verify
```

---

## 4. Re-pointing After a Studionet Reset

GenLayer periodically resets Studionet state. When this occurs:
1. Deploy a fresh instance of `CitationCourt.py` from the contract repository (`huzyow155/citation-court-genlayer`).
2. Set the newly deployed contract address in `.env`:
   ```bash
   VITE_CONTRACT_ADDRESS=0x<NEW_CONTRACT_ADDRESS>
   ```
3. Run the evidence synchronization script to refresh local reference records:
   ```bash
   node scripts/sync_evidence.mjs
   ```
4. Build and deploy to production:
   ```bash
   npm run build
   vercel --prod
   ```

---

## 5. Documentation Directory

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md): System topology, EIP-6963 wallet discovery, decoupled service layer, and receipt verification rules.
- [`docs/DESIGN_PLAN.md`](./docs/DESIGN_PLAN.md): Color tokens, typography choices, ASCII wireframes, anti-generic defaults critique, and quality floor audit.
- [`docs/API.md`](./docs/API.md): Complete contract interface specification, view methods, write methods, return structures, and UserError mappings.
- [`docs/VERIFICATION.md`](./docs/VERIFICATION.md): Step-by-step commands for querying contracts, tally stats, and transaction hashes via curl.
- [`docs/TROUBLESHOOTING.md`](./docs/TROUBLESHOOTING.md): Network switching, zero-balance gas behavior, consensus timeouts, and reload resumption.
- [`docs/SDK_NOTES.md`](./docs/SDK_NOTES.md): Technical findings on `genlayer-js@1.1.8`, CORS origin reflections, and receipt triples.
- [`docs/screenshots/`](./docs/screenshots/): 14 incognito screenshots of all 7 routes without wallet, plus 2 connect modal screenshots labeled mock provider (`connect_modal_mock_provider_desktop_1280.png`, `connect_modal_mock_provider_mobile_390.png`) captured by injecting simulated EIP-6963 provider announcements in headless Chrome.

---

## 6. Known Limitations & Unverified Items

### Known Limitations
- **Consensus Latency**: Transactions take 8.4 to 25.4 seconds to reach consensus based on real repository benchmarks (n=11, lodge: 8.4s–8.7s [n=2], judge: 9.4s–25.4s [n=9]). UI notices trigger when waiting exceeds measured thresholds (>9s for lodge, >26s for judge).
- **Anti-Bot Protections**: Webpages behind Cloudflare Turnstile, CAPTCHAs, or strict anti-scraping paywalls cannot be read by validators and resolve as `UNREADABLE`.
- **Dynamic Content**: Pages relying entirely on client-side single-page JavaScript rendering may provide insufficient HTML body text to validators, resulting in `UNREADABLE` (sub-200 characters) or `UNDETERMINED`.
- **Zero Balance Warnings**: While Studionet executes non-payable contract calls with 0 wei balance, a wallet may show a zero-balance warning before submission.

### Unverified Items
- **MetaMask GUI Verification**: Automated test suites in this repository run headlessly without browser extension GUIs. The write service flow was confirmed on Studionet via Node scripts with throwaway keys; the MetaMask GUI step has not been tried.
- **Third-Party Wallet Mobile Apps**: Tested against desktop Chrome and Firefox; hardware wallets (e.g. Ledger via MetaMask) on Studionet have not been independently exercised.

---

## License

MIT (see [LICENSE](./LICENSE)). Copyright (c) 2026 huzyow155.
