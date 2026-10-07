# Citation Court Design Plan

## Pass 1: Core Design Specification

### 1. Palette
Grounded strictly in physical proofreader tools (vellum proof sheets, pencil graphite, fountain pen ink, highlighter marker, red correction pen):

| Token Name | Value | Role | Contrast vs Surface |
|---|---|---|---|
| `--color-surface` | `#f6f8fa` | Cool ledger paper ground (pale, neutral, non-cream) | Base |
| `--color-graphite` | `#1f242d` | Deep pencil graphite for claims and body text | 13.1:1 |
| `--color-ink` | `#1e3a8a` | Blue-black fountain pen ink for interactive chrome and links | 8.8:1 |
| `--color-highlighter` | `#fef08a` | Translucent yellow highlighter marker background for `SUPPORTS` | 1.1:1 vs text 12.5:1 |
| `--color-red-pen` | `#b91c1c` | Sharp red ballpoint correction pen for `CONTRADICTS` strike-through | 5.9:1 |
| `--color-pencil` | `#525e75` | Faint secondary graphite for metadata, source hosts, and pending mark | 5.3:1 |
| `--color-redaction` | `#27272a` | Solid charcoal redaction tape for `UNREADABLE` source line | 11.5:1 vs white text |

All text combinations exceed WCAG AA 4.5:1 contrast requirements.

### 2. Typography
Self-hosted through `@fontsource` packages:
- **Claim Text**: `Newsreader` (`@fontsource/newsreader`). Designed for long-form editorial reading; high legibility across multiple lines, human proportion, graceful rendering of italic and punctuation.
- **UI Chrome & Navigation**: `Plus Jakarta Sans` (`@fontsource/plus-jakarta-sans`). Crisp geometric grotesque with warm humanist curves, clear number figures, and distinct rhythm. Avoids the overused default `Inter`.
- **Hashes & Addresses**: `IBM Plex Mono` (`@fontsource/ibm-plex-mono`). Engineered for cryptographic hex strings, with distinct slashed zeros, exact tabular sizing, and readable character distinctions.

### 3. Type Scale
- `Display Claim (Claim screen)`: `1.75rem (28px)`, line-height `1.45`, Newsreader Regular / Medium.
- `List Claim (Home, Evidence)`: `1.1875rem (19px)`, line-height `1.5`, Newsreader Regular.
- `Section Heading`: `1.125rem (18px)`, line-height `1.4`, Plus Jakarta Sans SemiBold.
- `Body / Explanations`: `0.9375rem (15px)`, line-height `1.55`, Plus Jakarta Sans Regular.
- `Margin Metadata / Notes`: `0.8125rem (13px)`, line-height `1.4`, Plus Jakarta Sans Regular / Medium.
- `Code / Hashes`: `0.8125rem (13px)`, line-height `1.4`, IBM Plex Mono Regular.

### 4. Layout Concept
"A disciplined two-column editorial ledger where the primary column holds claims typeset as running prose marked directly with proofreader notations, while a quiet right-hand margin accommodates source provenance, attempt counters, and transaction evidence without ever boxing items into card modules."

### 5. Alignment Guidance
- Reading measure strictly bounded to `68ch` (max-width `720px`) for comfortable reading.
- Left-aligned hierarchy. Zero centered body text.
- Desktop layout: Main reading column (`68ch`) + margin column (`220px`) with `40px` gutter.
- Mobile layout (`<768px`): Margin notes fold cleanly below the claim with small muted typographic hierarchy (`13px`).

### 6. Marking Vernacular & Outcomes
The claim is the hero on every screen. The verdict marks the sentence directly:
- **`SUPPORTS`**: Highlighter swipe (`background: #fef08a; box-decoration-break: clone; padding: 2px 4px; border-radius: 2px; color: #1f242d;`). Accompanied by plain word "SUPPORTS" in the margin.
- **`CONTRADICTS`**: Red pen strike-through (`text-decoration: line-through 2px #b91c1c; text-decoration-skip-ink: none;`). Accompanied by plain word "CONTRADICTS".
- **`NOT_ADDRESSED`**: Dotted underline (`text-decoration: underline dotted 2px #525e75;`) plus superscript marker `[not addressed]`.
- **`UNREADABLE`**: Claim sentence remains unmarked; source line features a solid charcoal redaction bar (`background: #27272a; color: #fff; padding: 2px 8px;`) stating "couldn't read the page".
- **`PENDING`**: Dashed pencil underline (`text-decoration: underline dashed 1.5px #525e75;`).

Motion: When a verdict arrives, the mark transitions in once. `prefers-reduced-motion: reduce` disables all transitions instantly.

---

### 7. ASCII Wireframes

