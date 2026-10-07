import React from 'react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="protocol" className="cc-problem-section cc-reveal-section" aria-labelledby="problem-title">
      <div className="cc-landing-container">
        {/* Section Header */}
        <div className="cc-section-header">
          <span className="cc-section-label">THE VERIFICATION GAP</span>
          <h2 id="problem-title" className="cc-section-title">
            AI can generate an answer.<br />Can it prove it?
          </h2>
          <p className="cc-section-desc">
            Large language models frequently cite real URLs that sound authoritative but fail to substantiate the claimed fact. When machines assert claims without mechanical quote grounding, citations become decorative rather than evidentiary.
          </p>
        </div>

        {/* Structural Comparison Grid */}
        <div className="cc-comparison-frame">
          {/* Column 1: Traditional AI */}
          <div className="cc-comparison-col cc-col-traditional">
            <div className="cc-col-header">
              <span className="cc-col-tag">UNVERIFIED OUTPUT</span>
              <h3 className="cc-col-title">Traditional Generative AI</h3>
              <p className="cc-col-summary">
                A single model generates a response with plausible-sounding citations without deterministic verification.
              </p>
            </div>
            <ul className="cc-comparison-list">
              <li className="cc-list-item cc-item-negative">
                <span className="cc-item-bullet" aria-hidden="true">&times;</span>
                <div className="cc-item-content">
                  <strong>Generates an answer</strong>
                  <span>Synthesizes prose from statistical weights without source verification.</span>
                </div>
              </li>
              <li className="cc-list-item cc-item-negative">
                <span className="cc-item-bullet" aria-hidden="true">&times;</span>
                <div className="cc-item-content">
                  <strong>May provide citations</strong>
                  <span>References URLs that may 404, change, or say something fundamentally different.</span>
                </div>
              </li>
              <li className="cc-list-item cc-item-negative">
                <span className="cc-item-bullet" aria-hidden="true">&times;</span>
                <div className="cc-item-content">
                  <strong>May misinterpret evidence</strong>
                  <span>Hallucinates statistical figures, dates, or causal relationships.</span>
                </div>
              </li>
              <li className="cc-list-item cc-item-negative">
                <span className="cc-item-bullet" aria-hidden="true">&times;</span>
                <div className="cc-item-content">
                  <strong>No protocol-level consensus</strong>
                  <span>Trust rests entirely on a single private model and centralized server.</span>
                </div>
              </li>
              <li className="cc-list-item cc-item-negative">
                <span className="cc-item-bullet" aria-hidden="true">&times;</span>
                <div className="cc-item-content">
                  <strong>No on-chain ruling</strong>
                  <span>Output disappears into chat history with zero permanent provenance.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Dividing Column Indicator */}
          <div className="cc-comparison-divider" aria-hidden="true">
            <span className="cc-divider-line" />
            <span className="cc-divider-badge">VS</span>
            <span className="cc-divider-line" />
          </div>

          {/* Column 2: Citation Court */}
          <div className="cc-comparison-col cc-col-court">
            <div className="cc-col-header">
              <span className="cc-col-tag cc-tag-active">CONSENSUS VERIFICATION</span>
              <h3 className="cc-col-title">Citation Court Protocol</h3>
              <p className="cc-col-summary">
                A decentralized intelligent contract evaluates claims against public web sources using multi-validator consensus.
              </p>
            </div>
            <ul className="cc-comparison-list">
              <li className="cc-list-item cc-item-positive">
                <span className="cc-item-bullet" aria-hidden="true">&#x2713;</span>
                <div className="cc-item-content">
                  <strong>Single-fact claim</strong>
                  <span>Limits scope to a falsifiable assertion (20–400 characters) bound to verifiable evidence.</span>
                </div>
              </li>
              <li className="cc-list-item cc-item-positive">
                <span className="cc-item-bullet" aria-hidden="true">&#x2713;</span>
                <div className="cc-item-content">
                  <strong>Explicit cited source</strong>
                  <span>Direct HTTPS endpoint retrieved independently by multiple validator nodes.</span>
                </div>
              </li>
              <li className="cc-list-item cc-item-positive">
                <span className="cc-item-bullet" aria-hidden="true">&#x2713;</span>
                <div className="cc-item-content">
                  <strong>Independent validator evaluation</strong>
                  <span>Body text normalized and checked for verbatim quotes before semantic assessment.</span>
                </div>
              </li>
              <li className="cc-list-item cc-item-positive">
                <span className="cc-item-bullet" aria-hidden="true">&#x2713;</span>
                <div className="cc-item-content">
                  <strong>Consensus-based ruling</strong>
                  <span>Equivalence Principle requires majority agreement across distinct nodes.</span>
                </div>
              </li>
              <li className="cc-list-item cc-item-positive">
                <span className="cc-item-bullet" aria-hidden="true">&#x2713;</span>
                <div className="cc-item-content">
                  <strong>On-chain record</strong>
                  <span>Committed to immutable GenVM state, verifiable by any smart contract or browser.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
