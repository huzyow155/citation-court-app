import type { Verdict } from '../types';

interface MarkedClaimProps {
  claimText: string;
  verdict?: Verdict | 'NONE';
  isHero?: boolean;
  animateOnArrival?: boolean;
}

export const MarkedClaim: React.FC<MarkedClaimProps> = ({
  claimText,
  verdict = 'NONE',
  isHero = false,
  animateOnArrival = false,
}) => {
  const normalizedVerdict = verdict?.toUpperCase() || 'NONE';

  let markClassName = 'mark-plain';
  let ariaVerdictLabel = 'Unjudged';

  switch (normalizedVerdict) {
    case 'SUPPORTS':
      markClassName = 'mark-supports';
      ariaVerdictLabel = 'Verdict: SUPPORTS (highlighted)';
      break;
    case 'CONTRADICTS':
      markClassName = 'mark-contradicts';
      ariaVerdictLabel = 'Verdict: CONTRADICTS (struck through)';
      break;
    case 'NOT_ADDRESSED':
      markClassName = 'mark-not-addressed';
      ariaVerdictLabel = 'Verdict: NOT ADDRESSED (dotted underline)';
      break;
    case 'UNREADABLE':
      markClassName = 'mark-unreadable';
      ariaVerdictLabel = "Verdict: UNREADABLE (couldn't read the page)";
      break;
    case 'PENDING':
      markClassName = 'mark-pending';
      ariaVerdictLabel = 'Evaluation pending (dashed pencil underline)';
      break;
    default:
      markClassName = 'mark-plain';
      ariaVerdictLabel = 'Unjudged claim';
  }

  const containerClasses = [
    'marked-claim-container',
    isHero ? 'claim-hero' : 'claim-standard',
    animateOnArrival ? 'animate-mark' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={containerClasses} role="text" aria-label={`${claimText}. ${ariaVerdictLabel}`}>
      <span className={`claim-sentence ${markClassName}`}>
        {claimText}
      </span>
      {normalizedVerdict === 'NOT_ADDRESSED' && (
        <sup className="marker-superscript" aria-hidden="true">
          [not addressed]
        </sup>
      )}
    </span>
  );
};