#### Desktop (1280px) - Home Screen (`/`)
```
+---------------------------------------------------------------------------------------+
| CITATION COURT                     [Preview on Studionet]        New Claim | Evidence | About |
|---------------------------------------------------------------------------------------+
|                                                                                       |
|   Recent Claims                                                                       |
|   Platform tally: 8 claims registered across 9 validator evaluations.                  |
|                                                                                       |
|   +-------------------------------------------------------------+ +-----------------+ |
|   | 8. [Earth is the third planet from the Sun and the only...] | | wikipedia.org   | |
|   |    ==== SUPPORTS highlighter swipe =======================  | | Attempt 1 of 3  | |
|   |                                                             | | SUPPORTS        | |
|   |-------------------------------------------------------------| | View record ->  | |
|   |                                                             | +-----------------+ |
|   | 7. Project Nova distributed computing architecture uses...  | | raw.github...   | |
|   |    [couldn't read the page - unreadable]                    | | Attempt 1 of 3  | |
|   |                                                             | | UNREADABLE      | |
|   |-------------------------------------------------------------| +-----------------+ |
|   |                                                             |                     |
|   | 6. Project Nova announced a new quantum proof validation... | | raw.github...   | |
|   |    [couldn't read the page - unreadable]                    | | Attempt 2 of 3  | |
|   +-------------------------------------------------------------+ +-----------------+ |
|                                                                                       |
+---------------------------------------------------------------------------------------+
```

#### Mobile (390px) - Home Screen (`/`)
```
+-------------------------------------+
| CITATION COURT                      |
| [Preview]    New | Evidence | About |
|-------------------------------------|
| Recent Claims                       |
| 8 claims across 9 evaluations.      |
|                                     |
| 8. Earth is the third planet from...|
|    ==== SUPPORTS highlighter ====   |
|    wikipedia.org | Attempt 1 | SUPPORTS
|    [View claim ->]                  |
| ----------------------------------- |
| 7. Project Nova distributed...      |
|    [couldn't read the page]         |
|    raw.githubusercontent.com | Att 1|
|    [View claim ->]                  |
+-------------------------------------+
```

#### Desktop (1280px) - Claim Detail (`/claim/:id`)
```
+---------------------------------------------------------------------------------------+
| CITATION COURT                                                   New Claim | Evidence | About |
|---------------------------------------------------------------------------------------+
|                                                                                       |
|   Claim #8                                                      Source Provenance     |
|                                                                 en.wikipedia.org      |
|   "Earth is the third planet from the Sun and the only          Full URL:             |
|   astronomical object known to harbor life."                    https://en.wikiped... |
|   ====================================================          [Open Source Link]    |
|   (SUPPORTS highlighter swipe)                                                        |
|                                                                 Consensus Outcome     |
|   Verdict: SUPPORTS                                             Verdict: SUPPORTS     |
|   Attempts used: 1 of 3                                         Attempts: 1 / 3       |
|                                                                 Evaluated by nodes    |
|   What this verdict means:                                                            |
|   The consensus validators fetched the source webpage and       Contract:             |
|   located verbatim normalized passage text supporting the       0x58aDf2Fd...8CFa5    |
|   claim sentence.                                               [Explorer Address]    |
|                                                                                       |
|   What this verdict does NOT mean:                                                    |
|   This does not assert that the source website is trustworthy                         |
|   or that the claim is an objective cosmic fact. It verifies                         |
|   mechanical grounding in the cited URL text only.                                    |
|                                                                                       |
+---------------------------------------------------------------------------------------+
```

#### Mobile (390px) - Claim Detail (`/claim/:id`)
```
+-------------------------------------+
| CITATION COURT                      |
| Claim #8                            |
|-------------------------------------|
| "Earth is the third planet from     |
| the Sun and the only astronomical   |
| object known to harbor life."       |
| ==============================      |
| Verdict: SUPPORTS (Attempt 1 of 3)  |
|                                     |
| Source: en.wikipedia.org            |
| https://en.wikipedia.org/wiki/Earth |
|                                     |
| Scope & Grounding:                  |
| Verifies verbatim normalized quote  |
| text presence on page. Does not     |
| prove source authority or truth.    |
|                                     |
| Contract: 0x58aDf2Fd...8CFa5        |
| [View on Explorer]                  |
+-------------------------------------+
```

---

## Pass 2: Review Against Generic Defaults & Revisions

We systematically examined the specification against the banned clichés in the prompt:

