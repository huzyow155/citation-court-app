# Citation Court Smart Contract API Reference

This document describes the public interface of `CitationCourt.py` deployed on GenLayer Studionet at `0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5`.

## 1. Network & Chain Identity
- **Network**: GenLayer Studionet
- **Chain ID**: `61999`
- **RPC URL**: `https://studio.genlayer.com/api`
- **Explorer**: `https://explorer-studio.genlayer.com/address/0x58aDf2Fd47dD939623BFd66929ec26117fb8CFa5`
- **Source SHA-256**: `459370ecf5916af40937602d1c266f467aa9228e832545e989aa0718a2e0a7e2`

---

## 2. Public Write Methods

### `lodge_claim(claim: str, source_url: str) -> str`
Lodges a new single-fact assertion and its supporting webpage URL.
- **Arguments**:
  - `claim` (`string`): 20 to 400 characters (stripped).
  - `source_url` (`string`): Maximum 300 characters, `https://` scheme, port 443 or omitted, no userinfo, no localhost, no private/reserved IP literals.
- **Return Value**: Incremental string decimal claim ID (e.g., `"1"`, `"9"`).
- **Receipt Behavior**: Write transactions do not return values directly in write receipts. Callers read the assigned ID via `latest_by_author(caller_address)`.

### `judge_claim(claim_id: str) -> str`
Triggers multi-validator web retrieval and LLM evaluation under the Equivalence Principle.
- **Arguments**:
  - `claim_id` (`string`): ID of an existing lodged claim.
- **Rules & Preconditions**:
  - Unknown claim ID raises `gl.vm.UserError("unknown claim id")`.
  - Claim with existing verdict other than `UNREADABLE` raises `gl.vm.UserError("claim already judged")`.
  - Claim with attempt counter $\ge 3$ raises `gl.vm.UserError("attempt limit reached")`.
- **Return Value**: JSON string representation of the resulting ruling record.
- **Receipt Behavior**: State must be read back via `get_ruling(claim_id)`.

---

## 3. Public View Methods

### `get_claim(claim_id: str) -> str`
Returns JSON-encoded claim record:
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

### `get_ruling(claim_id: str) -> str`
Returns JSON-encoded ruling record or empty string if not yet evaluated:
```json
{
  "attempts": 1,
  "claim_id": "1",
  "schema_version": "1",
  "verdict": "SUPPORTS"
}
```

### `list_recent(limit: int = 10) -> str`
Returns a JSON list of recent claim IDs (maximum 20, newest first):
```json
["9", "8", "7", "6", "5", "4", "3", "2", "1"]
```

### `list_by_author(author: str, limit: int = 10) -> str`
Returns a JSON list of claim IDs lodged by the given address.

### `latest_by_author(author: str) -> str`
Returns the most recent claim ID lodged by the given address, or empty string if none.

### `get_stats() -> str`
Returns platform aggregate statistics:
```json
{
  "total_claims": 9,
  "total_judgments": 10,
  "supports": 3,
  "contradicts": 2,
  "not_addressed": 2,
  "unreadable": 3
}
```
**Invariant**: `total_judgments == supports + contradicts + not_addressed + unreadable`.

---

## 4. Contract UserErrors & Frontend Mapping
All 15 client-side errors map directly to user-friendly guidance:
| Raw Contract UserError | Friendly UI Message |
|---|---|
| `claim must be string` | Claim must be valid text. |
| `claim length below minimum 20 characters` | The claim is too short. It must be at least 20 characters. |
| `claim length exceeds maximum 400 characters` | The claim exceeds the maximum permitted length of 400 characters. |
| `url must be string` | The source URL must be valid text. |
| `url length exceeds limit` | The source URL exceeds the maximum length limit of 300 characters. |
| `url contains whitespace` | The source URL cannot contain spaces or whitespace characters. |
| `url scheme must be https` | The source URL must use the secure https:// scheme. |
| `url hostname missing` | The source URL does not include a valid domain name. |
| `url contains userinfo` | The source URL cannot contain credentials (username or password). |
| `url port must be 443 or omitted` | The source URL port must be 443 or omitted. |
| `url hostname cannot be localhost` | Localhost source URLs are not permitted. |
| `url host cannot be private or reserved IP` | Private or local network IP addresses are not permitted. |
| `unknown claim id` | The requested claim ID does not exist on-chain. |
| `claim already judged` | This claim has already received a conclusive verdict and cannot be re-judged. |
| `attempt limit reached` | The maximum limit of 3 evaluation attempts has been reached for this claim. |
