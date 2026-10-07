import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { getClaim, getRuling, judgeClaimTx, waitForReceipt } from '../services/court';
import { parseReceiptOutcome } from '../services/receipt';
import type { Claim, Ruling, PendingAction } from '../types';
import { MarkedClaim } from '../components/MarkedClaim';
import { CopyIcon, CheckIcon, ExternalLinkIcon } from '../components/Icons';
import { CONFIG, getContractExplorerUrl } from '../config';

const LOCAL_STORAGE_PENDING_KEY = 'citation_court_pending_tx';

export const ClaimDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { readOnlyClient, signerClient, account, isCorrectChain, switchOrAddChain, connectWallet } = useWallet();

  const [claim, setClaim] = useState<Claim | null>(null);
  const [ruling, setRuling] = useState<Ruling | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Write / Judging state
  const [isJudging, setIsJudging] = useState(false);
  const [activeTxHash, setActiveTxHash] = useState<string | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [judgeOutcome, setJudgeOutcome] = useState<{
    success: boolean;
    message: string;
    rawError?: string;
  } | null>(null);
  const [justArrivedVerdict, setJustArrivedVerdict] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  const timerRef = useRef<any>(null);

  // Fetch claim data
  const loadClaimData = useCallback(
    async (claimId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const c = await getClaim(readOnlyClient, claimId);
        if (!c) {
          setError(`Claim #${claimId} does not exist on-chain.`);
          return;
        }
        setClaim(c);
        const r = await getRuling(readOnlyClient, claimId);
        setRuling(r);
      } catch (err: any) {
        setError(`Failed to retrieve claim #${claimId}: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [readOnlyClient]
  );

  useEffect(() => {
    if (id) {
      loadClaimData(id);
    }
  }, [id, loadClaimData]);

  // Handle active waiting timer
  useEffect(() => {
    if (isJudging) {
      const start = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedSec(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedSec(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isJudging]);

  // Resume pending action from localStorage if present
  useEffect(() => {
    if (!id) return;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PENDING_KEY);
      if (!stored) return;
      const parsed: PendingAction = JSON.parse(stored);
      if (parsed.claimId === id && parsed.action === 'judge') {
        const timePassed = Math.floor((Date.now() - parsed.startedAt) / 1000);
        // If within 6 minute window, resume waiting
        if (timePassed < 360) {
          console.log('Resuming pending judge transaction from localStorage:', parsed.hash);
          resumeWaiting(parsed.hash, id);
        } else {
          localStorage.removeItem(LOCAL_STORAGE_PENDING_KEY);
        }
      }
    } catch (e) {
      console.warn('Failed to parse pending transaction from storage', e);
    }
  }, [id]);

  const resumeWaiting = async (txHash: string, claimId: string) => {
    setIsJudging(true);
    setActiveTxHash(txHash);
    setJudgeOutcome(null);

    try {
      const receipt = await waitForReceipt(readOnlyClient, txHash);
      const outcome = parseReceiptOutcome(receipt);

      if (outcome.isSuccess) {
        // Read back state
        const updatedRuling = await getRuling(readOnlyClient, claimId);
        setRuling(updatedRuling);
        setJustArrivedVerdict(true);
        setJudgeOutcome({
          success: true,
          message: `Consensus judgment completed. Verdict recorded: ${updatedRuling?.verdict || 'Recorded'}.`,
        });
      } else {
        setJudgeOutcome({
          success: false,
          message: outcome.errorMessage || 'Judgment transaction was not accepted by validators.',
          rawError: outcome.rawError,
        });
      }
    } catch (err: any) {
      setJudgeOutcome({
        success: false,
        message: `Evaluation timed out or failed: ${err.message}. Transaction hash: ${txHash}`,
      });
    } finally {
      setIsJudging(false);
      localStorage.removeItem(LOCAL_STORAGE_PENDING_KEY);
    }
  };

  const handleJudge = async () => {
    if (!id || !claim) return;

    if (!account) {
      await connectWallet();
      return;
    }

    if (!isCorrectChain) {
      await switchOrAddChain();
      return;
    }

    if (!signerClient) {
      setError('Wallet signer client is not initialized.');
      return;
    }

    setIsJudging(true);
    setJudgeOutcome(null);
    setJustArrivedVerdict(false);

    try {
      // 1. Submit judge_claim transaction
      const txHash = await judgeClaimTx(signerClient, id);
      setActiveTxHash(txHash);

      // Persist in localStorage to survive accidental reload
      const pending: PendingAction = {
        hash: txHash,
        claimId: id,
        action: 'judge',
        startedAt: Date.now(),
      };
      localStorage.setItem(LOCAL_STORAGE_PENDING_KEY, JSON.stringify(pending));

      // 2. Poll receipt using standard 6-minute window
      const receipt = await waitForReceipt(signerClient, txHash);
      const outcome = parseReceiptOutcome(receipt);

      if (outcome.isSuccess) {
        // 3. Read back ruling state via view call
        const updatedRuling = await getRuling(readOnlyClient, id);
        setRuling(updatedRuling);
        setJustArrivedVerdict(true);
        setJudgeOutcome({
          success: true,
          message: `Consensus judgment confirmed. Verdict recorded: ${updatedRuling?.verdict}.`,
        });
      } else {
        setJudgeOutcome({
          success: false,
          message: outcome.errorMessage || 'Judgment transaction was not accepted by validators.',
          rawError: outcome.rawError,
        });
      }
    } catch (err: any) {
      console.error('Error during judge_claim flow:', err);
      if (err.message?.includes('User rejected') || err.message?.includes('denied')) {
        setJudgeOutcome({
          success: false,
          message: 'Transaction was rejected in wallet.',
        });
      } else {
        setJudgeOutcome({
          success: false,
          message: `Judgment request failed: ${err.message}`,
        });
      }
    } finally {
      setIsJudging(false);
      localStorage.removeItem(LOCAL_STORAGE_PENDING_KEY);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const extractHost = (urlStr: string) => {
    try {
      return new URL(urlStr).hostname;
    } catch {
      return urlStr;
    }
  };

  const canJudge =
    !isJudging &&
    (!ruling || (ruling.verdict === 'UNREADABLE' && ruling.attempts < 3));

  return (
    <div className="page-container page-claim-detail">
      <div className="breadcrumb-nav">
        <Link to="/" className="breadcrumb-link">
          &larr; Back to recent claims
        </Link>
      </div>

      {isLoading && (
        <div className="state-panel loading-panel" role="status">
          <p className="loading-text">Loading claim #{id} from Studionet...</p>
        </div>
      )}

      {error && (
        <div className="state-panel error-panel" role="alert">
          <h2 className="error-title">Notice</h2>
          <p className="error-description">{error}</p>
        </div>
      )}

      {claim && (
        <div className="claim-detail-layout">
          {/* Main Reading Column */}
          <section className="claim-main-content">
            <header className="claim-header">
              <span className="claim-id-label">Claim #{claim.id}</span>
              <h1 className="sr-only">Claim #{claim.id} verification record</h1>
            </header>

            <div className="claim-hero-passage">
              <MarkedClaim
                claimText={claim.claim}
                verdict={isJudging ? 'PENDING' : ruling?.verdict || 'NONE'}
                isHero={true}
                animateOnArrival={justArrivedVerdict}
              />
            </div>

            {ruling?.verdict === 'UNREADABLE' && !isJudging && (
              <div className="unreadable-callout-bar">
                <span className="redaction-tag">couldn't read the page</span>
                <span className="callout-explanation">
                  Independent validators could not fetch readable text from this URL (e.g. HTTP 404, paywall, or client-side rendering).
                </span>
              </div>
            )}

            {/* Judging Action / Progress Box */}
            <div className="action-control-panel">
              {canJudge ? (
                <div className="judge-prompt-box">
                  <p className="judge-instruction">
                    {ruling
                      ? `Previous evaluation was UNREADABLE. You may re-judge this claim (attempt ${ruling.attempts + 1} of 3).`
                      : 'This claim has been lodged but not yet evaluated by validators.'}
                  </p>
                  <button
                    type="button"
                    className="btn-action-primary"
                    onClick={handleJudge}
                    disabled={isJudging}
                  >
                    {!account
                      ? 'Connect wallet to judge'
                      : ruling
                      ? 'Re-judge this claim'
                      : 'Judge this claim'}
                  </button>
                </div>
              ) : ruling && ruling.verdict !== 'UNREADABLE' ? (
                <div className="judgment-settled-box">
                  <p className="settled-text">
                    Verdict determined by consensus: <strong>{ruling.verdict}</strong> ({ruling.attempts} of 3 attempts used).
                  </p>
                </div>
              ) : ruling && ruling.attempts >= 3 ? (
                <div className="attempt-limit-box">
                  <p className="limit-text">
                    Attempt limit of 3 reached. No further evaluation attempts can be executed for this claim.
                  </p>
                </div>
              ) : null}

              {isJudging && (
                <div className="judging-waiting-state" role="status" aria-live="polite">
                  <div className="waiting-spinner-track" />
                  <div className="waiting-text-group">
                    <p className="waiting-title">Evaluating claim on GenLayer Studionet...</p>
                    <p className="waiting-time">Elapsed time: {elapsedSec}s (measured range: 9.4s – 25.4s, n=9)</p>
                    {elapsedSec > 26 && (
                      <p className="waiting-longer-notice">
                        Taking longer than measured runs (measured maximum: 25.4s, n=9). Waiting for consensus receipt...
                      </p>
                    )}
                    <p className="waiting-subtext">
                      Independent validators are fetching the source webpage and executing equivalence consensus.
                    </p>
                    {activeTxHash && (
                      <div className="tx-hash-row">
                        <span className="hash-label">Transaction:</span>
                        <code className="tx-hash-code">{activeTxHash}</code>
                        <button
                          type="button"
                          className="btn-copy-hash"
                          onClick={() => copyHash(activeTxHash)}
                          title="Copy transaction hash"
                        >
                          {copiedTx ? <CheckIcon /> : <CopyIcon />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {judgeOutcome && (
                <div
                  className={`outcome-banner ${judgeOutcome.success ? 'outcome-success' : 'outcome-failure'}`}
                  role="alert"
                >
                  <p className="outcome-message">{judgeOutcome.message}</p>
                  {judgeOutcome.rawError && (
                    <details className="raw-error-details">
                      <summary>Technical error details</summary>
                      <code>{judgeOutcome.rawError}</code>
                    </details>
                  )}
                </div>
              )}
            </div>

            {/* Scope & Grounding Explanation */}
            <article className="grounding-scope-guide">
              <h2 className="guide-heading">Grounding Scope & Interpretation</h2>
              <div className="scope-grid">
                <div className="scope-col scope-positive">
                  <h3 className="scope-col-title">What this verdict means</h3>
                  <p>
                    {ruling?.verdict === 'SUPPORTS' &&
                      'Validators fetched the webpage and confirmed verbatim normalized passage text supporting the claim.'}
                    {ruling?.verdict === 'CONTRADICTS' &&
                      'Validators fetched the webpage and confirmed verbatim normalized passage text that directly contradicts the claim assertion.'}
                    {ruling?.verdict === 'NOT_ADDRESSED' &&
                      'Validators fetched the webpage but found neither supporting nor contradicting statements for this specific claim.'}
                    {ruling?.verdict === 'UNREADABLE' &&
                      'Validators could not extract sufficient plain-text content from the provided URL (status 404, paywall, or sub-200 characters).'}
                    {!ruling &&
                      'When judged, independent consensus validators compare the claim against normalized page content.'}
                  </p>
                </div>
                <div className="scope-col scope-negative">
                  <h3 className="scope-col-title">What this verdict does NOT mean</h3>
                  <p>
                    This contract does NOT verify whether the cited website is an authoritative, trustworthy, or truthful source. Nor does it establish whether the claim is objectively true in reality. It verifies mechanical quote presence on the page text.
                  </p>
                </div>
              </div>
            </article>
          </section>

          {/* Quiet Margin Column */}
          <aside className="claim-margin-provenance">
            <div className="provenance-block">
              <h2 className="margin-heading">Source Provenance</h2>
              <span className="host-prominent">{extractHost(claim.url)}</span>
              <div className="source-url-row">
                <a
                  href={claim.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="full-url-link"
                  title={claim.url}
                >
                  {claim.url}
                  <ExternalLinkIcon />
                </a>
              </div>
            </div>

            <div className="provenance-block">
              <h2 className="margin-heading">Consensus State</h2>
              <dl className="provenance-meta-list">
                <dt>Verdict</dt>
                <dd className={`verdict-tag verdict-${(ruling?.verdict || 'none').toLowerCase()}`}>
                  {ruling?.verdict || 'Unjudged'}
                </dd>
                <dt>Attempts</dt>
                <dd>{ruling ? `${ruling.attempts} / 3` : '0 / 3'}</dd>
                <dt>Author</dt>
                <dd className="address-meta" title={claim.author}>
                  {claim.author ? `${claim.author.slice(0, 6)}...${claim.author.slice(-4)}` : 'Unknown'}
                </dd>
              </dl>
            </div>

            <div className="provenance-block">
              <h2 className="margin-heading">Contract Reference</h2>
              <p className="margin-note">Citation Court on Studionet:</p>
              <a
                href={getContractExplorerUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="explorer-address-link"
              >
                <code>{CONFIG.citationCourtAddress.slice(0, 10)}...{CONFIG.citationCourtAddress.slice(-8)}</code>
                <ExternalLinkIcon />
              </a>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
