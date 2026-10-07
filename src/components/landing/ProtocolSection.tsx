import React from 'react';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Evidence Grounding',
    subtitle: 'Mechanical quote presence',
    description:
      'A claim cannot be ruled SUPPORTS or CONTRADICTS purely on speculative reasoning. The evaluating model must extract a passage that exists verbatim in the retrieved page after case, whitespace, and punctuation normalization.',
  },
  {
    number: '02',
    title: 'Independent Validation',
    subtitle: 'Zero single point of failure',
    description:
      'Independent GenLayer validator nodes perform external HTTP requests directly from their sandboxed execution environments, eliminating reliance on centralized API gateways or opaque scraping providers.',
  },
  {
    number: '03',
    title: 'Consensus Equivalence',
    subtitle: 'Equivalence Principle convergence',
    description:
      'Validators run nondeterministic LLM evaluations under GenLayer’s Equivalence Principle. Consensus requires a majority of distinct validator nodes to agree before committing valid smart contract state.',
  },
  {
    number: '04',
    title: 'On-Chain Provenance',
    subtitle: 'Deterministic auditability',
    description:
      'All rulings, attempt tallies, and author addresses are permanently committed to GenVM contract storage, directly callable by downstream consumer contracts like CitedBoard without off-chain trust assumptions.',
  },
];

export const ProtocolSection: React.FC = () => {
  return (
    <section id="principles" className="cc-principles-section cc-reveal-section" aria-labelledby="principles-title">
      <div className="cc-landing-container">
        {/* Section Header */}
        <div className="cc-section-header">
          <span className="cc-section-label">FOUNDATIONAL ARCHITECTURE</span>
          <h2 id="principles-title" className="cc-section-title">
            Four pillars of citation integrity.
          </h2>
          <p className="cc-section-desc">
            Designed to prevent citation hallucination, prompt injection in page contents, and validator divergence.
          </p>
        </div>

        {/* Four Minimal Columns with Silver Dividers */}
        <div className="cc-principles-grid">
          {PRINCIPLES.map((item) => (
            <div key={item.number} className="cc-principle-col">
              <div className="cc-principle-top">
                <span className="cc-principle-num">{item.number}</span>
                <span className="cc-principle-sub">{item.subtitle}</span>
              </div>
              <h3 className="cc-principle-heading">{item.title}</h3>
              <p className="cc-principle-body">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
