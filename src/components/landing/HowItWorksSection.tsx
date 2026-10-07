import React, { useState, useEffect } from 'react';

interface Step {
  number: string;
  title: string;
  action: string;
  description: string;
  technicalNote: string;
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'CLAIM',
    action: 'Lodge a single assertion',
    description: 'A contributor submits a focused statement between 20 and 400 characters into the CitationCourt smart contract.',
    technicalNote: 'fn: lodge_claim(claim_text, url)',
  },
  {
    number: '02',
    title: 'SOURCE',
    action: 'Bind to HTTPS evidence',
    description: 'The claim links to an accessible public webpage. Private loopbacks, IP literals, and credentials are rejected at the contract boundary.',
    technicalNote: 'Scheme: HTTPS (max 300 chars)',
  },
  {
    number: '03',
    title: 'VALIDATORS',
    action: 'Retrieve and normalize',
    description: 'GenLayer validator nodes independently issue HTTP requests, strip HTML markup, and normalize whitespace and punctuation.',
    technicalNote: 'Multi-node web.get() isolation',
  },
  {
    number: '04',
    title: 'CONSENSUS',
    action: 'Equivalence Principle convergence',
    description: 'Independent LLMs evaluate semantic alignment. The extracted quote must match the normalized page body text to sustain a SUPPORTS or CONTRADICTS ruling.',
    technicalNote: 'gl.eq_principle.strict_eq()',
  },
  {
    number: '05',
    title: 'VERDICT',
    action: 'Commit on-chain record',
    description: 'The agreed outcome (SUPPORTS, CONTRADICTS, NOT_ADDRESSED, or UNREADABLE) is permanently stored in GenVM state with attempt tallies.',
    technicalNote: 'Receipt: ACCEPTED + MAJORITY_AGREE',
  },
];

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Progressive protocol timeline execution
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 3400);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section id="how-it-works" className="cc-how-it-works-section cc-reveal-section" aria-labelledby="how-title">
      <div className="cc-landing-container">
        {/* Section Header */}
        <div className="cc-section-header">
          <span className="cc-section-label">PROTOCOL MECHANISM</span>
          <h2 id="how-title" className="cc-section-title">
            Five steps from claim to on-chain ruling.
          </h2>
          <p className="cc-section-desc">
            A deterministic pipeline turns unstructured web text into decentralized smart contract state without trusting any centralized oracle.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="cc-steps-grid">
          {STEPS.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <div
                key={step.number}
                className={`cc-step-card cc-reveal-item ${isSelected ? 'is-selected' : ''}`}
                onMouseEnter={() => {
                  setActiveStep(idx);
                  setIsPaused(true);
                }}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => {
                  setActiveStep(idx);
                  setIsPaused(true);
                }}
                onBlur={() => setIsPaused(false)}
                tabIndex={0}
                role="region"
                aria-label={`Step ${step.number}: ${step.title}`}
              >
                {/* Step Connector Line */}
                <div className="cc-step-top-bar">
                  <span className="cc-step-num-display">{step.number}</span>
                  <span className="cc-step-status-pill">{step.title}</span>
                </div>

                <div className="cc-step-body">
                  <h3 className="cc-step-action">{step.action}</h3>
                  <p className="cc-step-description">{step.description}</p>
                </div>

                <div className="cc-step-footer">
                  <code className="cc-step-tech-code">{step.technicalNote}</code>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flow Continuity Visual Line */}
        <div className="cc-pipeline-continuity-track" aria-hidden="true">
          <div className="cc-track-line" />
          <div
            className="cc-track-progress"
            style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
};
