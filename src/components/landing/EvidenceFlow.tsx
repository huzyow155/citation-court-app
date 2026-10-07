import React, { useState, useEffect } from 'react';

export const EvidenceFlow: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  // Cycling sequence: 0: Signals streaming, 1: Validator Convergence, 2: Consensus resolved, 3: Verdict Recorded
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 4000);
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

      {/* SVG Flow Canvas — Upsized +50% Branch Network (viewBox 0 0 900 520) */}
      <div className="cc-flow-canvas-wrapper">
        <svg
          viewBox="0 0 900 520"
          className="cc-flow-svg"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Subtle Gradients for paths */}
            <linearGradient id="grad-blue-silver" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D8DADC" stopOpacity="0.4" />
              <stop offset="55%" stopColor="#4F8EF7" stopOpacity="0.85" />
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
            <line x1="250" y1="20" x2="250" y2="500" />
            <line x1="500" y1="20" x2="500" y2="500" />
            <line x1="730" y1="20" x2="730" y2="500" />
            <line x1="24" y1="260" x2="876" y2="260" />
          </g>

          {/* --- LAYER 1: PASSIVE BACKGROUND PATHS (Fading / auxiliary signals) --- */}
          <g className="cc-flow-passive-paths" stroke="#E4E6E8" strokeWidth="1" strokeLinecap="round">
            <path d="M 28 36 C 160 36, 260 85, 340 110" strokeDasharray="2 4" opacity="0.45" />
            <path d="M 28 88 C 170 88, 270 145, 350 165" opacity="0.55" />
            <path d="M 28 430 C 170 430, 270 375, 350 355" opacity="0.55" />
            <path d="M 28 484 C 160 484, 260 435, 340 410" strokeDasharray="2 4" opacity="0.45" />
          </g>

          {/* --- LAYER 2: PRIMARY CONVERGING EVIDENCE PATHS (+50% Scale, sweeping across vertical height) --- */}
          <g className="cc-flow-converging-paths" strokeWidth="1.5" strokeLinecap="round">
            {/* Path 1: Source Webpage Retrieval */}
            <path
              id="path-source-dom"
              d="M 28 62 C 180 62, 330 220, 500 260"
              stroke="#D8DADC"
              className="cc-path-animated cc-path-source"
            />

            {/* Path 2: Text Normalization Body */}
            <path
              id="path-norm-text"
              d="M 28 118 C 210 118, 350 230, 500 260"
              stroke="url(#grad-blue-silver)"
              className="cc-path-animated cc-path-blue"
            />

            {/* Path 3: Verbatim Passage Check */}
            <path
              id="path-passage"
              d="M 28 174 C 240 174, 380 240, 500 260"
              stroke="#D8DADC"
              className="cc-path-animated"
            />

            {/* Path 4: Equivalence Rule Verification */}
            <path
              id="path-rule"
              d="M 28 218 C 280 218, 410 250, 500 260"
              stroke="url(#grad-mint-silver)"
              className="cc-path-animated cc-path-mint"
            />

            {/* Main Centerline: Single-Fact Claim Core */}
            <path
              id="path-claim-core"
              d="M 28 260 L 500 260"
              stroke="#111111"
              strokeWidth="2"
              className="cc-path-core"
            />

            {/* Path 5: Validator Node 1 LLM Evaluation */}
            <path
              id="path-val-1"
              d="M 28 302 C 280 302, 410 270, 500 260"
              stroke="url(#grad-mint-silver)"
              className="cc-path-animated cc-path-mint"
            />

            {/* Path 6: Validator Node 2 LLM Evaluation */}
            <path
              id="path-val-2"
              d="M 28 346 C 240 346, 380 280, 500 260"
              stroke="#D8DADC"
              className="cc-path-animated"
            />

            {/* Path 7: Validator Node 3 LLM Evaluation */}
            <path
              id="path-val-3"
              d="M 28 402 C 210 402, 350 290, 500 260"
              stroke="url(#grad-blue-silver)"
              className="cc-path-animated cc-path-blue"
            />

            {/* Path 8: Multi-Node Consensus Convergence */}
            <path
              id="path-val-consensus"
              d="M 28 458 C 180 458, 330 300, 500 260"
              stroke="url(#grad-mint-silver)"
              className="cc-path-animated cc-path-mint"
            />
          </g>

          {/* --- LAYER 3: CONVERGENCE NEXUS (VALIDATORS & STRICT_EQ) --- */}
          <g className="cc-flow-nexus" transform="translate(500, 260)">
            {/* Fine architectural radial crosshairs */}
            <line x1="-44" y1="0" x2="44" y2="0" stroke="#D8DADC" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="0" y1="-44" x2="0" y2="44" stroke="#D8DADC" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="-28" y1="-28" x2="28" y2="28" stroke="#ECEDEF" strokeWidth="0.75" strokeDasharray="2 4" />
            <line x1="-28" y1="28" x2="28" y2="-28" stroke="#ECEDEF" strokeWidth="0.75" strokeDasharray="2 4" />

            {/* Outer subtle radar ring */}
            <circle
              cx="0"
              cy="0"
              r="48"
              stroke="#E4E6E8"
              strokeWidth="0.75"
              strokeDasharray="4 4"
              className="cc-pulse-outer"
            />
            {/* Middle evaluation ring */}
            <circle
              cx="0"
              cy="0"
              r="30"
              stroke="#D8DADC"
              strokeWidth="1"
              className={`cc-pulse-middle ${activeStage >= 1 ? 'is-active' : ''}`}
            />
            {/* Mint consensus confirmation ring */}
            <circle
              cx="0"
              cy="0"
              r="16"
              stroke="#59CDB0"
              strokeWidth="1.75"
              strokeDasharray="3 3"
              className={`cc-pulse-mint ${activeStage >= 2 ? 'is-intensified' : ''}`}
            />
            {/* Center solid nexus dot */}
            <circle
              cx="0"
              cy="0"
              r="6"
              fill="#111111"
              className="cc-nexus-core"
            />
            {/* Inner pinpoint core */}
            <circle
              cx="0"
              cy="0"
              r="2"
              fill="#FFFFFF"
            />
          </g>

          {/* --- LAYER 4: RESOLVED VERDICT PIPELINE (From Nexus to SUPPORTS Ruling) --- */}
          <g className="cc-flow-outcome-paths">
            {/* Single verified consensus outcome path along Y=260 */}
            <path
              id="path-verdict-line"
              d="M 500 260 L 730 260"
              stroke="url(#grad-verdict)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={`cc-path-resolved ${activeStage >= 2 ? 'is-streaming' : ''}`}
            />

            {/* Auxiliary verification commit rays */}
            <path
              d="M 500 260 C 580 260, 660 216, 730 216"
              stroke="#D8DADC"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity={activeStage >= 2 ? '0.65' : '0.2'}
            />
            <path
              d="M 500 260 C 580 260, 660 304, 730 304"
              stroke="#D8DADC"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity={activeStage >= 2 ? '0.65' : '0.2'}
            />
          </g>

          {/* --- LAYER 5: VERDICT DESTINATION OBJECT (SUPPORTS PILL) --- */}
          <g className="cc-flow-verdict-node" transform="translate(730, 260)">
            <rect
              x="0"
              y="-21"
              width="114"
              height="42"
              rx="9"
              fill="#FFFFFF"
              stroke={activeStage >= 2 ? '#59CDB0' : '#D8DADC'}
              strokeWidth="1.25"
              className="cc-verdict-pill-bg"
            />
            <circle
              cx="16"
              cy="0"
              r="4.5"
              fill={activeStage >= 2 ? '#59CDB0' : '#666666'}
              className="cc-verdict-indicator"
            />
            <text
              x="31"
              y="4.5"
              fill="#111111"
              fontSize="11.5"
              fontFamily="var(--font-mono, monospace)"
              fontWeight="600"
              letterSpacing="0.8px"
            >
              SUPPORTS
            </text>
          </g>

          {/* --- LAYER 6: TECHNICAL LABELS & METRIC ANNOTATIONS --- */}
          <g className="cc-flow-annotations" fontSize="9.5" fontFamily="var(--font-mono, monospace)" fill="#888888">
            {/* Left labels with generous vertical spacing and precise branch alignment */}
            <text x="28" y="50" letterSpacing="0.5px">INPUT: CLAIM_TEXT</text>
            <text x="28" y="106" letterSpacing="0.5px">FETCH: HTTPS/BODY</text>
            <text x="28" y="162" letterSpacing="0.5px">GROUNDING: NORM_VERBATIM</text>
            <text x="28" y="290" letterSpacing="0.5px">VALIDATOR_NODE_01</text>
            <text x="28" y="334" letterSpacing="0.5px">VALIDATOR_NODE_02</text>
            <text x="28" y="390" letterSpacing="0.5px">VALIDATOR_NODE_03</text>
            <text x="28" y="446" letterSpacing="0.5px">CONSENSUS: STRICT_EQ</text>

            {/* Nexus annotations */}
            <text x="500" y="188" textAnchor="middle" fill="#666666" fontSize="10" letterSpacing="0.8px">
              EQUIVALENCE PRINCIPLE
            </text>
            <text x="500" y="334" textAnchor="middle" fill="#111111" fontSize="11.5" fontWeight="600" letterSpacing="0.6px">
              CONSENSUS CONVERGENCE
            </text>
            <text x="500" y="352" textAnchor="middle" fill="#666666" fontSize="10">
              STRICT_EQ (N&gt;=3)
            </text>

            {/* Right terminal annotations */}
            <text x="730" y="196" letterSpacing="0.8px" fontSize="10" fill="#4F8EF7">
              STATE ROOT
            </text>
            <text x="730" y="324" letterSpacing="0.5px" fontSize="10" fill="#666666">
              GENVM STORAGE
            </text>
          </g>

          {/* --- LAYER 7: TRAVELING SIGNALS & CONNECTED VERDICT PARTICLE --- */}
          <g className="cc-flow-packets">
            {/* Incoming evidence packets traveling along paths into Nexus (500, 260) */}
            <circle className="cc-packet cc-packet-incoming-1" r="3" fill="#4F8EF7">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                keyTimes="0;0.22;1"
                keyPoints="0;1;1"
                calcMode="linear"
              >
                <mpath href="#path-norm-text" />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.9;0.9;0;0"
                keyTimes="0;0.04;0.20;0.23;1"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>

            <circle className="cc-packet cc-packet-incoming-2" r="3" fill="#111111">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                keyTimes="0;0.22;1"
                keyPoints="0;1;1"
                calcMode="linear"
              >
                <mpath href="#path-claim-core" />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.9;0.9;0;0"
                keyTimes="0;0.04;0.20;0.23;1"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>

            <circle className="cc-packet cc-packet-incoming-3" r="3" fill="#59CDB0">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                keyTimes="0;0.22;1"
                keyPoints="0;1;1"
                calcMode="linear"
              >
                <mpath href="#path-val-1" />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0.9;0.9;0;0"
                keyTimes="0;0.04;0.20;0.23;1"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>

            {/* The Connected Supports Verdict Signal:
                Emerges from Nexus (500, 260), travels along #path-verdict-line horizontally
                to SUPPORTS badge at (730, 260), acknowledges with micro-interaction, then rests. */}
            <circle className="cc-verdict-signal-packet" r="3.75" fill="#59CDB0">
              <animateMotion
                dur="4s"
                repeatCount="indefinite"
                keyTimes="0;0.24;0.64;1"
                keyPoints="0;0;1;1"
                calcMode="linear"
              >
                <mpath href="#path-verdict-line" />
              </animateMotion>
              <animate
                attributeName="opacity"
                values="0;0;1;1;0;0"
                keyTimes="0;0.24;0.28;0.62;0.66;1"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
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
