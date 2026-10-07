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

      {/* SVG Flow Canvas — Expanded Canvas for Breathing Room & High Presence */}
      <div className="cc-flow-canvas-wrapper">
        <svg
          viewBox="0 0 760 460"
          className="cc-flow-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Subtle Gradients for paths */}
            <linearGradient id="grad-blue-silver" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D8DADC" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#4F8EF7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#D8DADC" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="grad-mint-silver" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D8DADC" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#59CDB0" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#D8DADC" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="grad-verdict" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#111111" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#59CDB0" stopOpacity="0.95" />
            </linearGradient>

            {/* Filter for subtle nexus glow */}
            <filter id="nexus-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid Guide Lines (Silver, faint architectural grid) */}
          <g className="cc-flow-grid" stroke="#ECEDEF" strokeWidth="0.75" strokeDasharray="3 3">
            <line x1="200" y1="20" x2="200" y2="440" />
            <line x1="425" y1="20" x2="425" y2="440" />
            <line x1="620" y1="20" x2="620" y2="440" />
            <line x1="20" y1="230" x2="740" y2="230" />
          </g>

          {/* --- LAYER 1: PASSIVE BACKGROUND PATHS (Fading / discarded signals) --- */}
          <g className="cc-flow-passive-paths" stroke="#E4E6E8" strokeWidth="1" strokeLinecap="round">
            <path d="M 28 30 C 130 30, 200 90, 260 110" strokeDasharray="2 4" opacity="0.55" />
            <path d="M 28 80 C 140 80, 210 140, 280 150" opacity="0.65" />
            <path d="M 28 380 C 140 380, 210 320, 280 310" opacity="0.65" />
            <path d="M 28 430 C 130 430, 200 370, 260 350" strokeDasharray="2 4" opacity="0.55" />
          </g>

          {/* --- LAYER 2: PRIMARY CONVERGING EVIDENCE PATHS (Widely spread, prominent branches) --- */}
          <g className="cc-flow-converging-paths" strokeWidth="1.5" strokeLinecap="round">
            {/* Path 1: Source Webpage Retrieval */}
            <path
              id="path-source-dom"
              d="M 28 55 C 170 55, 280 200, 425 230"
              stroke="#D8DADC"
              className="cc-path-animated cc-path-source"
            />

            {/* Path 2: Text Normalization Body */}
            <path
              id="path-norm-text"
              d="M 28 110 C 185 110, 295 210, 425 230"
              stroke="url(#grad-blue-silver)"
              className="cc-path-animated cc-path-blue"
            />

            {/* Path 3: Verbatim Passage Check */}
            <path
              id="path-passage"
              d="M 28 165 C 205 165, 310 220, 425 230"
              stroke="#D8DADC"
              className="cc-path-animated"
            />

            {/* Path 4: Single-Fact Claim Core (Main Centerline) */}
            <path
              id="path-claim-core"
              d="M 28 230 L 425 230"
              stroke="#111111"
              strokeWidth="2"
              className="cc-path-core"
            />

            {/* Path 5: Validator Node 1 LLM Evaluation */}
            <path
              id="path-val-1"
              d="M 28 295 C 205 295, 310 240, 425 230"
              stroke="url(#grad-mint-silver)"
              className="cc-path-animated cc-path-mint"
            />

            {/* Path 6: Validator Node 2 LLM Evaluation */}
            <path
              id="path-val-2"
              d="M 28 350 C 185 350, 295 250, 425 230"
              stroke="#D8DADC"
              className="cc-path-animated"
            />

            {/* Path 7: Validator Node 3 LLM Evaluation */}
            <path
              id="path-val-3"
              d="M 28 405 C 170 405, 280 260, 425 230"
              stroke="url(#grad-blue-silver)"
              className="cc-path-animated cc-path-blue"
            />
          </g>

          {/* --- LAYER 3: CONVERGENCE NEXUS (VALIDATORS & STRICT_EQ) --- */}
          <g className="cc-flow-nexus" transform="translate(425, 230)">
            {/* Fine architectural radial crosshairs */}
            <line x1="-36" y1="0" x2="36" y2="0" stroke="#D8DADC" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="0" y1="-36" x2="0" y2="36" stroke="#D8DADC" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="-24" y1="-24" x2="24" y2="24" stroke="#ECEDEF" strokeWidth="0.75" strokeDasharray="2 4" />
            <line x1="-24" y1="24" x2="24" y2="-24" stroke="#ECEDEF" strokeWidth="0.75" strokeDasharray="2 4" />

            {/* Outer subtle radar ring */}
            <circle
              cx="0"
              cy="0"
              r="42"
              stroke="#E4E6E8"
              strokeWidth="0.75"
              strokeDasharray="4 4"
              className="cc-pulse-outer"
            />
            {/* Middle evaluation ring */}
            <circle
              cx="0"
              cy="0"
              r="26"
              stroke="#D8DADC"
              strokeWidth="1"
              className={`cc-pulse-middle ${activeStage >= 1 ? 'is-active' : ''}`}
            />
            {/* Mint consensus confirmation ring */}
            <circle
              cx="0"
              cy="0"
              r="14"
              stroke="#59CDB0"
              strokeWidth="1.75"
              strokeDasharray="3 3"
              className={`cc-pulse-mint ${activeStage >= 2 ? 'is-intensified' : ''}`}
            />
            {/* Center solid nexus dot */}
            <circle
              cx="0"
              cy="0"
              r="5.5"
              fill="#111111"
              className="cc-nexus-core"
            />
            {/* Inner pinpoint core */}
            <circle
              cx="0"
              cy="0"
              r="1.75"
              fill="#FFFFFF"
            />
          </g>

          {/* --- LAYER 4: RESOLVED VERDICT PIPELINE (From Nexus to On-Chain Commit) --- */}
          <g className="cc-flow-outcome-paths">
            {/* Single verified consensus outcome path */}
            <path
              d="M 425 230 L 620 230"
              stroke="url(#grad-verdict)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={`cc-path-resolved ${activeStage >= 2 ? 'is-streaming' : ''}`}
            />

            {/* Auxiliary verification commit rays */}
            <path
              d="M 425 230 C 490 230, 560 190, 620 190"
              stroke="#D8DADC"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity={activeStage >= 2 ? '0.7' : '0.2'}
            />
            <path
              d="M 425 230 C 490 230, 560 270, 620 270"
              stroke="#D8DADC"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity={activeStage >= 2 ? '0.7' : '0.2'}
            />
          </g>

          {/* --- LAYER 5: VERDICT DESTINATION OBJECT --- */}
          <g className="cc-flow-verdict-node" transform="translate(620, 230)">
            <rect
              x="-6"
              y="-20"
              width="100"
              height="40"
              rx="8"
              fill="#FFFFFF"
              stroke={activeStage >= 2 ? '#59CDB0' : '#D8DADC'}
              strokeWidth="1.25"
              className="cc-verdict-pill-bg"
            />
            <circle
              cx="7"
              cy="0"
              r="4"
              fill={activeStage >= 2 ? '#59CDB0' : '#666666'}
              className="cc-verdict-indicator"
            />
            <text
              x="19"
              y="4"
              fill="#111111"
              fontSize="11"
              fontFamily="var(--font-mono, monospace)"
              fontWeight="600"
              letterSpacing="0.5px"
            >
              SUPPORTS
            </text>
          </g>

          {/* --- LAYER 6: TECHNICAL LABELS & METRIC ANNOTATIONS --- */}
          <g className="cc-flow-annotations" fontSize="9.5" fontFamily="var(--font-mono, monospace)" fill="#888888">
            {/* Left labels with ample vertical spacing */}
            <text x="28" y="44" letterSpacing="0.5px">INPUT: CLAIM_TEXT</text>
            <text x="28" y="99" letterSpacing="0.5px">FETCH: HTTPS/BODY</text>
            <text x="28" y="154" letterSpacing="0.5px">GROUNDING: NORM_VERBATIM</text>
            <text x="28" y="284" letterSpacing="0.5px">VALIDATOR_NODE_01</text>
            <text x="28" y="339" letterSpacing="0.5px">VALIDATOR_NODE_02</text>
            <text x="28" y="394" letterSpacing="0.5px">VALIDATOR_NODE_03</text>

            {/* Nexus annotations */}
            <text x="425" y="165" textAnchor="middle" fill="#666666" fontSize="10" letterSpacing="0.8px">
              EQUIVALENCE PRINCIPLE
            </text>
            <text x="425" y="295" textAnchor="middle" fill="#111111" fontSize="11" fontWeight="600" letterSpacing="0.5px">
              CONSENSUS CONVERGENCE
            </text>
            <text x="425" y="312" textAnchor="middle" fill="#666666" fontSize="9.5">
              STRICT_EQ (N&gt;=3)
            </text>

            {/* Right terminal annotation */}
            <text x="620" y="175" letterSpacing="0.8px" fontSize="10" fill="#4F8EF7">
              STATE ROOT
            </text>
            <text x="620" y="290" letterSpacing="0.5px" fontSize="9.5" fill="#666666">
              GENVM STORAGE
            </text>
          </g>

          {/* --- LAYER 7: TRAVELING PACKET SIGNALS (CSS animated) --- */}
          <g className="cc-flow-packets">
            <circle className="cc-packet cc-packet-1" r="2.75" fill="#4F8EF7" />
            <circle className="cc-packet cc-packet-2" r="2.75" fill="#59CDB0" />
            <circle className="cc-packet cc-packet-3" r="2.75" fill="#111111" />
            <circle className="cc-packet cc-packet-4" r="2.25" fill="#9A82E8" />
            <circle className="cc-packet cc-packet-5" r="2.75" fill="#59CDB0" />
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
