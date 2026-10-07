import React from 'react';
import { Link } from 'react-router-dom';

export const FinalCTA: React.FC = () => {
  return (
    <section className="cc-final-cta-section cc-reveal-section" aria-labelledby="cta-heading">
      <div className="cc-landing-container">
        <div className="cc-final-cta-card">
          {/* Subtle Accent Glow */}
          <div className="cc-cta-accent-indicator" aria-hidden="true" />

          <span className="cc-cta-tag">GET STARTED WITH CITATION COURT</span>

          <h2 id="cta-heading" className="cc-cta-headline">
            Give every claim a chance to be verified.
          </h2>

          <p className="cc-cta-subtext">
            Submit a claim, provide its evidence, and let the protocol reach the verdict.
          </p>

          <div className="cc-cta-btn-group">
            <Link to="/app/new" className="cc-btn-primary cc-btn-large">
              Lodge a Claim
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <Link to="/app" className="cc-btn-secondary cc-btn-large">
              Launch App
            </Link>
          </div>

          <div className="cc-cta-footnote">
            <span>Non-payable writes on GenLayer Studionet execute without gas fees.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
