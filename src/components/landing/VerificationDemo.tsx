import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DEMO_STATES = [
  { id: 1, label: 'CLAIM RECEIVED', desc: 'Contract validates statement length (105 chars) and URL scheme.' },
  { id: 2, label: 'SOURCE CHECKED', desc: 'Validators independently retrieve https://en.wikipedia.org/wiki/Earth.' },
  { id: 3, label: 'VALIDATORS ACTIVE', desc: 'Multi-node body text normalization and verbatim quote substring search.' },
  { id: 4, label: 'CONSENSUS REACHED', desc: 'Equivalence Principle convergence: majority agreement formed.' },
  { id: 5, label: 'VERDICT: SUPPORTS', desc: 'Normalized passage verified in source body text.' },
  { id: 6, label: 'RECORDED ON-CHAIN', desc: 'Ruling and attempt counts committed to GenVM contract state.' },
];

export const VerificationDemo: React.FC = () => {
  const [currentState, setCurrentState] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentState((prev) => (prev + 1) % DEMO_STATES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPaused]);

  const active = DEMO_STATES[currentState];

  return (
    <section id="verification-demo" className="cc-demo-section cc-reveal-section" aria-labelledby="demo-title">
      <div className="cc-landing-container">
        {/* Section Header */}
        <div className="cc-section-header">
          <span className="cc-section-label">INTERACTIVE PROOF OF CONCEPT</span>
          <h2 id="demo-title" className="cc-section-title">
            What an on-chain evaluation looks like.
          </h2>
          <p className="cc-section-desc">
            An authentic representation of Claim #8 executed on GenLayer Studionet, demonstrating state progression through each consensus phase.
          </p>
        </div>

        {/* The Verification Artifact Object */}
        <div className="cc-demo-artifact-card">
          {/* Card Header Chrome */}
          <div className="cc-demo-card-header">
            <div className="cc-demo-badge-group">
              <span className="cc-demo-label-pill">DEMONSTRATION RECORD</span>
              <span className="cc-demo-case-id">CASE #8 &bull; WIKIPEDIA EARTH</span>
            </div>

            <div className="cc-demo-stepper-controls">
              <span className="cc-stepper-counter">
                Phase {currentState + 1} of {DEMO_STATES.length}
              </span>
              <button
                type="button"
                className="cc-demo-pause-btn"
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? 'Resume demonstration' : 'Pause demonstration'}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>

          {/* Card Content Grid */}
          <div className="cc-demo-grid">
            {/* Row 1: The Claim */}
            <div className="cc-demo-row">
              <span className="cc-demo-row-label">CLAIM STATEMENT</span>
              <div className="cc-demo-claim-wrapper">
                <blockquote className="cc-demo-claim-quote">
                  <span className={`cc-claim-text-mark ${currentState >= 4 ? 'is-highlighted' : ''}`}>
                    The Earth is the third planet from the Sun.
                  </span>
                </blockquote>
              </div>
            </div>

            {/* Row 2: The Source */}
            <div className="cc-demo-row cc-demo-row-split">
              <div>
                <span className="cc-demo-row-label">CITED SOURCE URL</span>
                <div className="cc-demo-source-box">
                  <span className="cc-source-lock" aria-hidden="true">&#x1F512;</span>
                  <code className="cc-demo-source-url">https://en.wikipedia.org/wiki/Earth</code>
                  <span className={`cc-source-status ${currentState >= 1 ? 'is-checked' : ''}`}>
                    {currentState >= 1 ? 'HTTP 200 OK' : 'PENDING FETCH'}
                  </span>
                </div>
              </div>

              <div>
                <span className="cc-demo-row-label">CONSENSUS NODES</span>
                <div className="cc-demo-nodes-track">
                  {[1, 2, 3, 4, 5, 6].map((node) => (
                    <div
                      key={node}
                      className={`cc-validator-node-dot ${currentState >= 2 ? 'is-active' : ''}`}
                      title={`Validator Node ${node}`}
                    >
                      <span className="cc-node-inner" />
                    </div>
                  ))}
                  <span className="cc-node-ratio">
                    {currentState >= 3 ? '6 / 6 AGREED' : currentState >= 2 ? 'EVALUATING...' : 'STANDBY'}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 3: Protocol Progress Tracker */}
            <div className="cc-demo-row">
              <span className="cc-demo-row-label">PROTOCOL STATE RESOLUTION</span>
              <div className="cc-demo-state-banner">
                <div className="cc-state-banner-left">
                  <span className="cc-state-pulse-indicator" />
                  <span className="cc-state-name">{active.label}</span>
                </div>
                <span className="cc-state-desc">{active.desc}</span>
              </div>
            </div>

            {/* Row 4: Final Outcome & Verification Link */}
            <div className="cc-demo-row cc-demo-row-footer">
              <div className="cc-verdict-summary-group">
                <span className="cc-demo-row-label">FINAL VERDICT COMMITTED</span>
                <div className="cc-verdict-pill-large">
                  <span className="cc-verdict-icon">&#x2713;</span>
                  <span className="cc-verdict-text">{currentState >= 4 ? 'SUPPORTS' : 'CALCULATING...'}</span>
                </div>
              </div>

              <div className="cc-demo-view-app-cta">
                <Link to="/app/claim/8" className="cc-link-inspect-record">
                  Inspect Real On-Chain Claim #8
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                    <path d="M3 8H13M13 8L9 4M13 8L9 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