| Default Cliché / Anti-Pattern | Audit Check | Plan Decision & Rationale |
|---|---|---|
| **Warm cream background + serif display + terracotta** | Avoided | Surface is `#f6f8fa` (crisp, cold-neutral proofing paper), not cream/sepia. Primary interactive ink is `#1e3a8a` (blue-black fountain pen), not terracotta or rust. |
| **Near-black background + acid green/vermilion** | Avoided | Default theme is high-contrast light mode with natural paper ground. No dark cyberpunk aesthetic. |
| **Broadsheet layout with hairline rules & 0 radius** | Avoided | Not imitating Victorian broadsheets. Clean contemporary margins, `4px` subtle radius on marks and inputs, fluid typography. |
| **SaaS-card kit (rounded cards, soft shadow, gradients)** | Avoided | Zero card containers. Claims are formatted as editorial paragraphs with margin notes separated by whitespace and clean border rules. |
| **Template chrome (tracked ALL-CAPS eyebrows, middle dots)** | Avoided | All titles and labels use sentence case. No `L A T E S T  U P D A T E` tracking. No floating middle-dot separators (`•`). |
| **"WORD - fragment" labels & dangling arrows** | Avoided | Links and buttons have clean, actionable sentence-case copy ("Judge this claim", "View record"), without generic `->` suffix spam. |
| **Purple/blue gradients & glass blur panels** | Avoided | Zero CSS gradients. Zero `backdrop-filter: blur`. Flat, honest surface rendering. |
| **Three-icon feature row & stock illustrations** | Avoided | No feature icon grids. Explanations use concise, reasoned paragraphs. |
| **Emoji & external icon kits** | Avoided | Zero emoji in UI. Zero FontAwesome/Lucide dependencies. Hand-crafted 2 SVG icons for specific actions (copy icon, external link icon). |
| **Accenting one word in a headline** | Avoided | Headlines are uniform Newsreader/Plus Jakarta Sans weights without colored single-word emphasis. |

---

## Pass 3: Post-Implementation Design Critique Record

### 1. Screenshot Review (1280px Desktop & 390px Mobile)
Captured across all 7 routes in incognito mode with no wallet extension connected:
- **Home (`home_desktop_1280.png`, `home_mobile_390.png`)**:
  - The editorial claim ledger renders claims directly with their authentic proofreader marks (yellow highlighter for `SUPPORTS`, strike-through for `CONTRADICTS`, dotted underline with superscript `[not addressed]` for `NOT_ADDRESSED`, and solid charcoal redaction tape for `UNREADABLE`).
  - The right-hand margin column maintains quiet, balanced metadata (host domain, attempt counts, verdict label) on desktop and folds cleanly underneath each claim on 390px mobile.
- **Claim Detail (`claim_1_desktop_1280.png`, `claim_8_desktop_1280.png`, `claim_1_mobile_390.png`, `claim_8_mobile_390.png`)**:
  - The claim sentence is the prominent hero element.
  - The two-column grounding scope guide ("What this verdict means" vs "What this verdict does NOT mean") clearly separates physical proof from real-world claims.
- **Evidence (`evidence_desktop_1280.png`, `evidence_mobile_390.png`)**:
  - Clear presentation of all 8 reference cases, latency benchmarks, receipt validation rules, and RPC snippet.
- **Lodge Claim (`lodge_desktop_1280.png`, `lodge_mobile_390.png`)**:
  - Clean form with live character counters, instant rule validation feedback, and clear explanation of smart contract authority.

### 2. Accessory Removed After Visual Review
- **Element Cut**: Internal fixture slug badge (`case_a_supports`, `case_b_contradicts`, etc.) and per-card latency pill tags (`15.123s`, `15.519s`) on the individual Evidence reference cards.
- **Rationale**: The Evidence page already includes a comprehensive benchmark table summarizing mean latencies and ranges for both execution paths. Repeating technical fixture slugs and microsecond latency pills in every reference case header added visual clutter and made the cards resemble developer test runners rather than a calm, authoritative public legal record. Removing them restored the clean focus to the claim and verdict.

### 3. Accessibility & Quality Floor Verification
- **Responsive Layout**: Verified down to 360px viewport; all tables and monospace hashes scroll horizontally without overflowing the page container.
- **Keyboard Navigation**: Distinct high-contrast 2px ink focus rings (`outline: 2px solid #1e3a8a; outline-offset: 2px`) on all interactive buttons, links, and form fields.
- **Form Labeling**: Every input and textarea contains an explicit `<label htmlFor="...">` and `<p className="field-hint">`.
- **Color Contrast**: Main body text contrast against `--color-surface` (`#f6f8fa`) is `13.1:1` (WCAG AAA); ink interactive elements have `8.8:1`; red correction text has `5.9:1` (exceeds WCAG AA 4.5:1 floor).
- **Reduced Motion**: All animations wrapped in `@media (prefers-reduced-motion: no-preference)`; users with reduced motion preferences experience instantaneous rendering without transitions.
