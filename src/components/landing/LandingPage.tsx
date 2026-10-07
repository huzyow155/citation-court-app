import React, { useEffect } from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { HowItWorksSection } from './HowItWorksSection';
import { VerificationDemo } from './VerificationDemo';
import { ProtocolSection } from './ProtocolSection';
import { OnChainSection } from './OnChainSection';
import { FinalCTA } from './FinalCTA';
import { LandingFooter } from './LandingFooter';
import './landing.css';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    // Set document title for marketing landing
    const previousTitle = document.title;
    document.title = 'Citation Court — Evidence Deserves a Verdict';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="cc-landing">
      {/* Navigation */}
      <LandingNavbar />

      {/* Main Flow Sequence */}
      <main className="cc-landing-main">
        {/* 1. Hero: Asymmetrical layout with Evidence Flow visualization */}
        <HeroSection />

        {/* 2. The Problem: AI can generate an answer. Can it prove it? */}
        <ProblemSection />

        {/* 3. How It Works: Five-step protocol flow */}
        <HowItWorksSection />

        {/* 4. Interactive Verification Showcase */}
        <VerificationDemo />

        {/* 5. Protocol Principles: 4 pillars of citation integrity */}
        <ProtocolSection />

        {/* 6. On-Chain Provenance: Deployed contracts & verifiable telemetry */}
        <OnChainSection />

        {/* 7. Final Action Prompt */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
