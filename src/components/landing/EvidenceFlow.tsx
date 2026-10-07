import React, { useState, useEffect } from 'react';

export const EvidenceFlow: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  // Cycling sequence: 0: Signals streaming, 1: Validator Convergence, 2: Consensus resolved, 3: Verdict Recorded
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cc-evidence-flow-container" aria-label="Evidence Flow Protocol Visualization">
      {/* Top Header Annotations */}
      <div className="cc-flow-top-meta">
        <div className="cc-meta-item">
          <span className="cc-meta-dot cc-dot-blue" />
          <span className="cc-meta-label">SOURCE SIGNALS</span>
        </div>
        <div className="cc-meta-item">
          <span className="cc-meta-dot cc-dot-mint" />
          <span className="cc-meta-label">VALIDATOR NEXUS</span>
        </div>
        <div className="cc-meta-item">
          <span className="cc-meta-dot cc-dot-violet" />
          <span className="cc-meta-label">ON-CHAIN RULING</span>
        </div>
      </div>

      {/* SVG Flow Canvas */}
      <div className="cc-flow-canvas-wrapper">
        <svg
          viewBox="0 0 620 380"
          className="cc-flow-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Subtle Gradients for paths */}
            <linearGradient id="grad-blue-silver" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D8DADC" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#4F8EF7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D8DADC" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-mint-silver" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D8DADC" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#59CDB0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D8DADC" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="grad-verdict" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#111111" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#59CDB0" stopOpacity="0.9" />
            </linearGradient>

            {/* Filter for subtle nexus glow */}
            <filter id="nexus-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Guide Lines (Silver, extremely faint) */}
          <g className="cc-flow-grid" stroke="#ECEDEF" strokeWidth="0.75" strokeDasharray="3 3">
            <line x1="160" y1="20" x2="160" y2="360" />
            <line x1="330" y1="20" x2="330" y2="360" />
            <line x1="490" y1="20" x2="490" y2="360" />
            <line x1="20" y1="190" x2="600" y2="190" />
          </g>

          {/* --- LAYER 1: PASSIVE BACKGROUND PATHS (Fading / discarded signals) --- */}
          <g className="cc-flow-passive-paths" stroke="#E4E6E8" strokeWidth="1" strokeLinecap="round">
            {/* Discarded DOM scripts & noise */}
            <path d="M 24 50 C 100 50 140 100 190 115" strokeDasharray="2 4" opacity="0.6" />
            <path d="M 24 95 C 110 95 150 140 210 150" opacity="0.7" />
            <path d="M 24 285 C 110 285 160 250 220 238" opacity="0.7" />
            <path d="M 24 330 C 90 330 140 290 190 270" strokeDasharray="2 4" opacity="0.6" />
          </g>

          {/* --- LAYER 2: PRIMARY CONVERGING EVIDENCE PATHS --- */}
          <g className="cc-flow-converging-paths" strokeWidth="1.25" strokeLinecap="round">
            {/* Path 1: Source Webpage Retrieval */}
            <path
              id="path-source-dom"
              d="M 24 70 C 130 70 220 170 330 190"
              stroke="#D8DADC"
              className="cc-path-animated cc-path-source"
            />

            {/* Path 2: Text Normalization Body */}
            <path
              id="path-norm-text"
              d="M 24 110 C 145 110 230 180 330 190"
              stroke="url(#grad-blue-silver)"
              className="cc-path-animated cc-path-blue"
            />

            {/* Path 3: Verbatim Passage Check */}
            <path
              id="path-passage"
              d="M 24 150 C 160 150 240 185 330 190"
              stroke="#D8DADC"
              className="cc-path-animated"
            />

            {/* Path 4: Single-Fact Claim Core (Centerline) */}
            <path
              id="path-claim-core"
              d="M 24 190 C 150 190 250 190 330 190"
              stroke="#111111"
              strokeWidth="1.5"
              className="cc-path-core"
            />

            {/* Path 5: Validator Node 1 LLM Evaluation */}
            <path
              id="path-val-1"
              d="M 24 230 C 160 230 240 195 330 190"
              stroke="url(#grad-mint-silver)"
              className="cc-path-animated cc-path-mint"
            />

            {/* Path 6: Validator Node 2 LLM Evaluation */}
            <path
              id="path-val-2"
              d="M 24 270 C 145 270 230 200 330 190"
              stroke="#D8DADC"
              className="cc-path-animated"
            />

            {/* Path 7: Validator Node 3 LLM Evaluation */}
            <path
              id="path-val-3"
              d="M 24 310 C 130 310 220 210 330 190"
              stroke="url(#grad-blue-silver)"
              className="cc-path-animated cc-path-blue"
            />
          </g>

          {/* --- LAYER 3: CONVERGENCE NEXUS (VALIDATORS & STRICT_EQ) --- */}
          <g className="cc-flow-nexus" transform="translate(330, 190)">
            {/* Outer subtle radar ring */}
            <circle
              cx="0"
              cy="0"
              r="34"
              stroke="#E4E6E8"
              strokeWidth="0.75"
              strokeDasharray="4 4"
              className="cc-pulse-outer"
            />
            {/* Middle evaluation ring */}
            <circle
              cx="0"
              cy="0"
              r="20"
              stroke="#D8DADC"
              strokeWidth="1"
              className={`cc-pulse-middle ${activeStage >= 1 ? 'is-active' : ''}`}
            />
            {/* Mint consensus confirmation ring */}
            <circle
              cx="0"
              cy="0"
              r="10"
              stroke="#59CDB0"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className={`cc-pulse-mint ${activeStage >= 2 ? 'is-intensified' : ''}`}
            />
            {/* Center solid nexus dot */}
            <circle
              cx="0"
              cy="0"
              r="4"
              fill="#111111"
              className="cc-nexus-core"
            />
          </g>

          {/* --- LAYER 4: RESOLVED VERDICT PIPELINE (From Nexus to On-Chain Commit) --- */}
          <g className="cc-flow-outcome-paths">
            {/* Single verified consensus outcome path */}
            <path
              d="M 330 190 L 500 190"
              stroke="url(#grad-verdict)"
              strokeWidth="2"
              strokeLinecap="round"
              className={`cc-path-resolved ${activeStage >= 2 ? 'is-streaming' : ''}`}
            />

            {/* Auxiliary verification commit rays */}
            <path
              d="M 330 190 C 380 190 440 160 500 160"
              stroke="#D8DADC"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity={activeStage >= 2 ? '0.7' : '0.2'}
            />
            <path
              d="M 330 190 C 380 190 440 220 500 220"
              stroke="#D8DADC"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity={activeStage >= 2 ? '0.7' : '0.2'}
            />
          </g>

          {/* --- LAYER 5: VERDICT DESTINATION OBJECT --- */}
          <g className="cc-flow-verdict-node" transform="translate(500, 190)">
            <rect
              x="-6"
              y="-18"
              width="90"
              height="36"
              rx="6"
              fill="#FFFFFF"
              stroke={activeStage >= 2 ? '#59CDB0' : '#D8DADC'}
              strokeWidth="1.25"
              className="cc-verdict-pill-bg"
            />
            <circle
              cx="6"
              cy="0"
              r="3.5"
              fill={activeStage >= 2 ? '#59CDB0' : '#666666'}
              className="cc-verdict-indicator"
            />
            <text
              x="16"
              y="4"
              fill="#111111"
              fontSize="10"
              fontFamily="var(--font-mono, monospace)"
              fontWeight="600"
              letterSpacing="0.5px"
            >
              SUPPORTS
            </text>
          </g>

          {/* --- LAYER 6: TECHNICAL LABELS & METRIC ANNOTATIONS --- */}
          <g className="cc-flow-annotations" fontSize="8.5" fontFamily="var(--font-mono, monospace)" fill="#888888">
            {/* Left labels */}
            <text x="24" y="42" letterSpacing="0.5px">INPUT: CLAIM_TEXT</text>
            <text x="24" y="102" letterSpacing="0.5px">FETCH: HTTPS/BODY</text>
            <text x="24" y="142" letterSpacing="0.5px">GROUNDING: NORM_VERBATIM</text>
            <text x="24" y="222" letterSpacing="0.5px">VALIDATOR_NODE_01</text>
            <text x="24" y="262" letterSpacing="0.5px">VALIDATOR_NODE_02</text>
            <text x="24" y="302" letterSpacing="0.5px">VALIDATOR_NODE_03</text>

            {/* Nexus annotations */}
            <text x="290" y="145" textAnchor="middle" fill="#666666" letterSpacing="0.8px">
              EQUIVALENCE PRINCIPLE
            </text>
            <text x="330" y="240" textAnchor="middle" fill="#111111" fontWeight="600" letterSpacing="0.5px">
              CONSENSUS CONVERGENCE
            </text>
            <text x="330" y="254" textAnchor="middle" fill="#666666" fontSize="8">
              STRICT_EQ (N&gt;=3)
            </text>

            {/* Right terminal annotation */}
            <text x="500" y="148" letterSpacing="0.8px" fill="#4F8EF7">
              STATE ROOT
            </text>
            <text x="500" y="242" letterSpacing="0.5px" fill="#666666">
              GENVM STORAGE
            </text>
          </g>

          {/* --- LAYER 7: TRAVELING PACKET SIGNALS (CSS animated) --- */}
          <g className="cc-flow-packets">
            <circle className="cc-packet cc-packet-1" r="2.5" fill="#4F8EF7" />
            <circle className="cc-packet cc-packet-2" r="2.5" fill="#59CDB0" />
            <circle className="cc-packet cc-packet-3" r="2.5" fill="#111111" />
            <circle className="cc-packet cc-packet-4" r="2" fill="#9A82E8" />
            <circle className="cc-packet cc-packet-5" r="2.5" fill="#59CDB0" />
          </g>
        </svg>
      </div>

      {/* Bottom Technical Progress Bar */}
      <div className="cc-flow-bottom-status">
        <div className="cc-status-step">
          <span className="cc-step-num">01</span>
          <span className="cc-step-label">Ingest Claim</span>
          <div className={`cc-step-indicator ${activeStage >= 0 ? 'is-active' : ''}`} />
        </div>
        <div className="cc-status-step">
          <span className="cc-step-num">02</span>
          <span className="cc-step-label">Retrieve Source</span>
          <div className={`cc-step-indicator ${activeStage >= 1 ? 'is-active' : ''}`} />
        </div>
        <div className="cc-status-step">
          <span className="cc-step-num">03</span>
          <span className="cc-step-label">Multi-Node Consensus</span>
          <div className={`cc-step-indicator ${activeStage >= 2 ? 'is-active' : ''}`} />
        </div>
        <div className="cc-status-step">
          <span className="cc-step-num">04</span>
          <span className="cc-step-label">Record Ruling</span>
          <div className={`cc-step-indicator ${activeStage >= 3 ? 'is-active' : ''}`} />
        </div>
      </div>
    </div>
  );
};
