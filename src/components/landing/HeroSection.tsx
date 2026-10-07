import React from 'react';
import { Link } from 'react-router-dom';
import { EvidenceFlow } from './EvidenceFlow';

export const HeroSection: React.FC = () => {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="cc-hero-section" aria-labelledby="hero-title">
      <div className="cc-landing-container cc-hero-layout">
        {/* Left Column: Evidence Flow Visualization */}
        <div className="cc-hero-visual-col">
          <div className="cc-visual-frame">
            <EvidenceFlow />
          </div>
        </div>

        {/* Right Column: Editorial Headline & Actions */}
        <div className="cc-hero-content-col">
          <div className="cc-hero-kicker">
            <span className="cc-kicker-pulse" />
            <span className="cc-kicker-text">EVIDENCE INTEGRITY PROTOCOL</span>
          </div>

          <h1 id="hero-title" className="cc-hero-headline">
            <span className="cc-headline-line-wrap">
              <span className="cc-headline-line cc-line-1">Evidence deserves a</span>
            </span>
            <span className="cc-headline-line-wrap">
              <span className="cc-headline-line cc-line-2">verdict.</span>
            </span>
          </h1>

          <p className="cc-hero-subhead">
            Citation Court verifies single-fact claims against their cited sources, reaches validator consensus, and records the ruling on-chain.
          </p>

          <div className="cc-hero-cta-group">
            <Link to="/app/new" className="cc-btn-primary">
              Lodge a Claim
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <button type="button" onClick={scrollToHowItWorks} className="cc-btn-secondary">
              Explore the Protocol
            </button>
          </div>

          <div className="cc-hero-metadata-strip">
            <div className="cc-meta-badge">
              <span className="cc-meta-title">NETWORK</span>
              <span className="cc-meta-value">GenLayer Studionet (61999)</span>
            </div>
            <div className="cc-meta-badge">
              <span className="cc-meta-title">EXECUTION</span>
              <span className="cc-meta-value">Python GenVM Equivalence</span>
            </div>
            <div className="cc-meta-badge">
              <span className="cc-meta-title">STATUS</span>
              <span className="cc-meta-value">Preview</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
