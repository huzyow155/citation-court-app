import React from 'react';
import { ExternalLinkIcon } from '../components/Icons';
import { CONFIG } from '../config';

export const About: React.FC = () => {
  return (
    <div className="page-container page-about">
      <header className="page-header">
        <h1 className="page-heading">About Citation Court</h1>
        <p className="page-subheading">
          Decentralized consensus verification for single-fact claim citations on GenLayer.
        </p>
      </header>

      {/* How it works */}
      <section className="about-section">
        <h2 className="section-title">How It Works</h2>
        <p>
          Language models frequently invent convincing bibliographic citations or misattribute facts to authentic URLs. Citation Court provides an on-chain, multi-validator arbiter that verifies whether a single-fact claim is supported by the webpage text behind a URL:
        </p>
        <ol className="explanation-steps">
          <li>
            <strong>Lodging</strong>: A claimant submits an assertion (20 to 400 characters) and a supporting HTTPS source URL. The contract assigns a sequential claim ID.
          </li>
          <li>
            <strong>Consensus Web Retrieval</strong>: Independent GenLayer validator nodes independently fetch the source webpage and extract text content.
          </li>
          <li>
            <strong>Equivalence Evaluation</strong>: Each validator assesses whether the extracted text supports, contradicts, or does not address the claim.
          </li>
          <li>
            <strong>Verbatim Normalization Defense</strong>: To defend against hallucination or prompt injection in page contents, an evaluation of <code>SUPPORTS</code> or <code>CONTRADICTS</code> is accepted when the validator extracts a verbatim passage quote that appears in the page text after lowercase, whitespace, and punctuation normalization. If the quote cannot be matched mechanically, the evaluation is downgraded to <code>NOT_ADDRESSED</code>.
          </li>
          <li>
            <strong>Consensus Recording</strong>: If a majority of validators agree, the resulting verdict (<code>SUPPORTS</code>, <code>CONTRADICTS</code>, <code>NOT_ADDRESSED</code>, or <code>UNREADABLE</code>) is permanently recorded in smart contract storage.
          </li>
        </ol>
      </section>

      {/* Explicit Non-Goals */}
      <section className="about-section">
        <h2 className="section-title">Explicit Non-Goals</h2>
        <div className="callout-box">
          <ul className="bullet-list">
            <li>
              <strong>No Truth or Authority Verification</strong>: Citation Court does NOT evaluate whether a claim is an objective fact in reality, nor does it evaluate whether the cited website is credible, authoritative, or trustworthy. It verifies whether the page text contains verbatim textual evidence backing the claim.
            </li>
            <li>
              <strong>No Validator Quote or Reasoning Storage</strong>: The deployed smart contract stores the verdict string and the attempt count. It does not store the validator's extracted quote or reasoning chain.
            </li>
            <li>
              <strong>No Custody or Private Keys</strong>: The application holds no user funds, requires no backend accounts, and stores zero private keys. Browser writes are signed directly by your Web3 wallet.
            </li>
            <li>
              <strong>No Off-Chain Database</strong>: All claims, tallies, and verdicts reside entirely on-chain on GenLayer Studionet.
            </li>
          </ul>
        </div>
      </section>

      {/* Known Limitations */}
      <section className="about-section">
        <h2 className="section-title">Known Limitations</h2>
        <div className="limitations-grid">
          <div className="limitation-item">
            <h3 className="limitation-title">JavaScript-Rendered Pages</h3>
            <p>
              Validators perform HTTP retrieval without a headless browser execution environment. Single-page applications (SPAs) or paywalled sites return <code>UNREADABLE</code>.
            </p>
          </div>
          <div className="limitation-item">
            <h3 className="limitation-title">Dynamic Web Content</h3>
            <p>
              If a news article or document changes or rotates between independent validator fetches, validators may see differing content, resulting in <code>UNDETERMINED</code> consensus disagreement.
            </p>
          </div>
          <div className="limitation-item">
            <h3 className="limitation-title">Studionet Preview Environment</h3>
            <p>
              Citation Court operates on GenLayer Studionet (Chain ID 61999). Studionet is preview infrastructure that can be reset by network operators, which resets state and contract deployments.
            </p>
          </div>
        </div>
      </section>

      {/* Contract Reference */}
      <section className="about-section">
        <h2 className="section-title">Smart Contract Specification</h2>
        <p>
          The smart contract was audited and deployed at address:
        </p>
        <p className="monospace-block">
          <code>{CONFIG.citationCourtAddress}</code>
        </p>
        <p>
          Source code is available under the MIT license at{' '}
          <a
            href={CONFIG.contractRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link"
          >
            huzyow155/citation-court-genlayer <ExternalLinkIcon />
          </a>.
        </p>
      </section>
    </div>
  );
};
