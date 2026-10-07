import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  ariaHidden?: boolean;
}

export const CitationCourtLogo: React.FC<LogoProps> = ({
  size = 22,
  className = '',
  ariaHidden = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaHidden}
    >
      {/* Evidence Stream Path 1: Source Signal (Black) */}
      <path
        d="M 96 144 C 176 144, 256 216, 256 256 C 256 296, 336 368, 416 368"
        stroke="#111111"
        strokeWidth="34"
        strokeLinecap="round"
      />
      {/* Evidence Stream Path 2: Claim Assertion (Protocol Blue) */}
      <path
        d="M 96 368 C 176 368, 256 296, 256 256 C 256 216, 336 144, 416 144"
        stroke="#4F8EF7"
        strokeWidth="34"
        strokeLinecap="round"
      />
      {/* Consensus Verification Ring (Mint) */}
      <circle
        cx="256"
        cy="256"
        r="64"
        stroke="#59CDB0"
        strokeWidth="10"
        strokeDasharray="16 16"
        fill="none"
      />
      {/* Central Consensus Nexus Dot */}
      <circle cx="256" cy="256" r="44" fill="#111111" />
      <circle cx="256" cy="256" r="14" fill="#FFFFFF" />
    </svg>
  );
};

export default CitationCourtLogo;
