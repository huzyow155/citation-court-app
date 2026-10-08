import React from 'react';
import { CONFIG, getContractExplorerUrl, getAddressExplorerUrl } from '../../config';

export const OnChainSection: React.FC = () => {
  return (
    <section className="cc-onchain-section cc-reveal-section" aria-labelledby="onchain-title">
      <div className="cc-landing-container">
        {/* Section Header */}
        <div className="cc-section-header">
          <span className="cc-section-label">ON-CHAIN PROVENANCE</span>
          <h2 id="onchain-title" className="cc-section-title">
            From evidence to an on-chain record.
          </h2>
          <p className="cc-section-desc">
            Citation Court is not a centralized SaaS or private LLM service. It executes directly under GenLayer Studionet consensus, storing verifiable rulings in smart contract state.
          </p>
        </div>

        {/* Verifiable Pipeline Diagram */}
        <div className="cc-chain-pipeline-bar" role="region" aria-label="Verifiable Pipeline Sequence">
          <div className="cc-pipeline-node">
            <span className="cc-node-step">01</span>
            <span className="cc-node-name">CLAIM</span>
          </div>
          <div className="cc-pipeline-arrow">&rarr;</div>
          <div className="cc-pipeline-node">
            <span className="cc-node-step">02</span>
            <span className="cc-node-name">EVIDENCE</span>
          </div>
          <div className="cc-pipeline-arrow">&rarr;</div>
          <div className="cc-pipeline-node">
            <span className="cc-node-step">03</span>
            <span className="cc-node-name">EVALUATION</span>
          </div>
          <div className="cc-pipeline-arrow">&rarr;</div>
          <div className="cc-pipeline-node">
            <span className="cc-node-step">04</span>
            <span className="cc-node-name">CONSENSUS</span>
          </div>
          <div className="cc-pipeline-arrow">&rarr;</div>
          <div className="cc-pipeline-node is-terminal">
            <span className="cc-node-step">05</span>
            <span className="cc-node-name">ON-CHAIN RECORD</span>
          </div>
        </div>

        {/* Technical Contract Telemetry Box */}
        <div className="cc-telemetry-box">
          <div className="cc-telemetry-header">
            <span className="cc-telemetry-dot" />
            <span className="cc-telemetry-title">DEPLOYED PROTOCOL CONTRACTS</span>
            <span className="cc-telemetry-net">GENLAYER STUDIONET &bull; 61999</span>
          </div>

          <div className="cc-telemetry-grid">
            {/* Item 1: Main Court */}
            <div className="cc-telemetry-item">
              <span className="cc-telemetry-label">MAIN COURT CONTRACT</span>
              <div className="cc-telemetry-value-row">
                <code className="cc-telemetry-hash">{CONFIG.citationCourtAddress}</code>
                <a
                  href={getContractExplorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cc-telemetry-link"
                >
                  Explorer &rarr;
                </a>
              </div>
              <span className="cc-telemetry-sub">Python Intelligent Contract on GenVM</span>
            </div>

            {/* Item 2: Consumer CitedBoard */}
            <div className="cc-telemetry-item">
              <span className="cc-telemetry-label">CONSUMER BOARD CONTRACT</span>
              <div className="cc-telemetry-value-row">
                <code className="cc-telemetry-hash">{CONFIG.citedBoardAddress}</code>
                <a
                  href={getAddressExplorerUrl(CONFIG.citedBoardAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cc-telemetry-link"
                >
                  Explorer &rarr;
                </a>
              </div>
              <span className="cc-telemetry-sub">Synchronous cross-contract view consumer</span>
            </div>

            {/* Item 3: Source Verification SHA */}
            <div className="cc-telemetry-item cc-item-wide">
              <span className="cc-telemetry-label">CONTRACT SOURCE HASH (SHA-256)</span>
              <div className="cc-telemetry-value-row">
                <code className="cc-telemetry-hash">{CONFIG.sourceSha256}</code>
                <a
                  href={CONFIG.contractRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cc-telemetry-link"
                >
                  GitHub Source &rarr;
                </a>
              </div>
              <span className="cc-telemetry-sub">Verified byte-for-byte against deploy transaction payload</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
