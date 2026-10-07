import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`cc-landing-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="cc-landing-nav-inner">
        {/* Brand */}
        <Link to="/" className="cc-landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="cc-brand-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6C9 6 12 10 12 12C12 14 15 18 20 18" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M4 18C9 18 12 14 12 12C12 10 15 6 20 6" stroke="#4F8EF7" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2.5" fill="#111111" />
            </svg>
          </span>
          <span className="cc-brand-name">Citation Court</span>
          <span className="cc-brand-pill">Studionet</span>
        </Link>

        {/* Desktop Links */}
        <nav className="cc-landing-links" aria-label="Landing Navigation">
          <button type="button" onClick={() => scrollToSection('protocol')} className="cc-nav-link">
            Protocol
          </button>
          <button type="button" onClick={() => scrollToSection('how-it-works')} className="cc-nav-link">
            How It Works
          </button>
          <button type="button" onClick={() => scrollToSection('verification-demo')} className="cc-nav-link">
            Verification
          </button>
          <button type="button" onClick={() => scrollToSection('principles')} className="cc-nav-link">
            Principles
          </button>
          <Link to="/app/evidence" className="cc-nav-link">
            Evidence
          </Link>
          <Link to="/app/about" className="cc-nav-link">
            About
          </Link>
        </nav>

        {/* Action Button */}
        <div className="cc-landing-nav-action">
          <Link to="/app" className="cc-btn-launch">
            Launch App
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="cc-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`cc-hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="cc-mobile-menu" role="dialog" aria-modal="true">
          <button type="button" onClick={() => scrollToSection('protocol')} className="cc-mobile-nav-link">
            Protocol
          </button>
          <button type="button" onClick={() => scrollToSection('how-it-works')} className="cc-mobile-nav-link">
            How It Works
          </button>
          <button type="button" onClick={() => scrollToSection('verification-demo')} className="cc-mobile-nav-link">
            Verification
          </button>
          <button type="button" onClick={() => scrollToSection('principles')} className="cc-mobile-nav-link">
            Principles
          </button>
          <Link to="/app/evidence" onClick={() => setMobileMenuOpen(false)} className="cc-mobile-nav-link">
            Evidence Records
          </Link>
          <Link to="/app/about" onClick={() => setMobileMenuOpen(false)} className="cc-mobile-nav-link">
            About
          </Link>
          <div className="cc-mobile-action-wrapper">
            <Link to="/app" onClick={() => setMobileMenuOpen(false)} className="cc-btn-launch cc-btn-launch-mobile">
              Launch App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
