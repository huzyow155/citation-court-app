# On-Chain Verification Walkthrough

This document provides exact commands to independently verify all deployed contracts, reference cases, and on-chain transactions on GenLayer Studionet.

## 1. Deployed Contracts Verification
- **Network**: GenLayer Studionet (Chain ID `61999`)
- **RPC Endpoint**: `https://studio.genlayer.com/api`
- **CitationCourt Address**: `0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5`
- **CitedBoard Address**: `0x339dA01705d57f0d6AD917f0eC4950f8a8f95CC4`
- **Contract Source Hash**: `459370ecf5916af40937602d1c266f467aa9228e832545e989aa0718a2e0a7e2`

### Query Contract Schema
```bash
curl -s -X POST https://studio.genlayer.com/api \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"gen_getContractSchema","params":["0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5"]}'
```

---

## 2. Platform Tally Read-Back
```bash
curl -s -X POST https://studio.genlayer.com/api \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"gen_callViewFunction","params":{"address":"0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5","function_name":"get_stats","args":[]}}'
```
**Expected Output Record**:
```json
{"contradicts":2,"not_addressed":2,"supports":4,"total_claims":10,"total_judgments":11,"unreadable":3}
```

---

## 3. Querying Individual Claims & Rulings

### Query Claim #1 (Case A: SUPPORTS)
```bash
curl -s -X POST https://studio.genlayer.com/api \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"gen_callViewFunction","params":{"address":"0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5","function_name":"get_claim","args":["1"]}}'
```
**Ruling Read-Back**:
```bash
curl -s -X POST https://studio.genlayer.com/api \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"gen_callViewFunction","params":{"address":"0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5","function_name":"get_ruling","args":["1"]}}'
```
Output:
```json
{"attempts":1,"claim_id":"1","schema_version":"1","verdict":"SUPPORTS"}
```

### Query Claim #8 (Case H: Wikipedia Earth SUPPORTS)
```bash
curl -s -X POST https://studio.genlayer.com/api \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"gen_callViewFunction","params":{"address":"0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5","function_name":"get_ruling","args":["8"]}}'
```
Output:
```json
{"attempts":1,"claim_id":"8","schema_version":"1","verdict":"SUPPORTS"}
```

---

## 4. Reference Transaction Hashes

| Claim ID | Case Description | Lodge Transaction | Judge Transaction | Final Verdict |
|---|---|---|---|---|
| 1 | Case A (Supports) | `0x041b1d4af8da6622451e49b4d045a43a6d87e4b2a63e1d3f544779a0b9fc5cc9` | `0xa64cd6227bd3ed898d955f01fb44bd05e234ae4219c4b3b7f2e8d0b2a85ba0ea` | `SUPPORTS` |
| 2 | Case B (Contradicts) | `0x4d94d98607705f3567a51f68977e37ee7fe32f93a1bdacb58836a3f35c842236` | `0xfd75f4f5d4a3bcd42d4bcc541b6da938962bc88d8baa6ad3db49c77495d4fe7f` | `CONTRADICTS` |
| 3 | Case C (Not Addressed) | `0x587c85f3f162d39970b49c02f44e36555321ab2150dd6efdd2b5d8778018b763` | `0xa5a690dd6fd068bd08e3118fe8dc3583af8f30fd64cfe4e9567bd3b50dff7cc4` | `NOT_ADDRESSED` |
| 4 | Case D (Near-Miss) | `0xbe1a397bb81e0f5bebf6570cf0189bd243a8a1b7f0b428c270cb3b122aac4089` | `0x7fdb59625542ea1ddc594f04e382f5ed50c38e1d71fac7cd61c6a20f6ca4b3e0` | `CONTRADICTS` |
| 5 | Case E (Prompt Injection Defense) | `0x7d0361441f7d38f07d00399b108ced75b0025ca828addd1f04342395fdd14e9a` | `0x469a88b87f8b57395755fe0a8e65e6963b818df756101174c16feb015eddb651` | `NOT_ADDRESSED` |
| 6 | Case F (HTTP 404 & Re-Judge) | `0x734a684a9abc9947ee32a75edb85665e9c0fa2108cc8d25baca99d45188a1c62` | `0xc3bbd9392441e1754ad32174b405419899ca1856d53d63c4edbeaa5e2ccc1ce2` | `UNREADABLE` (Attempt 2) |
| 7 | Case G (Sub-200 chars page) | `0xc6055bbb59c8d1883c0fd990414f98bb5ab61eb12be9b2ba2bff5307374c83d2` | `0xc140440182750ea3f4f12ea0ce6e6b1c9bd94c98c499de77753ffed7367f8b65` | `UNREADABLE` |
| 8 | Case H (Wikipedia Earth) | `0x5079397ca576761237edaac4b155b507c81802fa84b9e8da09f3b4bc094f5a9b` | `0xdb555c3638b551b6aeef67a88b2f58063881995af5ba449d2c8e4c6d4c261ecf` | `SUPPORTS` |
| 9 | Studionet Probe E2E Write | `0xa3875af779a334ce6d925ccf90ed78b4d53bb93591d51291f623c41523616cd0` | `0x54f9e0692aa2ae52e362b3e06764990e32689ab2663ecffe31dadc995c0791f2` | `SUPPORTS` |
