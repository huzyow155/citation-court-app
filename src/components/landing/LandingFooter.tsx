import React from 'react';
import { Link } from 'react-router-dom';
import { CitationCourtLogo } from '../CitationCourtLogo';

export const LandingFooter: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="cc-landing-footer">
      <div className="cc-landing-container cc-footer-layout">
        {/* Left Branding */}
        <div className="cc-footer-brand-col">
          <Link to="/" className="cc-footer-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <CitationCourtLogo size={20} />
            <span className="cc-footer-brand-name">Citation Court</span>
          </Link>
          <p className="cc-footer-tagline">
            Decentralized single-fact citation verification on GenLayer.
          </p>
          <span className="cc-footer-build-badge">Built on GenLayer Studionet</span>
        </div>

        {/* Center Navigation Links */}
        <div className="cc-footer-links-col">
          <span className="cc-footer-col-title">NAVIGATION</span>
          <button type="button" onClick={() => scrollTo('protocol')} className="cc-footer-link">
            Protocol
          </button>
          <button type="button" onClick={() => scrollTo('how-it-works')} className="cc-footer-link">
            How It Works
          </button>
          <button type="button" onClick={() => scrollTo('verification-demo')} className="cc-footer-link">
            Verification Demo
          </button>
          <button type="button" onClick={() => scrollTo('principles')} className="cc-footer-link">
            Core Principles
          </button>
        </div>

        {/* Resources & App */}
        <div className="cc-footer-links-col">
          <span className="cc-footer-col-title">APPLICATION</span>
          <Link to="/app" className="cc-footer-link cc-link-bold">
            Launch App &rarr;
          </Link>
          <Link to="/app/new" className="cc-footer-link">
            Lodge Claim
          </Link>
          <Link to="/app/evidence" className="cc-footer-link">
            Evidence Records
          </Link>
          <Link to="/app/about" className="cc-footer-link">
            About Mechanics
          </Link>
        </div>
      </div>

      <div className="cc-footer-bottom-bar">
        <div className="cc-landing-container cc-bottom-inner">
          <span className="cc-copyright">&copy; 2026 Citation Court &bull; Preview on Chain ID 61999</span>
          <span className="cc-bottom-notice">Zero-Oracle Mechanical Verification</span>
        </div>
      </div>
    </footer>
  );
};
