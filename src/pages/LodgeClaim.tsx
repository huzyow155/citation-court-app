import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { lodgeClaimTx, waitForReceipt, latestByAuthor } from '../services/court';
import { validateClaimInput, validateUrlInput } from '../services/validation';
import { parseReceiptOutcome } from '../services/receipt';
import { CopyIcon, CheckIcon } from '../components/Icons';

export const LodgeClaim: React.FC = () => {
  const navigate = useNavigate();
  const { readOnlyClient, signerClient, account, isCorrectChain, switchOrAddChain, connectWallet } = useWallet();

  const [claimText, setClaimText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTxHash, setActiveTxHash] = useState<string | null>(null);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [copiedTx, setCopiedTx] = useState(false);
  const [submitError, setSubmitError] = useState<{ message: string; rawError?: string } | null>(null);

  // Validation feedback
  const claimValidation = validateClaimInput(claimText);
  const urlValidation = validateUrlInput(sourceUrl);

  const isFormValid =
    claimValidation.isValid &&
    urlValidation.isValid &&
    claimText.trim().length >= 20 &&
    claimText.trim().length <= 400;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!account) {
      await connectWallet();
      return;
    }

    if (!isCorrectChain) {
      await switchOrAddChain();
      return;
    }

    if (!isFormValid) {
      setSubmitError({ message: 'Please correct the validation errors before submitting.' });
      return;
    }

    if (!signerClient) {
      setSubmitError({ message: 'Signer wallet client is not connected.' });
      return;
    }

    setIsSubmitting(true);
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    try {
      // 1. Submit lodge_claim write transaction
      const txHash = await lodgeClaimTx(signerClient, claimText.trim(), sourceUrl.trim());
      setActiveTxHash(txHash);

      // 2. Wait for confirmation receipt
      const receipt = await waitForReceipt(signerClient, txHash);
      const outcome = parseReceiptOutcome(receipt);

      if (!outcome.isSuccess) {
        throw new Error(outcome.errorMessage || 'Transaction not accepted by validators.');
      }

      // 3. Find the newly created ID using latest_by_author (never recompute or guess)
      const newClaimId = await latestByAuthor(readOnlyClient, account);
      if (!newClaimId) {
        throw new Error('Claim was accepted but latest_by_author did not return an ID.');
      }

      // 4. Navigate to claim view
      navigate(`/claim/${newClaimId}`);
    } catch (err: any) {
      console.error('Error submitting claim:', err);
      if (err.message?.includes('User rejected') || err.message?.includes('denied')) {
        setSubmitError({ message: 'Transaction was canceled in wallet.' });
      } else {
        setSubmitError({
          message: err.message || 'Failed to lodge claim on Studionet.',
          rawError: err.stack,
        });
      }
    } finally {
      clearInterval(timer);
      setIsSubmitting(false);
    }
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  return (
    <div className="page-container page-lodge-claim">
      <div className="breadcrumb-nav">
        <Link to="/" className="breadcrumb-link">
          &larr; Back to recent claims
        </Link>
      </div>

      <div className="form-layout-wrapper">
        <header className="page-header">
          <h1 className="page-heading">Lodge a Single-Fact Claim</h1>
          <p className="page-subheading">
            Submit an assertion together with its supporting source URL. GenLayer validators will fetch the webpage and evaluate whether the claim is grounded in verbatim normalized quotes.
          </p>
        </header>

        {!account && (
          <div className="wallet-prompt-banner">
            <p>A connected browser wallet on Studionet (Chain 61999) is required to lodge a claim.</p>
            <button type="button" className="btn-action-primary" onClick={() => connectWallet()}>
              Connect Wallet
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="claim-submission-form">
          {/* Claim Input */}
          <div className="form-field-group">
            <label htmlFor="claimText" className="field-label">
              Single-Fact Claim
            </label>
            <p className="field-hint">
              State a single factual assertion. Must be between 20 and 400 characters stripped.
            </p>
            <textarea
              id="claimText"
              rows={4}
              className={`input-textarea ${claimText.length > 0 && !claimValidation.isValid ? 'input-error' : ''}`}
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="e.g. Earth is the third planet from the Sun and the only astronomical object known to harbor life."
              disabled={isSubmitting}
              required
            />
            <div className="field-footer">
              <span className="char-count">
                {claimText.trim().length} / 400 characters (min 20)
              </span>
              {claimText.length > 0 && !claimValidation.isValid && (
                <span className="inline-validation-error">{claimValidation.error}</span>
              )}
            </div>
          </div>

          {/* Source URL Input */}
          <div className="form-field-group">
            <label htmlFor="sourceUrl" className="field-label">
              Source Webpage URL
            </label>
            <p className="field-hint">
              Direct public URL containing the cited sentence. Must use https://, port 443 or omitted, no localhost or private IP addresses, maximum 300 characters.
            </p>
            <input
              id="sourceUrl"
              type="url"
              className={`input-text ${sourceUrl.length > 0 && !urlValidation.isValid ? 'input-error' : ''}`}
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://en.wikipedia.org/wiki/Earth"
              disabled={isSubmitting}
              required
            />
            <div className="field-footer">
              <span className="char-count">
                {sourceUrl.trim().length} / 300 characters
              </span>
              {sourceUrl.length > 0 && !urlValidation.isValid && (
                <span className="inline-validation-error">{urlValidation.error}</span>
              )}
            </div>
          </div>

          {/* Notice on Contract Authority */}
          <div className="rules-note-box">
            <p className="rules-note-text">
              These client input boundaries mirror the smart contract's validation rules for convenience. The on-chain contract remains the sole authority.
            </p>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="outcome-banner outcome-failure" role="alert">
              <p className="outcome-message">{submitError.message}</p>
              {submitError.rawError && (
                <details className="raw-error-details">
                  <summary>Error stack</summary>
                  <code>{submitError.rawError}</code>
                </details>
              )}
            </div>
          )}

          {/* Waiting State */}
          {isSubmitting && (
            <div className="judging-waiting-state" role="status" aria-live="polite">
              <div className="waiting-spinner-track" />
              <div className="waiting-text-group">
                <p className="waiting-title">Registering claim on GenLayer Studionet...</p>
                <p className="waiting-time">Elapsed time: {elapsedSec}s (measured range: 8.4s – 8.7s, n=2)</p>
                {elapsedSec > 9 && (
                  <p className="waiting-longer-notice">
                    Taking longer than measured runs (measured maximum: 8.7s, n=2). Waiting for consensus receipt...
                  </p>
                )}
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

          {/* Action Button */}
          <div className="form-action-bar">
            <button
              type="submit"
              className="btn-action-primary"
              disabled={isSubmitting || (account ? !isFormValid : false)}
            >
              {!account ? 'Connect wallet to lodge' : isSubmitting ? 'Lodging...' : 'Lodge claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
