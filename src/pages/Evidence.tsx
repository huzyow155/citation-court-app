import React, { useState } from 'react';
import evidenceData from '../data/evidence.json';
import { CopyIcon, CheckIcon, ExternalLinkIcon } from '../components/Icons';
import { MarkedClaim } from '../components/MarkedClaim';
import type { Verdict } from '../types';
import { CONFIG, getContractExplorerUrl, getAddressExplorerUrl } from '../config';

export const Evidence: React.FC = () => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    if (label === 'curl') {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    } else {
      setCopiedHash(label);
      setTimeout(() => setCopiedHash(null), 2000);
    }
  };

  const sampleCurl = `curl -s -X POST https://studio.genlayer.com/api \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"gen_callViewFunction","params":{"address":"${CONFIG.citationCourtAddress}","function_name":"get_ruling","args":["1"]}}'`;

  return (
    <div className="page-container page-evidence">
      <header className="page-header">
        <h1 className="page-heading">On-Chain Evidence & Reference Audits</h1>
        <p className="page-subheading">
          Permanent reference cases 1 through 8 deployed on GenLayer Studionet, verified by fresh on-chain read-backs against contract{' '}
          <code>{CONFIG.citationCourtAddress}</code>.
        </p>
      </header>

      {/* Contract & Deployment Reference */}
      <section className="evidence-section">
        <h2 className="section-title">Deployment Specification</h2>
        <div className="specs-table-wrapper">
          <table className="specs-table">
            <tbody>
              <tr>
                <th scope="row">CitationCourt Contract</th>
                <td>
                  <code className="monospace-value">{CONFIG.citationCourtAddress}</code>
                  <a
                    href={getContractExplorerUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-explorer-link"
                    title="View contract on explorer"
                  >
                    Explorer <ExternalLinkIcon />
                  </a>
                </td>
              </tr>
              <tr>
                <th scope="row">CitedBoard Consumer</th>
                <td>
                  <code className="monospace-value">{CONFIG.citedBoardAddress}</code>
                  <a
                    href={getAddressExplorerUrl(CONFIG.citedBoardAddress)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-explorer-link"
                    title="View consumer on explorer"
                  >
                    Explorer <ExternalLinkIcon />
                  </a>
                </td>
              </tr>
              <tr>
                <th scope="row">Source SHA-256</th>
                <td>
                  <code className="monospace-value">{CONFIG.sourceSha256}</code>
                </td>
              </tr>
              <tr>
                <th scope="row">Network & Chain ID</th>
                <td>{CONFIG.networkName} (Chain ID: {CONFIG.chainId})</td>
              </tr>
              <tr>
                <th scope="row">Contract Source Repository</th>
                <td>
                  <a
                    href={CONFIG.contractRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                  >
                    {CONFIG.contractRepoUrl} <ExternalLinkIcon />
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Measured Latency Benchmark */}
      <section className="evidence-section">
        <h2 className="section-title">Measured Consensus Latencies</h2>
        <p className="section-intro">
          Latency measured from transaction submission (<code>client.writeContract</code>) to receipt finalization (<code>client.waitForTransactionReceipt</code>) across multi-validator consensus runs on Studionet:
        </p>
        <div className="specs-table-wrapper">
          <table className="specs-table">
            <thead>
              <tr>
                <th>Execution Path</th>
                <th>Sample Count</th>
                <th>Mean Latency</th>
                <th>Observed Range</th>
                <th>Recommended UI Waiting Budget</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Full Consensus LLM Judgments</strong> (Runs A, B, C, D, E, H)</td>
                <td>6 runs</td>
                <td><strong>14.79 s</strong></td>
                <td>12.06 s – 15.52 s</td>
                <td>15 – 25 seconds</td>
              </tr>
              <tr>
                <td><strong>Fast UNREADABLE Path</strong> (Runs F1, F2, G)</td>
                <td>3 runs</td>
                <td><strong>10.12 s</strong></td>
                <td>8.85 s – 12.08 s</td>
                <td>10 – 15 seconds</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Receipt Success Rule */}
      <section className="evidence-section">
        <h2 className="section-title">Receipt Success Evaluation Rule</h2>
        <div className="callout-box">
          <p>
            On GenLayer Studionet, a transaction is validly accepted if and only if all three receipt properties hold:
          </p>
          <ol className="rule-list">
            <li>
              <code>receipt.status_name === "ACCEPTED" || receipt.status_name === "FINALIZED"</code>
            </li>
            <li>
              <code>receipt.result_name === "MAJORITY_AGREE"</code>
            </li>
            <li>
              <code>receipt.consensus_data.leader_receipt[0].execution_result === "SUCCESS"</code>
            </li>
          </ol>
          <p className="rule-note">
            Transactions do not return execution payloads in write receipts. Applications must perform a follow-up view call (<code>get_ruling</code>, <code>get_claim</code>) to read verified state back from the contract.
          </p>
        </div>
      </section>

      {/* Reference Cases Table */}
      <section className="evidence-section">
        <h2 className="section-title">Reference Case Runs (Claims 1 through 8)</h2>
        <p className="section-intro">
          All 8 baseline cases verified against on-chain contract state at <code>{evidenceData.verifiedAt}</code>:
        </p>

        <div className="reference-cases-list">
          {evidenceData.cases.map((c) => {
            const isUnreadable = c.verdict === 'UNREADABLE';
            return (
              <article key={c.claim_id} className="reference-case-card">
                <header className="case-card-header">
                  <div className="case-identity">
                    <span className="case-badge">Claim #{c.claim_id}</span>
                    <span className="case-slug">{c.case_name}</span>
                  </div>
                  <div className="case-verdict-group">
                    <span className={`verdict-pill verdict-${c.verdict.toLowerCase()}`}>
                      {c.verdict}
                    </span>
                    <span className="attempts-pill">Attempt {c.attempts} of 3</span>
                    <span className="latency-pill">{c.latency_sec}s</span>
                  </div>
                </header>

                <div className="case-claim-container">
                  <MarkedClaim claimText={c.claim_text} verdict={c.verdict as Verdict} />
                  {isUnreadable && (
                    <div className="unreadable-redaction-bar">couldn't read the page</div>
                  )}
                </div>

                <p className="case-description">{c.description}</p>

                <div className="case-hashes-grid">
                  <div className="hash-item">
                    <span className="hash-item-label">Source URL:</span>
                    <a
                      href={c.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link-clamp"
                    >
                      {c.source_url} <ExternalLinkIcon />
                    </a>
                  </div>
                  <div className="hash-item">
                    <span className="hash-item-label">Lodge Tx:</span>
                    <code className="hash-code">{c.lodge_tx}</code>
                    <button
                      type="button"
                      className="btn-copy-inline"
                      onClick={() => copyToClipboard(c.lodge_tx, `lodge-${c.claim_id}`)}
                      title="Copy transaction hash"
                    >
                      {copiedHash === `lodge-${c.claim_id}` ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <div className="hash-item">
                    <span className="hash-item-label">Judge Tx:</span>
                    <code className="hash-code">{c.judge_tx}</code>
                    <button
                      type="button"
                      className="btn-copy-inline"
                      onClick={() => copyToClipboard(c.judge_tx, `judge-${c.claim_id}`)}
                      title="Copy transaction hash"
                    >
                      {copiedHash === `judge-${c.claim_id}` ? <CheckIcon /> : <CopyIcon />}
                    </button>
                    <a
                      href={getContractExplorerUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="explorer-link-inline"
                      title="View contract on explorer"
                    >
                      Explorer <ExternalLinkIcon />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Independent RPC Check */}
      <section className="evidence-section">
        <h2 className="section-title">Verify Independent Rulings Over RPC</h2>
        <p className="section-intro">
          Anyone can query contract state directly via the GenLayer JSON-RPC endpoint without connecting a wallet:
        </p>
        <div className="code-block-wrapper">
          <pre className="code-pre">
            <code>{sampleCurl}</code>
          </pre>
          <button
            type="button"
            className="btn-copy-block"
            onClick={() => copyToClipboard(sampleCurl, 'curl')}
          >
            {copiedCurl ? (
              <>
                <CheckIcon /> Copied
              </>
            ) : (
              <>
                <CopyIcon /> Copy cURL
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};
